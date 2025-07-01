#!/usr/bin/env node

/**
 * Simple MailerSend API test using basic HTTP request
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function testMailerSendAPI() {
	const apiKey = process.env.MAILERSEND_API_KEY;

	if (!apiKey) {
		console.error('❌ MAILERSEND_API_KEY not found');
		return;
	}

	console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');

	const emailData = {
		from: {
			email: 'noreply@trial-3vz9dle7jj545q2x.mlsender.net',
			name: 'NeroWork'
		},
		to: [
			{
				email: 'illtiger3m@gmail.com',
				name: 'Test User'
			}
		],
		subject: 'Test from NeroWork',
		text: 'This is a test email from NeroWork',
		html: '<h1>Test Email</h1><p>This is a test email from NeroWork</p>'
	};

	try {
		console.log('🚀 Sending email via MailerSend API...');

		const response = await fetch('https://api.mailersend.com/v1/email', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest'
			},
			body: JSON.stringify(emailData)
		});

		console.log('📊 Response status:', response.status);
		console.log('📊 Response headers:', Object.fromEntries(response.headers));

		const responseText = await response.text();
		console.log('📊 Response body:', responseText);

		if (response.ok) {
			console.log('✅ Email sent successfully!');
			const result = JSON.parse(responseText);
			console.log('📨 Message ID:', result.data?.id || 'N/A');
		} else {
			console.error('❌ Failed to send email');
			try {
				const errorData = JSON.parse(responseText);
				console.error('Error details:', errorData);
			} catch (e) {
				console.error('Raw error response:', responseText);
			}
		}
	} catch (error) {
		console.error('❌ Network error:', error.message);
	}
}

console.log('🧪 Testing MailerSend API directly...');
testMailerSendAPI();
