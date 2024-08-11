import jwt from 'jsonwebtoken';

export async function load({ cookies }) {
	const token = cookies.get('token');

	if (token) {
		try {
			// Décodage et vérification du token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Renvoie le token décodé aux composants enfants
			return {
				session: {
					user: decoded
				}
			};
		} catch (error) {
			console.error('Erreur lors de la vérification du token:', error);
			// Si le token est invalide ou a expiré, on le supprime
			cookies.delete('token');
		}
	}

	// Si aucun token n'existe ou est invalide, on renvoie null ou undefined
	return {
		session: null
	};
}
