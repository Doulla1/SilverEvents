import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Utilisez une clé secrète sécurisée


// Fonction pour hacher un mot de passe
export async function hashPassword(password: string) {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
}

// Fonction pour comparer un mot de passe avec un hash
export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}

export function deleteAuthToken(cookies) {
	cookies.delete('token', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict'
	});
}

/**
 * Vérifie un token JWT et retourne l'utilisateur associé s'il est valide.
 *
 * @param token - Le token JWT à vérifier.
 * @returns L'utilisateur associé au token ou `null` si le token est invalide.
 */
export async function getUserFromToken(token: string) {
	try {
		// Vérifier et décoder le token
		const decoded = jwt.verify(token, JWT_SECRET);

		// Extraire l'ID utilisateur du token
		const userId = decoded?.id;

		if (!userId) {
			return null;
		}

		// Récupérer l'utilisateur dans la base de données
		const user = await prisma.user.findUnique({
			where: { id: userId }
		});

		return user || null;
	} catch (error) {
		console.error('Erreur lors de la validation du token:', error);
		return null;
	}
}