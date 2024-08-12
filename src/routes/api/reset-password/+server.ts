import { PrismaClient } from '@prisma/client';
import { hashPassword } from '$lib/auth/auth';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Réinitialise le mot de passe de l'utilisateur.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { token, email, newPassword } = await request.json();

	// Trouver l'utilisateur par email
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return json({ message: 'Utilisateur non trouvé.' }, { status: 404 });
	}

	// Récupérer le token de réinitialisation stocké
	const passwordReset = await prisma.passwordReset.findFirst({
		where: {
			user_id: user.id,
			expires_at: { gt: new Date() }, // Le token n'est pas expiré
		},
	});

	if (!passwordReset) {
		return json({ message: 'Token invalide ou expiré.' }, { status: 400 });
	}

	// Comparer le token fourni avec le token haché
	const isValid = await bcrypt.compare(token, passwordReset.token);
	if (!isValid) {
		return json({ message: 'Token invalide.' }, { status: 400 });
	}

	// Mettre à jour le mot de passe de l'utilisateur
	const hashedNewPassword = await hashPassword(newPassword);
	await prisma.user.update({
		where: { id: user.id },
		data: { password: hashedNewPassword },
	});

	// Supprimer le token de réinitialisation après utilisation
	await prisma.passwordReset.delete({ where: { id: passwordReset.id } });

	return json({ message: 'Mot de passe réinitialisé avec succès.' }, { status: 200 });
};