import { PrismaClient } from '@prisma/client';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }) => {
	try {
		const event = await prisma.event.findUnique({
			where: { id: parseInt(params.id) },
			include: {
				creator: true, // Inclure les détails du créateur
				registrations: {
					include: {
						user: true, // Inclure les détails des utilisateurs inscrits
					},
				},
			},
		});

		if (!event) {
			return json({ message: 'Événement non trouvé.' }, { status: 404 });
		}

		return json({ event }, { status: 200 });
	} catch (error) {
		console.log('Erreur lors de la récupération de l\'événement:', error);
		return json({ message: 'Une erreur est survenue.' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, params, locals }) => {
	try {
		const user = locals.user;
		const eventId = params.id;

		if (!user) {
			return fail(401, { message: 'Accès refusé. Veuillez vous connecter.' });
		}

		const formData = await request.formData();

		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const start_date = formData.get('start_date') as string;
		const end_date = formData.get('end_date') as string;
		const location = formData.get('location') as string;
		const removeCoverImage = formData.get('removeCoverImage') === 'true';
		const cover_image = formData.get('cover_image') as File | null;

		if (!title || !start_date || !end_date || !location) {
			return fail(400, { message: 'Tous les champs requis doivent être remplis.' });
		}

		const event = await prisma.event.findUnique({
			where: { id: parseInt(eventId) }
		});

		if (!event) {
			return fail(404, { message: 'Événement non trouvé.' });
		}

		// Vérifier si l'utilisateur est autorisé à modifier cet événement
		if (event.created_by !== user.id && user.role !== 'Admin') {
			return fail(403, { message: 'Accès refusé. Vous n\'êtes pas autorisé à modifier cet événement.' });
		}

		// Gestion de l'image de couverture
		let coverImagePath = event.cover_image;

		if (removeCoverImage && coverImagePath) {
			// Supprimer l'image existante si demandée
			fs.unlinkSync(path.join(process.cwd(), 'static', coverImagePath));
			coverImagePath = null;
		}

		if (cover_image && cover_image.size > 0) {
			// Enregistrer la nouvelle image
			const uploadDir = path.join(process.cwd(), 'static/uploads/events');
			const filePath = path.join(uploadDir, cover_image.name);

			// Créer le répertoire si nécessaire
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			// Écrire le fichier sur le disque
			fs.writeFileSync(filePath, Buffer.from(await cover_image.arrayBuffer()));

			coverImagePath = `/uploads/events/${cover_image.name}`;
		}

		// Mettre à jour l'événement dans la base de données
		const updatedEvent = await prisma.event.update({
			where: { id: parseInt(eventId) },
			data: {
				title,
				description,
				start_date: new Date(start_date),
				end_date: new Date(end_date),
				location,
				cover_image: coverImagePath,
			},
		});

		return json({ message: 'Événement mis à jour avec succès.', event: updatedEvent }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de l\'événement:', error);
		return fail(500, { message: 'Une erreur est survenue.' });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const user = locals.user;
		const eventId = parseInt(params.id);

		if (!user) {
			return fail(401, { message: 'Accès refusé. Veuillez vous connecter.' });
		}

		// Trouver l'événement
		const event = await prisma.event.findUnique({
			where: { id: eventId }
		});

		if (!event) {
			return fail(404, { message: 'Événement non trouvé.' });
		}

		// Vérifier si l'utilisateur est autorisé à supprimer cet événement
		if (event.created_by !== user.id && user.role !== 'Admin') {
			return fail(403, { message: 'Accès refusé. Vous n\'êtes pas autorisé à supprimer cet événement.' });
		}

		// Supprimer l'événement de la base de données
		await prisma.event.delete({
			where: { id: eventId }
		});

		// Supprimer l'image de couverture associée, si elle existe
		if (event.cover_image) {
			const imagePath = path.join(process.cwd(), 'static', event.cover_image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		return json({ message: 'Événement supprimé avec succès.' }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la suppression de l\'événement:', error);
		return fail(500, { message: 'Une erreur est survenue lors de la suppression de l\'événement.' });
	}
};
