<script lang="ts">
import { getNotifications, markNotificationRead } from '$lib/utils/notifications';

let { userWallet } = $props();

type Notification = {
	id: string;
	message: string;
	timestamp: number | string;
	read: boolean;
};

let notifications = $state<any[]>([]);

$effect(() => {
	if (userWallet) {
		fetchNotifications();
	}
});

async function fetchNotifications() {
	notifications = await getNotifications(userWallet);
}

async function markRead(id: string) {
	await markNotificationRead(id);
	notifications = await getNotifications(userWallet);
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
