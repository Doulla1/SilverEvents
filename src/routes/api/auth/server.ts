import { SvelteKitAuth } from '@auth/sveltekit';
import CredentialsProvider from '@auth/core/providers/credentials';
import { PrismaClient } from '@prisma/client';
import {comparePassword } from '$lib/auth/auth';

const prisma = new PrismaClient();

export const handle = SvelteKitAuth({
	providers: [
		// Authentification par email et mot de passe
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: { email: credentials.email }
				});

				if (!user) {
					throw new Error('No user found');
				}

				const isValid = await comparePassword(credentials.password, user.password);

				if (!isValid) {
					throw new Error('Incorrect password');
				}

				return {
					id: user.id,
					email: user.email,
					name: `${user.first_name} ${user.last_name}`,
					role: user.role.role_name
				};
			}
		})
	],
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		}
	},
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: 'jwt'
	}
});
