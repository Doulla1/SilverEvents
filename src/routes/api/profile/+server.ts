import { PrismaClient } from '@prisma/client';
import { json, fail, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const PUT: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Non autorisé.' });

		// Obtenez les données de la requête
		const { first_name, last_name, email, profile_photo, position } = await request.json();

		// Mettez à jour uniquement les champs autorisés
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				first_name,
				last_name,
				email,
				profile_photo,
				position,
			},
		});

		return json({ user: updatedUser });
	} catch (error) {
		console.error('Erreur lors de la mise à jour du profil:', error);
		return fail(500, { message: 'Une erreur est survenue.' });
	}
};
