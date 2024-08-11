import { PrismaClient } from '@prisma/client';
import { comparePassword } from '$lib/auth/auth';
import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const POST = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();

		// Validation des entrées
		if (!email || !password) {
			return json({ message: 'Email et mot de passe requis.' }, { status: 400 });
		}

		// Recherche de l'utilisateur par email
		const user = await prisma.user.findUnique({
			where: { email },
			include: { role: true }
		});

		// Vérification du mot de passe
		if (user && await comparePassword(password, user.password)) {

			// Création du payload JWT
			const tokenPayload = {
				id: user.id,
				email: user.email,
				role: user.role.role_name,
				name: `${user.first_name} ${user.last_name}`
			};

			// Génération du token JWT
			const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
				expiresIn: '1h', // Le token expire dans 1 heure
			});

			// Configurer le cookie
			cookies.set('token', token, {
				httpOnly: true, // Empêche l'accès par JavaScript côté client
				secure: true,   // Assure que le cookie est envoyé uniquement sur HTTPS
				maxAge: 3600,   // Expire en 1 heure
				path: '/',      // Disponible sur tout le site
				sameSite: 'strict' // Réduit les attaques CSRF
			});

			// Réponse sans le token car il est stocké dans le cookie
			return json({
				message: 'Connexion réussie',
				user: {
					id: user.id,
					email: user.email,
					role: user.role.role_name
				}
			}, { status: 200 });
		}

		// Si l'authentification échoue
		return json({ message: 'Email ou mot de passe incorrect.' }, { status: 401 });
	} catch (error) {
		console.error('Erreur lors de la connexion:', error);
		return json({ message: 'Une erreur est survenue.' }, { status: 500 });
	}
};
