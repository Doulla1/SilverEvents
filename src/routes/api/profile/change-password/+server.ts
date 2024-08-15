import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '$lib/auth/auth';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const PUT: ({ request, locals }: { request: any; locals: any }) => Promise<Response> = async ({ request, locals }) => {
	try {
		// Vérification que l'utilisateur est connecté
		const user = locals.user;
		if (!user) return new Response(JSON.stringify({ message: 'Non autorisé.' }), { status: 401 });

		// Récupération des données de la requête
		const { oldPassword, newPassword } = await request.json();

		// Validation des entrées
		if (!oldPassword || !newPassword) {
			return new Response(JSON.stringify({ message: 'Tous les champs sont obligatoires.' }), { status: 400 });
		}

		if (newPassword.length < 8) {
			return new Response(JSON.stringify({ message: 'Le nouveau mot de passe doit comporter au moins 8 caractères.' }), { status: 400 });
		}

		// Vérification du mot de passe actuel
		const isValid = await comparePassword(oldPassword, user.password);
		if (!isValid) {
			return new Response(JSON.stringify({ message: 'Le mot de passe actuel est incorrect.' }), { status: 400 });
		}

		// Vérification si le nouveau mot de passe est identique à l'ancien
		const isSamePassword = await comparePassword(newPassword, user.password);
		if (isSamePassword) {
			return new Response(JSON.stringify({ message: 'Le nouveau mot de passe ne peut pas être identique à l\'ancien.' }), { status: 400 });
		}

		// Hachage du nouveau mot de passe
		const hashedPassword = await hashPassword(newPassword);

		// Mise à jour du mot de passe dans la base de données
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: { password: hashedPassword },
		});

		return json({ message: 'Mot de passe mis à jour avec succès.', user: updatedUser });
	} catch (error) {
		console.error('Erreur lors de la mise à jour du mot de passe:', error);
		return new Response(JSON.stringify({ message: 'Une erreur est survenue lors de la mise à jour du mot de passe.' }), { status: 500 });
	}
};
