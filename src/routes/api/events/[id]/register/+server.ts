import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler, fail } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ params, locals }) => {
	try {
		const user = locals.user;
		const eventId = parseInt(params.id);

		if (!user) {
			return fail(401, { message: 'Accès refusé. Veuillez vous connecter.' });
		}

		// Vérifier si l'utilisateur est déjà inscrit
		const existingRegistration = await prisma.eventRegistration.findFirst({
			where: {
				event_id: eventId,
				user_id: user.id
			}
		});

		if (existingRegistration) {
			return fail(400, { message: 'Vous êtes déjà inscrit à cet événement.' });
		}

		// Inscrire l'utilisateur à l'événement
		await prisma.eventRegistration.create({
			data: {
				event_id: eventId,
				user_id: user.id
			}
		});

		return json({ message: 'Inscription réussie.' }, { status: 201 });
	} catch (error) {
		console.error('Erreur lors de l\'inscription:', error);
		return fail(500, { message: 'Une erreur est survenue lors de l\'inscription.' });
	}
};
