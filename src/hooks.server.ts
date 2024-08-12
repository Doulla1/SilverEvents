// src/hooks.server.ts
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
			//console.log('Hook server:', user);
			event.locals.user = user;
			//console.log('Hook server:', event.locals.user.role_id);
		}
	}

	// Continuer à traiter la requête
	const response = await resolve(event);
	return response;
};
