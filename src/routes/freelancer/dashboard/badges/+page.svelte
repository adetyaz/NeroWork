<script lang="ts">
// Placeholder for badge logic
let badges = [
  { name: 'First Invoice', description: 'Created your first invoice!' },
  { name: '5 Invoices', description: 'Created 5 invoices!' },
  { name: 'Paid Pro', description: 'Received 3 paid invoices!' }
];
</script>

<div class="max-w-2xl mx-auto p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Your Badges</h1>
  <ul>
    {#each badges as badge}
      <li class="mb-3 p-3 border rounded bg-gray-50">
        <div class="font-semibold">{badge.name}</div>
        <div class="text-gray-600 text-sm">{badge.description}</div>
      </li>
    {/each}
  </ul>
</div>
