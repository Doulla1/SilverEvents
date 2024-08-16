import { deleteAuthToken } from '$lib/auth/auth';
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
	// Supprimer le cookie contenant le token JWT
	deleteAuthToken(cookies);

	// Rediriger vers la page de login après la déconnexion
	throw redirect(303, '/login');
}
