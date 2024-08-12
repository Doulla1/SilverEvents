import { PrismaClient } from '@prisma/client';
import { hashPassword } from '$lib/auth/auth';
import { sendResetPasswordEmail } from '$lib/email/registerEmail';
import { v4 as uuidv4 } from 'uuid';
import { isAdmin } from '$lib/rbac/accessControl';
import { json, type RequestHandler } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		// Vérifier si l'utilisateur connecté est un admin
		if (!isAdmin(locals.user)) {
			return json({ message: 'Accès refusé.' }, { status: 403 });
		}

		// Récupérer les données du formulaire
		let email, first_name, last_name, position;
		try {
			({ email, first_name, last_name, position } = await request.json());
		} catch (err) {
			console.error('Erreur lors de la lecture des données du formulaire:', err);
			return json({ message: 'Données de formulaire invalides.' }, { status: 400 });
		}

		// Validation des entrées
		if (!email || !first_name || !last_name || !position) {
			return json({ message: 'Tous les champs sont obligatoires.' }, { status: 400 });
		}

		// Vérifier si l'utilisateur existe déjà
		try {
			const userExists = await prisma.user.findUnique({ where: { email } });
			if (userExists) {
				return json({ message: 'Cet utilisateur existe déjà.' }, { status: 409 });
			}
		} catch (err) {
			console.error('Erreur lors de la vérification de l\'utilisateur:', err);
			return json({ message: 'Erreur interne lors de la vérification de l\'utilisateur.' }, { status: 500 });
		}

		// Créer un nouveau compte utilisateur
		let newUser;
		try {
			newUser = await prisma.user.create({
				data: {
					email,
					first_name,
					last_name,
					password: await hashPassword('ihhfsd_qfe5reGDFq'), // Mot de passe temporaire
					position,
					role_id: (await prisma.role.findUnique({ where: { role_name: 'Member' } }))?.id || undefined,
				}
			});
			console.log('Nouvel utilisateur créé: ', newUser);
		} catch (err) {
			console.error('Erreur lors de la création de l\'utilisateur:', err);
			return json({ message: 'Erreur interne lors de la création de l\'utilisateur.' }, { status: 500 });
		}

		// Générer un token de réinitialisation de mot de passe unique
		const resetToken = uuidv4();
		let hashedToken;
		try {
			hashedToken = await hashPassword(resetToken); // Hacher le token pour la sécurité
		} catch (err) {
			console.error('Erreur lors du hachage du token de réinitialisation:', err);
			return json({ message: 'Erreur interne lors de la génération du token de réinitialisation.' }, { status: 500 });
		}

		// Stocker le token dans la table PasswordReset
		try {
			await prisma.passwordReset.create({
				data: {
					user_id: newUser.id,
					token: hashedToken,
					expires_at: new Date(Date.now() + 3600000) // Token valable pour 1 heure
				}
			});
			console.log('Token de réinitialisation de mot de passe créé: ', resetToken);
		} catch (err) {
			console.error('Erreur lors de la création du token de réinitialisation dans la base de données:', err);
			return json({ message: 'Erreur interne lors du stockage du token de réinitialisation.' }, { status: 500 });
		}

		// Envoyer un email de réinitialisation de mot de passe avec le lien
		try {
			const resetLink = `${new URL('/reset-password', request.url).href}?token=${resetToken}&email=${email}`;
			await sendResetPasswordEmail(email, resetLink);
		} catch (err) {
			console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', err);
			return json({ message: 'Erreur interne lors de l\'envoi de l\'email de réinitialisation.' }, { status: 500 });
		}

		return json({ message: 'Utilisateur créé avec succès. Un email de réinitialisation de mot de passe a été envoyé.' }, { status: 201 });
	} catch (error) {
		console.error('Erreur générale lors de la création de l\'utilisateur:', error);
		return json({ message: 'Une erreur inattendue est survenue.' }, { status: 500 });
	}
};
