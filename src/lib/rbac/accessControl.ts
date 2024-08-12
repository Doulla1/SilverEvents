import type { User } from '@prisma/client';
import prisma from '$lib/prisma';

/**
 * Vérifie si l'utilisateur connecté est un administrateur.
 * @param user L'objet utilisateur provenant de `locals.user`.
 * @returns `true` si l'utilisateur est un admin, `false` sinon.
 */
export async function isAdmin(user: { role_id: number }): Promise<boolean> {
	const role = await prisma.role.findUnique({
		where: { id: user.role_id },
	});

	return role?.role_name === 'Admin';
}

/**
 * Vérifie si l'utilisateur connecté est un membre.
 * @param user L'objet utilisateur provenant de `locals.user`.
 * @returns `true` si l'utilisateur est un membre, `false` sinon.
 */
export function isMember(user: User): boolean {
	return user?.role?.role_name === 'Member';
}