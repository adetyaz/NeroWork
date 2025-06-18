<script lang="ts">
import { supabase } from '$lib/utils/supabaseClient.js';
import { getSigner } from '$lib/utils/aaUtils';
import { API_KEY } from '$lib/config';
import { addNotification } from '$lib/utils/notifications';

let invoices: any[] = $state([]);
let freelancerWallet: string = $state('');

$effect(() => {
  getSigner()
    .then(async signer => {
      const address = await signer.getAddress();
      freelancerWallet = address;
      if (freelancerWallet) {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('user_address', freelancerWallet)
          .order('created_at', { ascending: false });
        invoices = data && Array.isArray(data) ? data : [];
	
      } else {
        invoices = [];
      }
    })
    .catch(() => {
      invoices = [];
    });
});

function getInvoiceLink(id: string) {
  return `https://nerowork.netlify.app/invoice/${id}`;
}
</script>

<div class="overflow-hidden rounded bg-white shadow">
  <div class="border-b border-gray-100 p-4">
    <h1 class="text-lg font-semibold">My Invoices</h1>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 text-left">
        <tr>
          <th class="px-3 py-2 font-medium text-gray-500 uppercase">Project</th>
          <th class="px-3 py-2 font-medium text-gray-500 uppercase">Description</th>
          <th class="px-3 py-2 font-medium text-gray-500 uppercase">Amount</th>
          <th class="px-3 py-2 font-medium text-gray-500 uppercase">Status</th>
          <th class="px-3 py-2 font-medium text-gray-500 uppercase">Created</th>
          <th class="px-3 py-2 font-medium text-gray-500 uppercase">Share Link</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        {#each invoices as inv}
          <tr class="hover:bg-gray-50 transition">
            <td class="px-3 py-2 font-semibold text-gray-800">{inv.project_name}</td>
            <td class="px-3 py-2 truncate max-w-xs text-gray-600">{inv.project_description}</td>
            <td class="px-3 py-2 font-mono text-blue-700">{inv.amount}</td>
            <td class="px-3 py-2">
              {#if inv.status === 'paid'}
                <span class="inline-block px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">Paid</span>
              {:else}
                <span class="inline-block px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-300">Unpaid</span>
              {/if}
            </td>
            <td class="px-3 py-2 text-gray-500">{new Date(inv.created_at).toLocaleString()}</td>
            <td class="px-3 py-2">
              <input class="w-36 px-1 py-0.5 border rounded text-xs bg-gray-50" readonly value={getInvoiceLink(inv.id)} />
              <button class="ml-1 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs border border-blue-200 hover:bg-blue-200 transition" onclick={() => navigator.clipboard.writeText(getInvoiceLink(inv.id))}>Copy</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if invoices.length === 0}
      <div class="p-4 text-gray-500 text-sm">No invoices created yet.</div>
    {/if}
  </div>
</div>
