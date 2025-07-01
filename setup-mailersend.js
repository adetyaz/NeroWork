#!/usr/bin/env node

/**
 * MailerSend Setup Guide
 *
 * This script helps you set up MailerSend for the NeroWork payment reminder system.
 *
 * Steps to get your MailerSend API key:
 * 1. Go to https://www.mailersend.com/
 * 2. Sign up for a free account (up to 3,000 emails/month)
 * 3. Verify your email address
 * 4. Go to Settings > API Tokens
 * 5. Click "Generate new token"
 * 6. Copy the generated token
 * 7. Add it to your .env file as MAILERSEND_API_KEY=your_token_here
 *
 * Domain Setup (for production):
 * 1. In MailerSend dashboard, go to Domains
 * 2. Add your domain (e.g., nerowork.netlify.app)
 * 3. Verify domain ownership by adding DNS records
 * 4. Update the email sender address in the code
 */

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMailerSend() {
	const apiKey = process.env.MAILERSEND_API_KEY;

	console.log('🔑 API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');

	if (!apiKey) {
		console.error('❌ MAILERSEND_API_KEY not found in .env file');
		console.log('\n📋 To get your API key:');
		console.log('1. Visit https://www.mailersend.com/');
		console.log('2. Sign up for a free account');
		console.log('3. Go to Settings > API Tokens');
		console.log('4. Generate a new token');
		console.log('5. Add MAILERSEND_API_KEY=your_token_here to your .env file');
		return;
	}

	try {
		console.log('🧪 Testing MailerSend connection...');

		const mailerSend = new MailerSend({
			apiKey: apiKey
		});

		// Test with a simple email (update with your email to actually receive test emails)
		const testEmail = 'illtiger3m@gmail.com'; // Change this to your email address
		const sentFrom = new Sender('noreply@trial-3vz9dle7jj545q2x.mlsender.net', 'NeroWork Test'); // MailerSend trial domain
		const recipients = [new Recipient(testEmail, 'Test User')];

		const emailParams = new EmailParams()
			.setFrom(sentFrom)
			.setTo(recipients)
			.setSubject('MailerSend Test from NeroWork')
			.setHtml('<h1>Test Email</h1><p>MailerSend is working correctly!</p>')
			.setText('Test Email - MailerSend is working correctly!');

		console.log('📧 Sending test email to:', testEmail);
		console.log('📤 Email parameters:', {
			from: 'noreply@trial-3vz9dle7jj545q2x.mlsender.net',
			to: testEmail,
			subject: 'MailerSend Test from NeroWork'
		});

		// Actually send the test email
		console.log('🚀 Initiating email send...');
		const result = await mailerSend.email.send(emailParams);
		console.log('📨 Send result:', result);

		if (result.statusCode === 202) {
			console.log('✅ Test email sent successfully!');
			console.log('� Check your inbox at:', testEmail);
			console.log('📝 Email ID:', result.body.data?.id || 'N/A');
		} else {
			console.log('⚠️ Email sent but with status:', result.statusCode);
			console.log('Response:', result.body);
		}
	} catch (error) {
		console.error('❌ Error testing MailerSend:');
		console.error('Error message:', error.message);
		console.error('Error details:', error);

		if (error.response) {
			console.error('API Response status:', error.response.status);
			console.error('API Response data:', error.response.data);
		}

		if (error.code) {
			console.error('Error code:', error.code);
		}
	}
}

console.log('🚀 MailerSend Setup for NeroWork');
console.log('=====================================\n');

testMailerSend();
