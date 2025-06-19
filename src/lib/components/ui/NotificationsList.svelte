<script lang="ts">
import { getNotifications as getNotificationsFromSupabase, markNotificationRead as markNotificationReadSupabase } from '$lib/utils/notifications.supabase';

type Notification = {
	id: string;
	message: string;
	timestamp: number | string;
	read: boolean;
};

let notifications = $state<any[]>([]);
let userWallet = $state('');

$effect(() => {
	if (!userWallet) {
		const profile = localStorage.getItem('freelancerProfile') || localStorage.getItem('clientProfile');
		if (profile) {
			userWallet = JSON.parse(profile).walletAddress || JSON.parse(profile).wallet;
		}
	}
	if (userWallet) {
		// Call an async function, don't make the effect itself async
		fetchNotifications();
	}
});

async function fetchNotifications() {
	notifications = await getNotificationsFromSupabase(userWallet);
}

async function markRead(id: string) {
	await markNotificationReadSupabase(id);
	notifications = await getNotificationsFromSupabase(userWallet);
}
</script>

<div class="w-80 bg-white rounded shadow p-4">
	<h2 class="text-lg font-bold mb-2">Notifications</h2>
	{#if notifications.length === 0}
		<p class="text-gray-500">No notifications.</p>
	{:else}
		<ul class="divide-y">
			{#each notifications as n}
				<li class="py-2 flex items-start gap-2 {n.read ? 'opacity-60' : ''}">
					<div class="flex-1">
						<div class="text-sm font-medium">{n.message}</div>
						<div class="text-xs text-gray-400">{new Date(n.timestamp).toLocaleString()}</div>
					</div>
					{#if !n.read}
						<button class="text-xs text-blue-600 ml-2" onclick={() => markRead(n.id)}>Mark as read</button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
