import { PrismaClient } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '$lib/auth/auth';
import { sendResetPasswordEmail } from '$lib/email/resetPassword';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email } = await request.json();

		// Vérifier si l'utilisateur existe
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return json({ message: 'Si cette adresse e-mail est associée à un compte, un lien de réinitialisation de mot de passe vous sera envoyé.' }, { status: 200 });
		}

		// Générer un token unique
		const resetToken = uuidv4();
		const hashedToken = await hashPassword(resetToken);

		// Enregistrer le token dans la base de données
		const expirationTime = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1); // Expire dans 1 heure

		await prisma.passwordReset.create({
			data: {
				user_id: user.id,
				token: hashedToken,
				expires_at: expirationTime,
			},
		});

		// Envoyer l'e-mail de réinitialisation
		const resetLink = `${new URL('/reset-password', request.url).href}?token=${resetToken}&email=${email}`;
		await sendResetPasswordEmail(email, resetLink);

		return json({ message: 'Si cette adresse e-mail est associée à un compte, un lien de réinitialisation de mot de passe vous sera envoyé.' }, { status: 200 });
	} catch (error) {
		console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
		return json({ message: 'Une erreur est survenue.' }, { status: 500 });
	}
};
