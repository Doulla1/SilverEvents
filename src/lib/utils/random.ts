import { randomBytes } from 'crypto';

export const generateRandomPassword = (length: number = 16): string => {
	return randomBytes(length)
		.toString('base64')
		.slice(0, length)
		.replace(/[+/]/g, 'a');
};