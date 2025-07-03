// Fresh Svelte 5 notification utility for Supabase
// Usage: import { addNotification, getNotifications, markNotificationRead } from './notifications';

import { supabase } from './supabaseClient.js';

interface AddNotificationParams {
	userWallet: string;
	type: string;
	message: string;
	jobId?: string | null;
}

export interface Notification {
	id: string;
	user_wallet: string;
	type: string;
	message: string;
	job_id: string | null;
	read: boolean;
	timestamp: string;
	created_at: string;
	updated_at: string;
}

export async function addNotification({
	userWallet,
	type,
	message,
	jobId = null
}: AddNotificationParams) {
	console.log('=== addNotification ===');
	console.log('Adding notification for wallet:', userWallet);

	try {
		const { data, error } = await supabase
			.from('notifications')
			.insert({
				user_wallet: userWallet,
				type,
				message,
				job_id: jobId,
				read: false
			})
			.select();

		if (error) {
			console.error('Error adding notification:', error);
			throw error;
		}

		console.log('✅ Notification added successfully:', data?.[0]);
		return data?.[0];
	} catch (error) {
		console.error('Error in addNotification:', error);
		throw error;
	}
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

export async function getAllNotifications(): Promise<Notification[]> {
	console.log('=== getAllNotifications ===');
	console.log('Fetching ALL notifications (for debugging)');

	try {
		const { data: notifications, error } = await supabase
			.from('notifications')
			.select('*')
			.order('timestamp', { ascending: false });

		console.log('All notifications result:', {
			count: notifications?.length || 0,
			error: error?.message
		});

		if (error) {
			console.error('Error fetching all notifications:', error);
			throw error;
		}

		return notifications || [];
	} catch (error) {
		console.error('Error in getAllNotifications:', error);
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
	console.log('=== getUnreadCount ===');
	console.log('Getting unread count for wallet:', userWallet);

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

		console.log('Unread count:', count || 0);
		return count || 0;
	} catch (error) {
		console.error('Error in getUnreadCount:', error);
		throw error;
	}
}

// Debug functions
export async function testTableConnection() {
	console.log('=== testTableConnection ===');

	try {
		// Test basic table access
		const { data, error, count } = await supabase
			.from('notifications')
			.select('*', { count: 'exact' })
			.limit(1);

		console.log('Table connection test:', {
			accessible: !error,
			recordCount: count || 0,
			error: error?.message,
			errorCode: error?.code
		});

		return {
			success: !error,
			count: count || 0,
			error: error?.message
		};
	} catch (error) {
		console.error('Error in testTableConnection:', error);
		return {
			success: false,
			count: 0,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}
