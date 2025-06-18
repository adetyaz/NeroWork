<script lang="ts">

interface Invoice {
  title: string;
  clientName: string;
  amount: number;
  freelancerWallet: string;
  status: string;
  updatedAt?: string;
  createdAt?: string;
}

let invoices = $state<Invoice[]>([]);
let freelancerWallet = $state('');

$effect(() => {
  const profile = localStorage.getItem('freelancerProfile');
  if (profile) {
    const parsed = JSON.parse(profile);
    freelancerWallet = parsed.walletAddress || parsed.wallet;
  }
  const allInvoices: Invoice[] = JSON.parse(localStorage.getItem('invoices') || '[]');
  invoices = allInvoices.filter((inv: Invoice) => inv.freelancerWallet === freelancerWallet && inv.status === 'paid');
});
</script>

<div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Paid Invoices</h1>
  <table class="w-full">
    <thead class="bg-gray-50 text-left">
      <tr>
        <th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Title</th>
        <th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Client</th>
        <th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Amount</th>
        <th class="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Paid At</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      {#each invoices as inv}
        <tr>
          <td class="px-6 py-4">{inv.title}</td>
          <td class="px-6 py-4">{inv.clientName}</td>
          <td class="px-6 py-4">{inv.amount}</td>
          <td class="px-6 py-4">{new Date(inv.updatedAt ?? inv.createdAt ?? '').toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if invoices.length === 0}
    <div class="p-6 text-gray-500">No paid invoices yet.</div>
  {/if}
</div>
