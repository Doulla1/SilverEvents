import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(to: string, resetLink: string) {
	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: true,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to,
		subject: 'Réinitialisation de votre mot de passe',
		html: `
      <p>Bonjour,</p>
      <p>Vous avez été invité à rejoindre notre plateforme. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe et accéder à votre compte :</p>
      <p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Merci,</p>
      <p>L'équipe SilverEvents</p>
    `
	};

	await transporter.sendMail(mailOptions);
}
