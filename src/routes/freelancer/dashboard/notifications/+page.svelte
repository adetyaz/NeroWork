<script lang="ts">
import { onMount } from 'svelte';
import { getSigner } from '$lib/utils/aaUtils';
import { getNotifications, markNotificationRead } from '$lib/utils/notifications.supabase';

type Notification = {
  id: string;
  user_wallet: string;
  type: string;
  message: string;
  job_id?: string | null;
  read: boolean;
  timestamp: string;
};

let notifications: Notification[] = $state([]);
let userWallet = $state('');
let loading = $state(true);

onMount(async () => {
  await loadUserAndNotifications();
});

async function loadUserAndNotifications() {
  try {
    loading = true;
    // Get user wallet address
    const signer = await getSigner();
    userWallet = await signer.getAddress();
    console.log('User wallet address:', userWallet);
    
    // Load notifications from Supabase
    notifications = await getNotifications(userWallet);
    console.log('Loaded notifications:', notifications);
    console.log('Number of notifications:', notifications.length);
  } catch (error) {
    console.error('Error loading notifications:', error);
  } finally {
    loading = false;
  }
}

async function markAsRead(id: string) {
  try {
    await markNotificationRead(id);
    // Update local state
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}
</script>

<div class="max-w-2xl mx-auto p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Notifications</h1>
  
  {#if loading}
    <div class="text-gray-500">Loading notifications...</div>
  {:else if notifications.length === 0}
    <div class="text-gray-500">
      No notifications yet.
      <br><br>
      <small class="text-xs">
        User wallet: {userWallet || 'Not connected'}
      </small>
    </div>
  {:else}
    <div class="mb-4 text-sm text-gray-600">
      Showing {notifications.length} notifications for: {userWallet}
    </div>
    <ul>
      {#each notifications as notif}
        <li class="mb-4 p-4 border rounded bg-gray-50 flex justify-between items-center {notif.read ? 'opacity-60' : ''}">
          <div>
            <div class="font-semibold">{notif.message}</div>
            <div class="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleString()}</div>
            <div class="text-xs text-gray-400">Type: {notif.type}</div>
          </div>
          {#if !notif.read}
            <button class="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-xs" onclick={() => markAsRead(notif.id)}>Mark as Read</button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
