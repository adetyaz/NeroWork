<script lang="ts">
import { supabase } from '$lib/utils/supabaseClient.js';
import { getSigner } from '$lib/utils/aaUtils';
import { API_KEY } from '$lib/config';
import { addNotification } from '$lib/utils/notifications';
import { PaymentReminderService } from '$lib/services/paymentReminderService.js';
import type { PaymentReminder } from '$lib/types/reminders.js';

let invoices: any[] = $state([]);
let freelancerWallet: string = $state('');
let loading = $state(true);
let error = $state('');

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
    invoice.reminder_enabled = !invoice.reminder_enabled;
    invoices = [...invoices];
    
    addNotification({
      type: 'success',
      message: `Reminders ${invoice.reminder_enabled ? 'enabled' : 'disabled'} for this invoice`,
      userWallet: freelancerWallet
    });
  } catch (error) {
    console.error('Error toggling reminders:', error);
    addNotification({
      type: 'error',
      message: 'Failed to update reminder settings',
      userWallet: freelancerWallet
    });
  }
}

async function sendManualReminder(invoice: any) {
  try {
    await reminderService.sendReminder(invoice);
    
    // Reload invoices to get updated reminder count
    await loadInvoicesData();
    
    addNotification({
      type: 'success',
      message: 'Reminder sent successfully',
      userWallet: freelancerWallet
    });
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    addNotification({
      type: 'error',
      message: 'Failed to send reminder',
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
  return `https://nerowork.netlify.app/invoice/${id}`;
}

async function testEmailSending() {
  try {
    console.log('Testing email sending...');
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: 'illtiger3m@gmail.com', // Your email for testing
        subject: 'Test Email from NeroWork',
        content: `Hello!

This is a test email from the NeroWork payment reminder system.

**Test Details:**
- Sent at: ${new Date().toLocaleString()}
- From: Payment Reminder System
- Purpose: Testing email integration

Best regards,
NeroWork Team`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send test email');
    }

    const result = await response.json();
    
    addNotification({
      type: 'success',
      message: 'Test email sent successfully!',
      userWallet: freelancerWallet
    });
    
    console.log('✅ Test email sent:', result.messageId);
    
  } catch (error) {
    console.error('Error sending test email:', error);
    addNotification({
      type: 'error',
      message: 'Failed to send test email: ' + (error instanceof Error ? error.message : String(error)),
      userWallet: freelancerWallet
    });
  }
}
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900">My Invoices</h1>
    <div class="flex space-x-2">
      <button 
        onclick={testEmailSending}
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
      >
        Test Email
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
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      {inv.reminder_enabled ? 'Disable' : 'Enable'} Reminders
                    </button>
                    {#if inv.reminder_enabled && status.text.includes('overdue')}
                      <button 
                        onclick={() => sendManualReminder(inv)}
                        class="text-orange-600 hover:text-orange-900"
                      >
                        Send Reminder
                      </button>
                    {/if}
                    <button 
                      class="text-green-600 hover:text-green-900" 
                      onclick={() => navigator.clipboard.writeText(getInvoiceLink(inv.id))}
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
                      class="text-green-600 hover:text-green-900" 
                      onclick={() => navigator.clipboard.writeText(getInvoiceLink(inv.id))}
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
                      class="text-green-600 hover:text-green-900" 
                      onclick={() => navigator.clipboard.writeText(getInvoiceLink(inv.id))}
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
