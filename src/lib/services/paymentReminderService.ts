import { supabase } from '../utils/supabaseClient.js';
import { APP_CONFIG } from '../config.js';
import type {
	PaymentReminder,
	InvoiceReminderSettings,
	FreelancerReminderPreferences
} from '../types/reminders.js';
import { DEFAULT_REMINDER_TEMPLATES } from '../types/reminders.js';

/**
 * Payment reminder service for managing automated follow-ups
 */
export class PaymentReminderService {
	private static instance: PaymentReminderService;

	static getInstance(): PaymentReminderService {
		if (!PaymentReminderService.instance) {
			PaymentReminderService.instance = new PaymentReminderService();
		}
		return PaymentReminderService.instance;
	}

	/**
	 * Check for overdue invoices and send reminders
	 */
	async checkAndSendReminders(): Promise<void> {
		try {
			const overdueInvoices = await this.getOverdueInvoices();

			for (const invoice of overdueInvoices) {
				const shouldSend = await this.shouldSendReminder(invoice);
				if (shouldSend) {
					await this.sendReminder(invoice);
				}
			}
		} catch (error) {
			console.error('Error checking and sending reminders:', error);
		}
	}

	/**
	 * Get all overdue invoices that need reminders
	 */
	private async getOverdueInvoices() {
		const now = new Date();

		const { data: invoices, error } = await supabase
			.from('invoices')
			.select('*')
			.eq('status', 'pending')
			.eq('reminder_enabled', true)
			.lt('due_date', now.toISOString());

		if (error) {
			throw new Error(`Failed to fetch overdue invoices: ${error.message}`);
		}

		return invoices || [];
	}

	/**
	 * Determine if a reminder should be sent for an invoice
	 */
	private async shouldSendReminder(invoice: any): Promise<boolean> {
		const now = new Date();
		const dueDate = new Date(invoice.due_date);
		const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

		// Check if client is excluded by freelancer
		const preferences = await this.getFreelancerPreferences(invoice.user_address);
		if (preferences?.excluded_clients.includes(invoice.client_email)) {
			return false;
		}

		// Determine reminder stage based on days overdue
		const reminderStage = this.getReminderStage(daysOverdue);
		if (!reminderStage) return false;

		// Check if this reminder was already sent
		const { data: existingReminders } = await supabase
			.from('payment_reminders')
			.select('*')
			.eq('invoice_id', invoice.id)
			.eq('reminder_type', reminderStage);

		return !existingReminders || existingReminders.length === 0;
	}

	/**
	 * Determine reminder stage based on days overdue
	 */
	private getReminderStage(daysOverdue: number): 'first' | 'second' | 'final' | null {
		if (daysOverdue >= 7 && daysOverdue < 14) return 'first';
		if (daysOverdue >= 14 && daysOverdue < 30) return 'second';
		if (daysOverdue >= 30) return 'final';
		return null;
	}

	/**
	 * Send a payment reminder email
	 */
	async sendReminder(invoice: any): Promise<void> {
		const now = new Date();
		const dueDate = new Date(invoice.due_date);
		const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
		const reminderStage = this.getReminderStage(daysOverdue);

		if (!reminderStage) return;

		// Get freelancer preferences for custom templates
		const preferences = await this.getFreelancerPreferences(invoice.user_address);
		const template = this.getTemplate(reminderStage, preferences);

		// Replace template variables
		const content = this.replaceTemplateVariables(template, {
			project_name: invoice.project_name,
			days_overdue: daysOverdue.toString(),
			amount: invoice.amount.toString(),
			token: 'NERO', // You can make this dynamic later
			due_date: dueDate.toLocaleDateString(),
			invoice_link: `${APP_CONFIG.baseUrl}/invoice/${invoice.id}`,
			freelancer_name: invoice.client_name || 'Your Freelancer'
		});

		const subject = this.getSubject(reminderStage, invoice.project_name, daysOverdue);

		// Send email via MailerSend API
		await this.sendEmail({
			to: invoice.client_email,
			subject,
			content
		});

		// Record the reminder
		await this.recordReminder({
			invoice_id: invoice.id,
			reminder_type: reminderStage,
			sent_at: now.toISOString(),
			email_sent_to: invoice.client_email,
			subject,
			content
		});

		// Update invoice reminder count
		await supabase
			.from('invoices')
			.update({
				reminder_count: (invoice.reminder_count || 0) + 1,
				last_reminder_sent: now.toISOString()
			})
			.eq('id', invoice.id);
	}

	/**
	 * Send a manual reminder for a specific invoice (bypasses auto-reminder restrictions)
	 */
	async sendManualReminder(invoice: any): Promise<void> {
		const now = new Date();
		const dueDate = new Date(invoice.due_date);
		const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

		// For manual reminders, determine the appropriate stage but allow even if not overdue
		let reminderStage: 'first' | 'second' | 'final' = 'first';
		if (daysOverdue >= 30) reminderStage = 'final';
		else if (daysOverdue >= 14) reminderStage = 'second';
		else if (daysOverdue >= 7) reminderStage = 'first';

		// Get freelancer preferences for custom templates
		const preferences = await this.getFreelancerPreferences(invoice.user_address);
		const template = this.getTemplate(reminderStage, preferences);

		// Replace template variables
		const content = this.replaceTemplateVariables(template, {
			project_name: invoice.project_name,
			days_overdue: Math.max(0, daysOverdue).toString(),
			amount: invoice.amount.toString(),
			token: 'NERO',
			due_date: dueDate.toLocaleDateString(),
			invoice_link: `${APP_CONFIG.baseUrl}/invoice/${invoice.id}`,
			freelancer_name: invoice.client_name || 'Your Freelancer'
		});

		const subject = this.getSubject(reminderStage, invoice.project_name, daysOverdue);

		// Send email
		await this.sendEmail({
			to: invoice.client_email,
			subject,
			content
		});

		// Record the manual reminder
		await this.recordReminder({
			invoice_id: invoice.id,
			reminder_type: reminderStage,
			sent_at: now.toISOString(),
			email_sent_to: invoice.client_email,
			subject,
			content
		});

		// Update invoice reminder count
		await supabase
			.from('invoices')
			.update({
				reminder_count: (invoice.reminder_count || 0) + 1,
				last_reminder_sent: now.toISOString()
			})
			.eq('id', invoice.id);
	}

	/**
	 * Get freelancer reminder preferences
	 */
	private async getFreelancerPreferences(
		userAddress: string
	): Promise<FreelancerReminderPreferences | null> {
		const { data, error } = await supabase
			.from('freelancer_reminder_preferences')
			.select('*')
			.eq('user_address', userAddress)
			.single();

		if (error && error.code !== 'PGRST116') {
			// PGRST116 = no rows returned
			console.error('Error fetching freelancer preferences:', error);
		}

		return data;
	}

	/**
	 * Get reminder template
	 */
	private getTemplate(
		stage: 'first' | 'second' | 'final',
		preferences?: FreelancerReminderPreferences | null
	): string {
		if (preferences?.custom_templates) {
			switch (stage) {
				case 'first':
					return (
						preferences.custom_templates.first_reminder || DEFAULT_REMINDER_TEMPLATES.first_reminder
					);
				case 'second':
					return (
						preferences.custom_templates.second_reminder ||
						DEFAULT_REMINDER_TEMPLATES.second_reminder
					);
				case 'final':
					return (
						preferences.custom_templates.final_reminder || DEFAULT_REMINDER_TEMPLATES.final_reminder
					);
			}
		}

		return DEFAULT_REMINDER_TEMPLATES[`${stage}_reminder`];
	}

	/**
	 * Replace template variables with actual values
	 */
	private replaceTemplateVariables(template: string, variables: Record<string, string>): string {
		let result = template;
		for (const [key, value] of Object.entries(variables)) {
			result = result.replace(new RegExp(`{${key}}`, 'g'), value);
		}
		return result;
	}

	/**
	 * Generate email subject based on reminder stage
	 */
	private getSubject(
		stage: 'first' | 'second' | 'final',
		projectName: string,
		daysOverdue: number
	): string {
		switch (stage) {
			case 'first':
				return `Friendly Reminder: Payment for "${projectName}" (${daysOverdue} days overdue)`;
			case 'second':
				return `Payment Follow-up: "${projectName}" (${daysOverdue} days overdue)`;
			case 'final':
				return `FINAL NOTICE: Overdue Payment for "${projectName}" (${daysOverdue} days overdue)`;
			default:
				return `Payment Reminder: "${projectName}"`;
		}
	}

	/**
	 * Send email using API endpoint
	 */
	private async sendEmail({
		to,
		subject,
		content
	}: {
		to: string;
		subject: string;
		content: string;
	}): Promise<void> {
		try {
			console.log('📧 Sending reminder email:', { to, subject });

			const response = await fetch('/api/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					to,
					subject,
					content
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to send email');
			}

			const result = await response.json();
			console.log('✅ Email sent successfully:', result.messageId);
		} catch (error) {
			console.error('Error sending email:', error);
			throw error;
		}
	}

	/**
	 * Record reminder in database
	 */
	private async recordReminder(reminder: Omit<PaymentReminder, 'id'>): Promise<void> {
		const { error } = await supabase.from('payment_reminders').insert([reminder]);

		if (error) {
			console.error('Error recording reminder:', error);
		}
	}

	/**
	 * Get reminder history for an invoice
	 */
	async getReminderHistory(invoiceId: string): Promise<PaymentReminder[]> {
		const { data, error } = await supabase
			.from('payment_reminders')
			.select('*')
			.eq('invoice_id', invoiceId)
			.order('sent_at', { ascending: false });

		if (error) {
			console.error('Error fetching reminder history:', error);
			return [];
		}

		return data || [];
	}

	/**
	 * Update freelancer reminder preferences
	 */
	async updateFreelancerPreferences(
		userAddress: string,
		preferences: Partial<FreelancerReminderPreferences>
	): Promise<void> {
		const { error } = await supabase.from('freelancer_reminder_preferences').upsert([
			{
				user_address: userAddress,
				...preferences
			}
		]);

		if (error) {
			throw new Error(`Failed to update preferences: ${error.message}`);
		}
	}
}

// Export singleton instance
export const paymentReminderService = PaymentReminderService.getInstance();
