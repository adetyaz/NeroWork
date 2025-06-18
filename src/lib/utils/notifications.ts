// Svelte 5 notification utility for localStorage
// Usage: import { addNotification, getNotifications, markNotificationRead } from './notifications';

interface AddNotificationParams {
	userWallet: string;
	type: string;
	message: string;
	jobId?: string | null;
}

export function addNotification({
	userWallet,
	type,
	message,
	jobId = null
}: AddNotificationParams) {
	const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
	notifications.push({
		id: Date.now() + Math.random().toString(36).slice(2),
		userWallet,
		type,
		message,
		jobId,
		read: false,
		timestamp: new Date().toISOString()
	});
	localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Fix: sort timestamps as numbers
interface Notification {
	id: string;
	userWallet: string;
	type: string;
	message: string;
	jobId: string | null;
	read: boolean;
	timestamp: string;
}

export function getNotifications(userWallet: string): Notification[] {
	const notifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
	return notifications
		.filter((n) => n.userWallet === userWallet)
		.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export interface MarkNotificationReadParams {
	notificationId: string;
}

export function markNotificationRead(
	notificationId: MarkNotificationReadParams['notificationId']
): void {
	const notifications: Notification[] = JSON.parse(localStorage.getItem('notifications') || '[]');
	const idx = notifications.findIndex((n) => n.id === notificationId);
	if (idx !== -1) notifications[idx].read = true;
	localStorage.setItem('notifications', JSON.stringify(notifications));
}
