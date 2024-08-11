import bcrypt from 'bcrypt';

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
