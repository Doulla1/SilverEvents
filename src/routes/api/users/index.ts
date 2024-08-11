import { PrismaClient } from '@prisma/client';
import { hashPassword } from '$lib/auth/auth';
import { sendResetPasswordEmail } from '$lib/email/registerEmail';
import { v4 as uuidv4 } from 'uuid';
import { isAdmin } from '$lib/rbac/accessControl';
import type { RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		// Vérifier si l'utilisateur connecté est un admin
		if (!isAdmin(locals.user)) {
			return {
				status: 403,
				body: { message: 'Accès refusé.' }
			};
		}

		// Récupérer les données du formulaire
		const { email, first_name, last_name, position } = await request.json();

		// Vérifier si l'utilisateur existe déjà
		const userExists = await prisma.user.findUnique({ where: { email } });
		if (userExists) {
			return {
				status: 409,
				body: { message: 'Cet utilisateur existe déjà.' }
			};
		}

		// Générer un token de réinitialisation de mot de passe unique
		const resetToken = uuidv4();
		const hashedToken = await hashPassword(resetToken); // Hacher le token pour la sécurité

		// Créer un nouveau compte avec un mot de passe temporaire
		const newUser = await prisma.user.create({
			data: {
				email,
				first_name,
				last_name,
				password: hashedToken, // Stocker le token haché en tant que mot de passe temporaire
				position,
				role_id: (await prisma.role.findUnique({ where: { role_name: 'Member' } }))?.id
			}
		});

		// Envoyer un email de réinitialisation de mot de passe avec le lien
		const resetLink = `${request.url.origin}/reset-password?token=${resetToken}&email=${email}`;
		await sendResetPasswordEmail(email, resetLink);

		return {
			status: 201,
			body: { message: 'Utilisateur créé avec succès. Un email de réinitialisation de mot de passe a été envoyé.' }
		};
	} catch (error) {
		console.error('Erreur lors de la création de l\'utilisateur:', error);
		return {
			status: 500,
			body: { message: 'Une erreur est survenue.' }
		};
	}
};
