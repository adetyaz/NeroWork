import { supabase } from './supabaseClient.js';

interface AddNotificationParams {
	userWallet: string;
	type: string;
	message: string;
}

export async function addNotification({ userWallet, type, message }: AddNotificationParams) {
	const { error } = await supabase.from('notifications').insert({
		user_wallet: userWallet,
		type,
		message,
		read: false,
		timestamp: new Date().toISOString()
	});

	if (error) {
		console.error('Error adding notification:', error);
		throw error;
	}
	console.log('Notification added successfully for wallet:', userWallet);
}

export interface Notification {
	id: string;
	user_wallet: string;
	type: string;
	message: string;
	read: boolean;
	timestamp: string;
}

export async function getNotifications(userWallet: string): Promise<Notification[]> {
	console.log('=== getNotifications ===');
	console.log('Fetching notifications for wallet:', userWallet);

	try {
		// Get user-specific notifications from the database
		const { data: notifications, error } = await supabase
			.from('notifications')
			.select('*')
			.eq('user_wallet', userWallet)
			.order('timestamp', { ascending: false });

		console.log('Query result:', {
			count: notifications?.length || 0,
			error: error?.message
		});

		if (error) {
			console.error('Error fetching notifications:', error);
			throw error;
		}

		if (notifications && notifications.length > 0) {
			console.log(
				'Found notifications:',
				notifications.slice(0, 3).map((n) => ({
					id: n.id,
					message: n.message.substring(0, 50) + '...',
					type: n.type,
					read: n.read,
					timestamp: n.timestamp
				}))
			);
		} else {
			console.log('No notifications found for this wallet');
		}

		return notifications || [];
	} catch (error) {
		console.error('Error in getNotifications:', error);
		throw error;
	}
}

export async function markNotificationRead(notificationId: string): Promise<void> {
	console.log('=== markNotificationRead ===');
	console.log('Marking notification as read:', notificationId);

	try {
		const { error } = await supabase
			.from('notifications')
			.update({ read: true })
			.eq('id', notificationId);

		if (error) {
			console.error('Error marking notification as read:', error);
			throw error;
		}

		console.log('✅ Notification marked as read');
	} catch (error) {
		console.error('Error in markNotificationRead:', error);
		throw error;
	}
}

export async function getUnreadCount(userWallet: string): Promise<number> {
	try {
		const { count, error } = await supabase
			.from('notifications')
			.select('*', { count: 'exact', head: true })
			.eq('user_wallet', userWallet)
			.eq('read', false);

		if (error) {
			console.error('Error getting unread count:', error);
			throw error;
		}

		return count || 0;
	} catch (error) {
		console.error('Error in getUnreadCount:', error);
		throw error;
	}
}

// Helper functions for specific notification types
export async function notifyInvoiceCreated(
	userWallet: string,
	invoiceNumber: string,
	amount: number
) {
	return addNotification({
		userWallet,
		type: 'invoice_created',
		message: `Invoice #${invoiceNumber} for $${amount} has been created and is ready to be sent.`
	});
}

export async function notifyInvoicePaid(
	userWallet: string,
	invoiceNumber: string,
	amount: number,
	paidBy: string
) {
	return addNotification({
		userWallet,
		type: 'payment_received',
		message: `💰 Payment of $${amount} received for Invoice #${invoiceNumber} from ${paidBy.substring(0, 8)}...`
	});
}

export async function notifyInvoiceViewed(
	userWallet: string,
	invoiceNumber: string,
	viewerAddress: string
) {
	return addNotification({
		userWallet,
		type: 'invoice_viewed',
		message: `👀 Invoice #${invoiceNumber} has been viewed by ${viewerAddress.substring(0, 8)}...`
	});
}
