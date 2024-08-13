import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		// Vérifier que l'utilisateur est connecté
		const user = locals.user;
		if (!user) {
			return json({ message: 'Accès refusé. Veuillez vous connecter.' }, { status: 401 });
		}

		const { title, start_date, end_date, location, cover_image } = await request.json();

		// Valider les entrées
		if (!title || !start_date || !end_date || !location) {
			return json({ message: 'Tous les champs requis doivent être remplis.' }, { status: 400 });
		}

		// Créer un nouvel événement
		const event = await prisma.event.create({
			data: {
				title,
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
		return json({ message: 'Une erreur est survenue.' }, { status: 500 });
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
		return json({ message: 'Une erreur est survenue.' }, { status: 500 });
	}
};

