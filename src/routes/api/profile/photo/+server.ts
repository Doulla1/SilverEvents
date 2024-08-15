// src/routes/profile/photo/+server.ts
import { PrismaClient } from '@prisma/client';
import { fail, json, type RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Non autorisé.' });

		// Récupérer le fichier envoyé
		const formData = await request.formData();
		const file = formData.get('profile_photo') as File;

		if (!file) {
			return fail(400, { message: 'Aucun fichier envoyé.' });
		}

		// Définir le chemin de sauvegarde du fichier
		const fileName = `${user.id}_${Date.now()}_${file.name}`;
		const filePath = path.join('static/uploads/profiles', fileName);

		// Créer le dossier s'il n'existe pas
		const uploadDir = path.dirname(filePath);
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		// Sauvegarder le fichier
		const fileBuffer = await file.arrayBuffer();
		fs.writeFileSync(filePath, Buffer.from(fileBuffer));

		// Mettre à jour le chemin de la photo dans la base de données
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: { profile_photo: `/uploads/profiles/${fileName}` },
		});

		return json({ user: updatedUser });
	} catch (error) {
		console.error('Erreur lors de l\'upload de la photo de profil:', error);
		return fail(500, { message: 'Une erreur est survenue.' });
	}
};

export const DELETE: RequestHandler = async ({ locals }) => {
	try {
		const user = locals.user;
		if (!user) return fail(401, { message: 'Non autorisé.' });

		// Vérifiez si l'utilisateur a une photo de profil
		if (user.profile_photo) {
			// Supprimer le fichier de la photo de profil du système de fichiers
			const filePath = path.join(process.cwd(), 'static', user.profile_photo);
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}

			// Mettre à jour le profil de l'utilisateur dans la base de données
			const updatedUser = await prisma.user.update({
				where: { id: user.id },
				data: { profile_photo: null },
			});

			return json({ user: updatedUser });
		} else {
			return fail(400, { message: 'Aucune photo de profil à supprimer.' });
		}
	} catch (error) {
		console.error('Erreur lors de la suppression de la photo de profil:', error);
		return fail(500, { message: 'Une erreur est survenue.' });
	}
};