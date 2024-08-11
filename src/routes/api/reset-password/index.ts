import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '$lib/auth/auth';
import type { RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * Réinitialise le mot de passe de l'utilisateur.
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { token, email, newPassword } = await request.json();

		// Rechercher l'utilisateur par email
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return {
				status: 400,
				body: { message: 'Utilisateur introuvable.' }
			};
		}

		// Vérifier si le token correspond au mot de passe temporaire haché
		const isValidToken = await comparePassword(token, user.password);
		if (!isValidToken) {
			return {
				status: 400,
				body: { message: 'Token invalide ou expiré.' }
			};
		}

		// Hacher le nouveau mot de passe
		const hashedNewPassword = await hashPassword(newPassword);

		// Mettre à jour le mot de passe de l'utilisateur
		await prisma.user.update({
			where: { email },
			data: {
				password: hashedNewPassword
			}
		});

		return {
			status: 200,
			body: { message: 'Mot de passe réinitialisé avec succès.' }
		};
	} catch (error) {
		console.error('Erreur lors de la réinitialisation du mot de passe:', error);
		return {
			status: 500,
			body: { message: 'Une erreur est survenue.' }
		};
	}
};
