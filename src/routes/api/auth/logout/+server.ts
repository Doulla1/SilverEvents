import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	cookies.set('token', '', {
		httpOnly: true,
		secure: true,
		maxAge: 0, // Expire immédiatement
		path: '/',
		sameSite: 'strict'
	});

	return json({ message: 'Déconnexion réussie' }, { status: 200 });
};
