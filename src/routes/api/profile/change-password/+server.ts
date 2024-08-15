import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '$lib/auth/auth';
import { fail, json, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const PUT: RequestHandler = async ({ request, locals }) => {
	try {
		// Vérification que l'utilisateur est connecté
		const user = locals.user;
		if (!user) return fail(401, { message: 'Non autorisé.' });

		// Récupération des données de la requête
		const { oldPassword, newPassword } = await request.json();

		// Validation des entrées
		if (!oldPassword || !newPassword) {
			return fail(400, { message: 'Tous les champs sont obligatoires.' });
		}

		if (newPassword.length < 8) {
			return fail(400, { message: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' });
		}

		// Vérification du mot de passe actuel
		const isValid = await comparePassword(oldPassword, user.password);
		if (!isValid) {
			return fail(400, { message: 'Le mot de passe actuel est incorrect.' });
		}

		// Vérification si le nouveau mot de passe est identique à l'ancien
		const isSamePassword = await comparePassword(newPassword, user.password);
		if (isSamePassword) {
			return fail(400, { message: 'Le nouveau mot de passe ne peut pas être identique à l\'ancien.' });
		}

		// Hachage du nouveau mot de passe
		const hashedPassword = await hashPassword(newPassword);

		// Mise à jour du mot de passe dans la base de données
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: { password: hashedPassword },
		});

		return json({ message: 'Mot de passe mis à jour avec succès.', user: updatedUser });
	} catch (error) {
		console.error('Erreur lors de la mise à jour du mot de passe:', error);
		return fail(500, { message: 'Une erreur est survenue lors de la mise à jour du mot de passe.' });
	}
};
