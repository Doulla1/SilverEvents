// src/hooks.+server.ts
import { getUserFromToken } from '$lib/auth/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Récupérer le token depuis les cookies
	const token = event.cookies.get('token');

	if (token) {
		// Valider le token et récupérer l'utilisateur
		const user = await getUserFromToken(token);
		if (user) {
			// Stocker l'utilisateur dans `locals`
			event.locals.user = user;
		}
		else{
			// Supprimer le token invalide
			event.cookies.delete('token', {path: '/', httpOnly: true, secure: true, sameSite: 'strict'});
		}
	}

	// Continuer à traiter la requête
	return await resolve(event);
};
