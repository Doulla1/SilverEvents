import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendResetPasswordEmail(to: string, resetLink: string) {
	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: parseInt(process.env.MAIL_PORT, 10),
		secure: process.env.MAIL_SECURE === 'true',
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.MAIL_FROM,
		to,
		subject: 'Réinitialisation de votre mot de passe',
		html: `
      <p>Bonjour,</p>
      <p> Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe et accéder à votre compte :</p>
      <p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Merci,</p>
      <p>L'équipe SilverEvents</p>
    `
	};

	await transporter.sendMail(mailOptions);
}
