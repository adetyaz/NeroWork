#!/usr/bin/env node

/**
 * Test Resend email service
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

async function testResend() {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) {
		console.error('❌ RESEND_API_KEY not found in .env file');
		return;
	}

	console.log('🔑 API Key loaded:', apiKey.substring(0, 10) + '...');

	try {
		console.log('🧪 Testing Resend connection...');

		const resend = new Resend(apiKey);

		const emailData = {
			from: 'NeroWork <onboarding@resend.dev>', // Resend's default test sender
			to: ['illtiger3m@gmail.com'], // Your email
			subject: 'Test from NeroWork via Resend',
			html: '<h1>Test Email</h1><p>Resend is working correctly with NeroWork!</p>',
			text: 'Test Email - Resend is working correctly with NeroWork!'
		};

		console.log('📧 Sending test email to:', emailData.to[0]);
		console.log('📤 Using sender:', emailData.from);

		const result = await resend.emails.send(emailData);

		if (result.error) {
			console.error('❌ Resend error:', result.error);
		} else {
			console.log('✅ Email sent successfully!');
			console.log('📨 Message ID:', result.data?.id);
			console.log('📬 Check your email inbox!');
		}
	} catch (error) {
		console.error('❌ Error testing Resend:', error.message);
		console.error('Full error:', error);
	}
}

console.log('🚀 Testing Resend for NeroWork');
console.log('================================\n');

testResend();
