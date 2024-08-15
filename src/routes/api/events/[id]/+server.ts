import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ params }) => {
	try {
		const event = await prisma.event.findUnique({
			where: { id: parseInt(params.id) },
			include: {
				creator: true, // Inclure les détails du créateur
				registrations: true, // Inclure les inscriptions
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

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	try {
		const session = locals.session;
		if (!session) {
			return json({ message: 'Accès refusé. Veuillez vous connecter.' }, { status: 401 });
		}

		const { title, start_date, end_date, location, cover_image } = await request.json();

		if (!title || !start_date || !end_date || !location) {
			return json({ message: 'Tous les champs requis doivent être remplis.' }, { status: 400 });
		}

		const event = await prisma.event.findUnique({ where: { id: parseInt(params.id) } });
		if (!event || event.created_by !== session.user.id) {
			return json({ message: 'Événement non trouvé ou accès refusé.' }, { status: 404 });
		}

		const updatedEvent = await prisma.event.update({
			where: { id: parseInt(params.id) },
			data: {
				title,
				start_date: new Date(start_date),
				end_date: new Date(end_date),
				location,
				cover_image,
			},
		});

		return json({ message: 'Événement mis à jour avec succès.', event: updatedEvent }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la mise à jour de l\'événement:', error);
		return json({ message: 'Une erreur est survenue.' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	try {
		const session = locals.session;
		if (!session) {
			return json({ message: 'Accès refusé. Veuillez vous connecter.' }, { status: 401 });
		}

		const event = await prisma.event.findUnique({ where: { id: parseInt(params.id) } });
		if (!event || event.created_by !== session.user.id) {
			return json({ message: 'Événement non trouvé ou accès refusé.' }, { status: 404 });
		}

		await prisma.event.delete({ where: { id: parseInt(params.id) } });

		return json({ message: 'Événement supprimé avec succès.' }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la suppression de l\'événement:', error);
		return json({ message: 'Une erreur est survenue.' }, { status: 500 });
	}
};
