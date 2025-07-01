/**
 * Payment reminder types and interfaces
 */

export interface PaymentReminder {
  id: string;
  invoice_id: string;
  reminder_type: 'first' | 'second' | 'final';
  sent_at: string;
  email_sent_to: string;
  subject: string;
  content: string;
  opened?: boolean;
  clicked?: boolean;
}

export interface InvoiceReminderSettings {
  invoice_id: string;
  due_date: string;
  reminder_enabled: boolean;
  reminder_intervals: number[]; // [7, 14, 30] days overdue
  custom_message?: string;
  last_reminder_sent?: string;
  reminder_count: number;
}

export interface FreelancerReminderPreferences {
  user_address: string;
  default_due_days: number; // 30 days default
  reminders_enabled: boolean;
  custom_templates: {
    first_reminder: string;
    second_reminder: string;
    final_reminder: string;
  };
  excluded_clients: string[]; // email addresses to skip reminders
}

export const DEFAULT_REMINDER_TEMPLATES = {
  first_reminder: `Hi there!

I hope this email finds you well. This is a friendly reminder that your invoice for "{project_name}" is now {days_overdue} days overdue.

**Invoice Details:**
- Amount: {amount} {token}
- Due Date: {due_date}
- Invoice Link: {invoice_link}

No worries if you've been busy! Please let me know if you have any questions or need to discuss the payment timeline.

Thanks for your understanding!

Best regards,
{freelancer_name}`,

  second_reminder: `Hello,

I wanted to follow up on the outstanding invoice for "{project_name}" which is now {days_overdue} days overdue.

**Invoice Details:**
- Amount: {amount} {token}
- Due Date: {due_date}
- Invoice Link: {invoice_link}

If there are any issues with the invoice or payment process, please don't hesitate to reach out. I'm happy to help resolve any concerns.

I'd appreciate an update on the payment status at your earliest convenience.

Best regards,
{freelancer_name}`,

  final_reminder: `Dear Client,

This is a final reminder regarding the overdue payment for "{project_name}" which is now {days_overdue} days past due.

**Invoice Details:**
- Amount: {amount} {token}
- Original Due Date: {due_date}
- Invoice Link: {invoice_link}

Please arrange payment immediately to avoid any disruption to our working relationship. If payment is not received within the next 7 days, I may need to pursue alternative collection methods.

If you're experiencing difficulties, please contact me immediately to discuss payment arrangements.

Regards,
{freelancer_name}`
};

export const DUE_DATE_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 21, label: '21 days' },
  { value: 30, label: '30 days (default)' },
  { value: 45, label: '45 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' }
];
