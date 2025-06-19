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
	const { error } = await supabase.from('notifications').insert({
		user_wallet: userWallet,
		type,
		message,
		job_id: jobId,
		read: false,
		timestamp: new Date().toISOString()
	});
	if (error) throw error;
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
	const { data, error } = await supabase
		.from('notifications')
		.select('*')
		.eq('user_wallet', userWallet)
		.order('timestamp', { ascending: false });
	if (error) throw error;
	return data || [];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
	const { error } = await supabase
		.from('notifications')
		.update({ read: true })
		.eq('id', notificationId);
	if (error) throw error;
}
