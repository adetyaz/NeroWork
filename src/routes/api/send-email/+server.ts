import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
// @ts-expect-error - SvelteKit environment module
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const { to, subject, content } = await request.json();

		// Gmail SMTP configuration
		const gmailUser = env.GMAIL_USER;
		const gmailPassword = env.GMAIL_APP_PASSWORD; // Use App Password, not regular password

		if (!gmailUser || !gmailPassword) {
			console.error('Gmail configuration missing');
			return json({ error: 'Email service not configured' }, { status: 500 });
		}

		// Create transporter
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: gmailUser,
				pass: gmailPassword
			}
		});

		// Email options
		const mailOptions = {
			from: `"NeroWork" <${gmailUser}>`,
			to: to,
			subject: subject,
			text: content,
			html: formatEmailContent(content)
		};

		console.log('📧 Sending email via Gmail:', { to, subject });

		// Send email
		const result = await transporter.sendMail(mailOptions);

		console.log('✅ Email sent successfully:', result.messageId);

		return json({
			success: true,
			messageId: result.messageId
		});
	} catch (error) {
		console.error('Error sending email:', error);
		return json({ error: 'Failed to send email: ' + error.message }, { status: 500 });
	}
}

/**
 * Format email content as HTML
 */
function formatEmailContent(content: string): string {
	return content
		.replace(/\n/g, '<br>')
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/^- (.*$)/gim, '<li>$1</li>')
		.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
}
