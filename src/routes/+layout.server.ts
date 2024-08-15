import jwt from 'jsonwebtoken';
import { user as userStore } from '$lib/stores/user'; // Import du store utilisateur
import { browser } from '$app/environment'; // Vérifie si le code est exécuté côté client
import dotenv from 'dotenv';

dotenv.config();

export async function load({ cookies }) {
	const token = cookies.get('token');

	let decoded = null;

	if (token) {
		try {
			// Décodage et vérification du token
			decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Si on est côté client, on met à jour le store avec les infos utilisateur
			if (browser) {
				userStore.set(decoded);
			}

		} catch (error) {
			console.error('Erreur lors de la vérification du token:', error);
			// Si le token est invalide ou a expiré, on le supprime
			cookies.delete('token');
		}
	}

	// Si aucun token n'existe ou est invalide, on renvoie null ou undefined
	if (!decoded && browser) {
		userStore.set(null); // Réinitialisation du store côté client si nécessaire
	}

	return {
		session: decoded ? { user: decoded } : null
	};
}
