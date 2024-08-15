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

		// Vérifier si l'utilisateur est bien inscrit
		const existingRegistration = await prisma.eventRegistration.findFirst({
			where: {
				event_id: eventId,
				user_id: user.id
			}
		});

		if (!existingRegistration) {
			return fail(400, { message: 'Vous n\'êtes pas inscrit à cet événement.' });
		}

		// Désinscrire l'utilisateur de l'événement
		await prisma.eventRegistration.delete({
			where: {
				id: existingRegistration.id
			}
		});

		return json({ message: 'Désinscription réussie.' }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la désinscription:', error);
		return fail(500, { message: 'Une erreur est survenue lors de la désinscription.' });
	}
};
