import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '$lib/auth/auth';
import { json, fail, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const PUT: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Non autorisé.' });

		const data = await request.json();
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data,
		});

		return json({ user: updatedUser });
	} catch (error) {
		console.error('Erreur lors de la mise à jour du profil:', error);
		return fail(500, { message: 'Une erreur est survenue.' });
	}
};


