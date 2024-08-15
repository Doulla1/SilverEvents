import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler, fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return fail(401, { message: 'Accès refusé. Veuillez vous connecter.' });
		}

		const formData = await request.formData();

		// Récupérer les champs du formulaire
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const start_date = formData.get('start_date') as string;
		const end_date = formData.get('end_date') as string;
		const location = formData.get('location') as string;
		const coverImageFile = formData.get('cover_image') as File;

		if (!title || !start_date || !end_date || !location) {
			return fail(400, { message: 'Tous les champs requis doivent être remplis.' });
		}

		let cover_image = null;

		// Si un fichier d'image est téléversé, l'enregistrer dans le répertoire statique
		if (coverImageFile && coverImageFile.size > 0) {
			const uploadDir = path.join(process.cwd(), 'static/uploads/events');
			const filePath = path.join(uploadDir, coverImageFile.name);

			// Créer le répertoire si nécessaire
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			// Écrire le fichier sur le disque
			fs.writeFileSync(filePath, Buffer.from(await coverImageFile.arrayBuffer()));

			// Stocker le chemin relatif pour l'accès depuis le front-end
			cover_image = `/uploads/events/${coverImageFile.name}`;
		}

		// Créer l'événement dans la base de donnée
		const event = await prisma.event.create({
			data: {
				title,
				description,
				start_date: new Date(start_date),
				end_date: new Date(end_date),
				location,
				cover_image,
				created_by: user.id,
			},
		});

		return json({ message: 'Événement créé avec succès.', event }, { status: 201 });
	} catch (error) {
		console.error('Erreur lors de la création de l\'événement:', error);
		return fail(500, { message: 'Une erreur est survenue.' });
	}
};

export const GET: RequestHandler = async () => {
	try {
		const events = await prisma.event.findMany({
			include: {
				creator: true, // Inclure les détails du créateur
			},
		});

		return json({ events }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la récupération des événements:', error);
		return fail(500, { message: 'Une erreur est survenue.' });
	}
};
