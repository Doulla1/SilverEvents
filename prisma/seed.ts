import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth/auth'; // Assurez-vous que le chemin vers le fichier auth.ts est correct
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();


// Initialiser le client Prisma
const prisma = new PrismaClient();

async function main() {
	try {
		// Vérifier que toutes les variabmes d'environnement nécessaires sont définies
		const adminEmail = process.env.ADMIN_EMAIL;
		const adminPassword = process.env.ADMIN_PASSWORD;
		const adminFirstName = process.env.ADMIN_FIRST_NAME;
		const adminLastName = process.env.ADMIN_LAST_NAME;

		if (!adminEmail || !adminPassword || !adminFirstName || !adminLastName) {
			throw new Error('Les variables d\'environnement ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, et ADMIN_LAST_NAME doivent être définies.');
		}

		// Vérifier et créer les rôles Admin et Member s'ils n'existent pas
		const adminRole = await prisma.role.upsert({
			where: { role_name: 'Admin' },
			update: {}, // Si le rôle existe déjà, ne rien faire
			create: { role_name: 'Admin' } // Si le rôle n'existe pas, le créer
		});

		const memberRole = await prisma.role.upsert({
			where: { role_name: 'Member' },
			update: {}, // Si le rôle existe déjà, ne rien faire
			create: { role_name: 'Member' } // Si le rôle n'existe pas, le créer
		});

		// Vérifier si un admin avec cet email existe déjà
		const adminExists = await prisma.user.findFirst({
			where: { email: adminEmail }
		});

		if (adminExists) {
			console.log('Un administrateur avec cet email existe déjà. Aucune action nécessaire.');
			return;
		}

		// Hacher le mot de passe de l'admin
		const hashedPassword = await hashPassword(adminPassword);

		// Créer l'admin initial
		await prisma.user.create({
			data: {
				email: adminEmail,
				first_name: adminFirstName,
				last_name: adminLastName,
				password: hashedPassword,
				role_id: adminRole.id,
				position: 'Administrator'
			}
		});

		console.log('Administrateur initial créé avec succès.');
	} catch (error) {
		console.error('Erreur lors de la création de l\'administrateur initial:', error);
		throw error; // Lancer l'erreur pour être capturé par le bloc .catch() de main()
	}
}

// Exécuter la fonction principale
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error('Erreur lors de l\'exécution du script:', error);
		await prisma.$disconnect();
		process.exit(1); // Terminer le processus avec un code d'erreur
	});
