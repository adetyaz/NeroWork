import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
// @ts-expect-error - SvelteKit environment module
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
	try {
		const { to, subject, content } = await request.json();

		const resendApiKey = env.RESEND_API_KEY;
		if (!resendApiKey) {
			console.error('RESEND_API_KEY not found in environment variables');
			return json({ error: 'Email service not configured' }, { status: 500 });
		}

		const resend = new Resend(resendApiKey);

		const emailData = {
			from: 'NeroWork <onboarding@resend.dev>', // Resend's default sender for testing
			to: [to],
			subject,
			html: formatEmailContent(content),
			text: content
		};

		console.log('📧 Sending reminder email via Resend:', { to, subject });

		const result = await resend.emails.send(emailData);

		if (result.error) {
			console.error('Resend email error:', result.error);
			return json({ error: result.error.message }, { status: 500 });
		}

		console.log('✅ Email sent successfully:', result.data?.id);

		return json({
			success: true,
			messageId: result.data?.id
		});
	} catch (error) {
		console.error('Error sending email:', error);
		return json({ error: 'Failed to send email' }, { status: 500 });
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
