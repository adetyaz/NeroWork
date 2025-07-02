<script lang="ts">
import { supabase } from '$lib/utils/supabaseClient.js';
import { getSigner } from '$lib/utils/aaUtils';
import { APP_CONFIG } from '$lib/config';
import { addNotification } from '$lib/utils/notifications.supabase';
import { PaymentReminderService } from '$lib/services/paymentReminderService.js';
import type { PaymentReminder } from '$lib/types/reminders.js';
import Toast from '$lib/components/ui/toast.svelte';

let invoices: any[] = $state([]);
let freelancerWallet: string = $state('');
let loading = $state(true);
let error = $state('');
let toast = $state({ open: false, message: '', success: false });

// Derived state for categorized invoices - use status field as primary source of truth
let unpaidInvoices = $derived(invoices.filter(inv => 
  inv.status === 'pending' || !inv.status
));
let paidInvoices = $derived(invoices.filter(inv => 
  inv.status === 'paid'
));
let rejectedInvoices = $derived(invoices.filter(inv => 
  inv.status === 'rejected'
));

const reminderService = PaymentReminderService.getInstance();

$effect(() => {
  loadInvoicesData();
});

// Payment reminder helper functions
function getInvoiceStatus(invoice: any) {
  if (invoice.status === 'paid') return { text: 'Paid', class: 'bg-green-100 text-green-800' };
  if (invoice.status === 'cancelled') return { text: 'Cancelled', class: 'bg-gray-100 text-gray-800' };
  
  const now = new Date();
  const dueDate = new Date(invoice.due_date);
  
  if (dueDate < now) {
    const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    return { 
      text: `${daysOverdue} days overdue`, 
      class: 'bg-red-100 text-red-800' 
    };
  }
  
  return { text: 'Pending', class: 'bg-yellow-100 text-yellow-800' };
}

function getReminderStatus(invoice: any) {
  if (!invoice.reminder_enabled) {
    return { text: 'Disabled', class: 'bg-gray-100 text-gray-600' };
  }
  
  if (!invoice.reminder_count || invoice.reminder_count === 0) {
    return { text: 'No reminders sent', class: 'bg-blue-100 text-blue-600' };
  }
  
  return { 
    text: `${invoice.reminder_count} reminder${invoice.reminder_count > 1 ? 's' : ''} sent`, 
    class: 'bg-orange-100 text-orange-600' 
  };
}

async function toggleReminders(invoice: any) {
  try {
    const { error } = await supabase
      .from('invoices')
      .update({ reminder_enabled: !invoice.reminder_enabled })
      .eq('id', invoice.id);

    if (error) throw error;
    
    // Update local state
    const wasEnabled = invoice.reminder_enabled;
    invoice.reminder_enabled = !invoice.reminder_enabled;
    invoices = [...invoices];
    
    // Show toast notification
    toast = {
      open: true,
      message: `Reminders ${invoice.reminder_enabled ? 'enabled' : 'disabled'} for invoice "${invoice.project_name}"`,
      success: true
    };
    
    // Send async notification to user
    try {
      await addNotification({
        type: 'success',
        message: `Reminders ${invoice.reminder_enabled ? 'enabled' : 'disabled'} for invoice "${invoice.project_name}"`,
        userWallet: freelancerWallet
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }
  } catch (error) {
    console.error('Error toggling reminders:', error);
    toast = {
      open: true,
      message: 'Failed to update reminder settings',
      success: false
    };
  }
}

async function sendManualReminder(invoice: any) {
  try {
    await reminderService.sendManualReminder(invoice);
    
    // Reload invoices to get updated reminder count
    await loadInvoicesData();
    
    // Show toast notification
    toast = {
      open: true,
      message: `Payment reminder sent for invoice "${invoice.project_name}"`,
      success: true
    };
    
    // Send async notification to user
    try {
      await addNotification({
        type: 'success',
        message: `Manual reminder sent for invoice "${invoice.project_name}"`,
        userWallet: freelancerWallet
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    toast = {
      open: true,
      message: 'Failed to send reminder: ' + (error instanceof Error ? error.message : String(error)),
      success: false
    };
  }
}

async function checkReminders() {
  try {
    console.log('Checking and sending payment reminders...');
    
    addNotification({
      type: 'info',
      message: 'Checking for overdue invoices...',
      userWallet: freelancerWallet
    });
    
    await reminderService.checkAndSendReminders();
    
    addNotification({
      type: 'success',
      message: 'Payment reminder check completed!',
      userWallet: freelancerWallet
    });
    
    // Reload invoices to see updated reminder counts
    await loadInvoicesData();
    
  } catch (error) {
    console.error('Error checking reminders:', error);
    addNotification({
      type: 'error',
      message: 'Failed to check reminders: ' + (error instanceof Error ? error.message : String(error)),
      userWallet: freelancerWallet
    });
  }
}

// Extracted the invoice loading logic to reuse
async function loadInvoicesData() {
  try {
    loading = true;
    error = '';
    
    const signer = await getSigner();
    const address = await signer.getAddress();
    freelancerWallet = address; // Use wallet address as-is (case-sensitive)
    
    if (freelancerWallet) {
      console.log('Querying invoices for wallet:', freelancerWallet);
      
      // Query with reminder data
      const { data, error: supabaseError } = await supabase
        .from('invoices')
        .select(`
          *,
          payment_reminders (*)
        `)
        .eq('user_address', freelancerWallet)
        .order('created_at', { ascending: false });
        
      if (supabaseError) {
        console.error('Supabase query error:', supabaseError);
        throw new Error(supabaseError.message);
      }
      
      console.log('Query result:', data);
      invoices = data && Array.isArray(data) ? data : [];
      
      // Debug: Log invoice statuses
      if (invoices.length > 0) {
        console.log('Invoice statuses found:', invoices.map(inv => ({ 
          id: inv.id, 
          project: inv.project_name, 
          status: inv.status, 
          user_address: inv.user_address,
          chain_tx_hash: inv.chain_tx_hash
        })));
        
        // Show the categorization
        const unpaid = invoices.filter(inv => 
          inv.status === 'pending' || !inv.status
        );
        const paid = invoices.filter(inv => 
          inv.status === 'paid'
        );
        const rejected = invoices.filter(inv => inv.status === 'rejected');
        
        console.log('Categorized invoices:', {
          unpaid: unpaid.length,
          paid: paid.length, 
          rejected: rejected.length,
          total: invoices.length
        });
      }
      
      // If still no results, check what addresses exist in the DB
      if (invoices.length === 0) {
        const { data: allInvoices } = await supabase
          .from('invoices')
          .select('user_address, project_name, created_at')
          .limit(10);
        
        console.log('No invoices found for wallet:', freelancerWallet);
        console.log('All invoices in DB:', allInvoices);
      }
    } else {
      invoices = [];
    }
  } catch (err) {
    console.error('Error loading invoices:', err);
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      error = 'Network error: Unable to connect to the database. Please check your internet connection and try again.';
    } else {
      error = 'Failed to load invoices. Please try refreshing the page.';
    }
    invoices = [];
  } finally {
    loading = false;
  }
}

function getInvoiceLink(id: string) {
  return `${APP_CONFIG.baseUrl}/invoice/${id}`;
}

async function copyInvoiceLink(invoice: any) {
  try {
    const link = getInvoiceLink(invoice.id);
    await navigator.clipboard.writeText(link);
    
    // Show toast notification
    toast = {
      open: true,
      message: `Invoice link copied for "${invoice.project_name}"`,
      success: true
    };
  } catch (error) {
    console.error('Failed to copy link:', error);
    toast = {
      open: true,
      message: 'Failed to copy link to clipboard',
      success: false
    };
  }
}

</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900">My Invoices</h1>
    <div class="flex space-x-2">
    
      <button 
        onclick={checkReminders}
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
      >
        Check Reminders
      </button>
      <a 
        href="/freelancer/dashboard/create-invoice"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Create New Invoice
      </a>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-500">Loading invoices...</p>
    </div>
  {:else if invoices.length === 0}
    <div class="text-center py-12 bg-white rounded-lg shadow-sm">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
      <p class="text-gray-500 mb-4">Start by creating your first invoice to get paid faster.</p>
      <a 
        href="/freelancer/dashboard/create-invoice"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Create First Invoice
      </a>
    </div>
  {:else}
    <!-- Unpaid Invoices Section -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
        <h2 class="text-lg font-semibold text-yellow-800">Unpaid Invoices ({unpaidInvoices.length})</h2>
      </div>
      {#if unpaidInvoices.length === 0}
        <div class="text-center py-8">
          <p class="text-gray-500">No unpaid invoices</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project & Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reminders
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each unpaidInvoices as inv (inv.id)}
                {@const status = getInvoiceStatus(inv)}
                {@const reminderStatus = getReminderStatus(inv)}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {inv.project_name}
                      </div>
                      <div class="text-sm text-gray-500">
                        {inv.client_email || inv.client_name || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {inv.amount} {inv.token || 'NERO'}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'No due date'}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {status.class}">
                      {status.text}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {reminderStatus.class}">
                      {reminderStatus.text}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {#if inv.chain_tx_hash}
                      <a 
                        href="https://testnet.neroscan.io/tx/{inv.chain_tx_hash}" 
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-900 text-sm underline"
                        title="Invoice Creation Transaction"
                      >
                        View Transaction
                      </a>
                    {:else}
                      <span class="text-sm text-gray-500">N/A</span>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <a 
                      href="/invoice/{inv.id}" 
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </a>
                    <button 
                      onclick={() => toggleReminders(inv)}
                      class="text-indigo-600 hover:text-indigo-900 cursor-pointer hover:bg-indigo-50 px-2 py-1 rounded transition-colors duration-200"
                    >
                      {inv.reminder_enabled ? 'Disable' : 'Enable'} Reminders
                    </button>
                    <button 
                      onclick={() => sendManualReminder(inv)}
                      class="text-orange-600 hover:text-orange-900 cursor-pointer hover:bg-orange-50 px-2 py-1 rounded transition-colors duration-200"
                      title="Send a payment reminder email now"
                    >
                      Send Reminder
                    </button>
                    <button 
                      class="text-green-600 hover:text-green-900 cursor-pointer hover:bg-green-50 px-2 py-1 rounded transition-colors duration-200" 
                      onclick={() => copyInvoiceLink(inv)}
                    >
                      Copy Link
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <!-- Paid Invoices Section -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="bg-green-50 border-b border-green-200 px-6 py-3">
        <h2 class="text-lg font-semibold text-green-800">Paid Invoices ({paidInvoices.length})</h2>
      </div>
      {#if paidInvoices.length === 0}
        <div class="text-center py-8">
          <p class="text-gray-500">No paid invoices</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project & Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each paidInvoices as inv (inv.id)}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {inv.project_name}
                      </div>
                      <div class="text-sm text-gray-500">
                        {inv.client_email || inv.client_name || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {inv.amount} {inv.token || 'NERO'}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {#if inv.chain_tx_hash}
                      <a 
                        href="https://testnet.neroscan.io/tx/{inv.chain_tx_hash}" 
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-900 text-sm underline"
                        title="Transaction Hash"
                      >
                        View Transaction
                      </a>
                    {:else}
                      <span class="text-sm text-gray-500">N/A</span>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <a 
                      href="/invoice/{inv.id}" 
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </a>
                    <button 
                      class="text-green-600 hover:text-green-900 cursor-pointer hover:bg-green-50 px-2 py-1 rounded transition-colors duration-200" 
                      onclick={() => copyInvoiceLink(inv)}
                    >
                      Copy Link
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    <!-- Rejected Invoices Section -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="bg-red-50 border-b border-red-200 px-6 py-3">
        <h2 class="text-lg font-semibold text-red-800">Rejected Invoices ({rejectedInvoices.length})</h2>
      </div>
      {#if rejectedInvoices.length === 0}
        <div class="text-center py-8">
          <p class="text-gray-500">No rejected invoices</p>
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project & Client
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rejection Reason
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each rejectedInvoices as inv (inv.id)}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {inv.project_name}
                      </div>
                      <div class="text-sm text-gray-500">
                        {inv.client_email || inv.client_name || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {inv.amount} {inv.token || 'NERO'}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {new Date(inv.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {inv.status || 'rejected'}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    {#if inv.rejection_reason}
                      <div class="max-w-xs">
                        <div class="text-sm text-gray-900 truncate" title={inv.rejection_reason}>
                          {inv.rejection_reason}
                        </div>
                      </div>
                    {:else}
                      <span class="text-sm text-gray-500">No reason provided</span>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {#if inv.chain_tx_hash}
                      <a 
                        href="https://testnet.neroscan.io/tx/{inv.chain_tx_hash}" 
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-900 text-sm underline"
                        title="Invoice Creation Transaction"
                      >
                        View Transaction
                      </a>
                    {:else}
                      <span class="text-sm text-gray-500">N/A</span>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <a 
                      href="/invoice/{inv.id}" 
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </a>
                    <button 
                      class="text-green-600 hover:text-green-900 cursor-pointer hover:bg-green-50 px-2 py-1 rounded transition-colors duration-200" 
                      onclick={() => copyInvoiceLink(inv)}
                    >
                      Copy Link
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/if}
</div>

<Toast open={toast.open} status={toast.message} success={toast.success} error={false} />