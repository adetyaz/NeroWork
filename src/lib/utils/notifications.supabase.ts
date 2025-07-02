import { supabase } from './supabaseClient';

export interface AddNotificationParams {
	userWallet: string;
	type: string;
	message: string;
	jobId?: string | null;
}

export async function addNotification({
	userWallet,
	type,
	message,
	jobId = null
}: AddNotificationParams) {
	console.log('Adding notification for wallet:', userWallet);

	const { error } = await supabase.from('notifications').insert({
		user_wallet: userWallet, // Keep original case
		type,
		message,
		job_id: jobId,
		read: false,
		timestamp: new Date().toISOString()
	});

	if (error) {
		console.error('Error adding notification:', error);
		throw error;
	}

	console.log('Notification added successfully');
}

export interface Notification {
	id: string;
	user_wallet: string;
	type: string;
	message: string;
	job_id: string | null;
	read: boolean;
	timestamp: string;
}

export async function getNotifications(userWallet: string): Promise<Notification[]> {
	console.log('Fetching notifications for wallet:', userWallet);

	// First, let's check if we can connect to the database at all
	try {
		const {
			data: testData,
			error: testError,
			count
		} = await supabase.from('notifications').select('*', { count: 'exact' });

		console.log('Total notifications in database:', count);
		console.log('Sample data:', testData?.slice(0, 3));
		console.log('Test query error:', testError);

		if (testData && testData.length > 0) {
			console.log(
				'Sample wallet addresses in database:',
				testData.map((n) => n.user_wallet)
			);
		}
	} catch (debugError) {
		console.error('Debug query failed:', debugError);
	}

	// Now try the actual query
	console.log('Attempting exact match query for wallet:', userWallet);
	const { data, error } = await supabase
		.from('notifications')
		.select('*')
		.eq('user_wallet', userWallet)
		.order('timestamp', { ascending: false });

	console.log('Main query result:', {
		data,
		error,
		searchedWallet: userWallet,
		dataLength: data?.length || 0
	});

	if (error) {
		console.error('Supabase error:', error);
		throw error;
	}

	return data || [];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
	const { error } = await supabase
		.from('notifications')
		.update({ read: true })
		.eq('id', notificationId);
	if (error) throw error;
}
