import jwt from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

export async function load({ cookies, locals }) {
	const token = cookies.get('token');

	if (!token) {
		// Si aucun token, rediriger vers la page de login
		console.log("erreur de token");
		throw redirect(307, '/login');
	}

	try {
		// Vérification et décodage du token
		// Stocker la session dans `locals`
		locals.session = jwt.verify(token, process.env.JWT_SECRET);

		// Retourner la session pour la passer au composant Svelte
		return { session: locals.session };
	} catch (err) {
		// Si le token est invalide ou expiré, rediriger vers la page de login
		console.error('Erreur lors de la vérification du token:', err);
		throw redirect(307, '/login');
	}
}
