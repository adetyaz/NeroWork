<script lang="ts">
import { onMount } from 'svelte';
type Notification = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
};

let notifications: Notification[] = [];

onMount(() => {
  notifications = JSON.parse(localStorage.getItem('freelancerNotifications') || '[]').sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

function markAsRead(id: string) {
  notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem('freelancerNotifications', JSON.stringify(notifications));
}
</script>

<div class="max-w-2xl mx-auto p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Notifications</h1>
  {#if notifications.length === 0}
    <div class="text-gray-500">No notifications yet.</div>
  {:else}
    <ul>
      {#each notifications as notif}
        <li class="mb-4 p-4 border rounded bg-gray-50 flex justify-between items-center {notif.read ? 'opacity-60' : ''}">
          <div>
            <div class="font-semibold">{notif.message}</div>
            <div class="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</div>
          </div>
          {#if !notif.read}
            <button class="ml-4 px-3 py-1 bg-blue-600 text-white rounded text-xs" on:click={() => markAsRead(notif.id)}>Mark as Read</button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>
