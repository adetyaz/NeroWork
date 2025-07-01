<script lang="ts">
  import { supabase } from '$lib/utils/supabaseClient.js';
  import { getSigner } from '$lib/utils/aaUtils';
  import { DUE_DATE_OPTIONS, DEFAULT_REMINDER_TEMPLATES } from '$lib/types/reminders';
  import { PaymentReminderService } from '$lib/services/paymentReminderService';
  import { browser } from '$app/environment';

  let userAddress = $state('');
  let preferences = $state({
    default_due_days: 30,
    reminders_enabled: true,
    custom_templates: {
      first_reminder: DEFAULT_REMINDER_TEMPLATES.first_reminder,
      second_reminder: DEFAULT_REMINDER_TEMPLATES.second_reminder,
      final_reminder: DEFAULT_REMINDER_TEMPLATES.final_reminder
    },
    excluded_clients: [] as string[]
  });
  
  let newExcludedEmail = $state('');
  let isLoading = $state(true);
  let isSaving = $state(false);
  let message = $state('');
  let activeTab = $state<'settings' | 'templates' | 'excluded'>('settings');

  $effect(() => {
    if (browser) {
      loadPreferences();
    }
  });

  async function loadPreferences() {
    try {
      const signer = await getSigner();
      userAddress = await signer.getAddress(); // Keep original case from wallet
      
      const { data, error } = await supabase
        .from('freelancer_reminder_preferences')
        .select('*')
        .eq('user_address', userAddress)
        .single();

      if (data) {
        preferences = {
          default_due_days: data.default_due_days || 30,
          reminders_enabled: data.reminders_enabled ?? true,
          custom_templates: data.custom_templates || {
            first_reminder: DEFAULT_REMINDER_TEMPLATES.first_reminder,
            second_reminder: DEFAULT_REMINDER_TEMPLATES.second_reminder,
            final_reminder: DEFAULT_REMINDER_TEMPLATES.final_reminder
          },
          excluded_clients: data.excluded_clients || []
        };
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      isLoading = false;
    }
  }

  async function savePreferences() {
    isSaving = true;
    message = '';
    
    try {
      const reminderService = PaymentReminderService.getInstance();
      await reminderService.updateFreelancerPreferences(userAddress, preferences);
      message = 'Preferences saved successfully!';
      setTimeout(() => message = '', 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      message = 'Failed to save preferences. Please try again.';
      setTimeout(() => message = '', 5000);
    } finally {
      isSaving = false;
    }
  }

  function addExcludedClient() {
    const email = newExcludedEmail.trim().toLowerCase();
    if (email && !preferences.excluded_clients.includes(email)) {
      preferences.excluded_clients = [...preferences.excluded_clients, email];
      newExcludedEmail = '';
    }
  }

  function removeExcludedClient(email: string) {
    preferences.excluded_clients = preferences.excluded_clients.filter(e => e !== email);
  }

  function resetTemplate(type: 'first_reminder' | 'second_reminder' | 'final_reminder') {
    preferences.custom_templates[type] = DEFAULT_REMINDER_TEMPLATES[type];
  }
</script>

<div class="max-w-4xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Payment Reminder Settings</h2>
      <p class="text-sm text-gray-600 mt-1">Configure how and when to remind clients about overdue payments</p>
    </div>

    {#if isLoading}
      <div class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-500 mt-2">Loading preferences...</p>
      </div>
    {:else}
      <!-- Tab Navigation -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
            onclick={() => activeTab = 'settings'}
          >
            General Settings
          </button>
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'templates' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
            onclick={() => activeTab = 'templates'}
          >
            Email Templates
          </button>
          <button
            class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'excluded' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
            onclick={() => activeTab = 'excluded'}
          >
            Excluded Clients
          </button>
        </nav>
      </div>

      <div class="p-6">
        {#if activeTab === 'settings'}
          <!-- General Settings -->
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="dueDaySelect" class="block text-sm font-medium text-gray-700 mb-2">Default Payment Due Period</label>
                <select 
                  id="dueDaySelect"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  bind:value={preferences.default_due_days}
                >
                  {#each DUE_DATE_OPTIONS as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
                <p class="mt-1 text-xs text-gray-500">Default payment due period for new invoices</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payment Reminders</label>
                <div class="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    bind:checked={preferences.reminders_enabled}
                  />
                  <span class="text-sm text-gray-700">Enable automatic payment reminders</span>
                </div>
                <p class="mt-1 text-xs text-gray-500">Send reminders at 7, 14, and 30 days overdue</p>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 class="text-sm font-medium text-blue-900 mb-2">How Reminders Work</h4>
              <ul class="text-xs text-blue-800 space-y-1">
                <li>• <strong>First Reminder:</strong> Sent 7 days after due date (friendly tone)</li>
                <li>• <strong>Second Reminder:</strong> Sent 14 days after due date (professional tone)</li>
                <li>• <strong>Final Notice:</strong> Sent 30 days after due date (urgent tone)</li>
              </ul>
            </div>
          </div>

        {:else if activeTab === 'templates'}
          <!-- Email Templates -->
          <div class="space-y-8">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700">First Reminder</label>
                <button
                  type="button"
                  class="text-xs text-blue-600 hover:text-blue-800"
                  onclick={() => resetTemplate('first_reminder')}
                >
                  Reset to Default
                </button>
              </div>
              <textarea
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="8"
                bind:value={preferences.custom_templates.first_reminder}
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">
                Available variables: &#123;project_name&#125;, &#123;days_overdue&#125;, &#123;amount&#125;, &#123;token&#125;, &#123;due_date&#125;, &#123;invoice_link&#125;, &#123;freelancer_name&#125;
              </p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700">Second Reminder</label>
                <button
                  type="button"
                  class="text-xs text-blue-600 hover:text-blue-800"
                  onclick={() => resetTemplate('second_reminder')}
                >
                  Reset to Default
                </button>
              </div>
              <textarea
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="8"
                bind:value={preferences.custom_templates.second_reminder}
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">
                Available variables: &#123;project_name&#125;, &#123;days_overdue&#125;, &#123;amount&#125;, &#123;token&#125;, &#123;due_date&#125;, &#123;invoice_link&#125;, &#123;freelancer_name&#125;
              </p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700">Final Reminder</label>
                <button
                  type="button"
                  class="text-xs text-blue-600 hover:text-blue-800"
                  onclick={() => resetTemplate('final_reminder')}
                >
                  Reset to Default
                </button>
              </div>
              <textarea
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="8"
                bind:value={preferences.custom_templates.final_reminder}
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">
                Available variables: &#123;project_name&#125;, &#123;days_overdue&#125;, &#123;amount&#125;, &#123;token&#125;, &#123;due_date&#125;, &#123;invoice_link&#125;, &#123;freelancer_name&#125;
              </p>
            </div>
          </div>

        {:else if activeTab === 'excluded'}
          <!-- Excluded Clients -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Add Client to Exclude</label>
              <div class="flex space-x-2">
                <input
                  type="email"
                  class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="client@example.com"
                  bind:value={newExcludedEmail}
                  onkeydown={(e) => e.key === 'Enter' && addExcludedClient()}
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onclick={addExcludedClient}
                >
                  Add
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500">Clients in this list will never receive payment reminders</p>
            </div>

            {#if preferences.excluded_clients.length > 0}
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3">Excluded Clients</h4>
                <div class="space-y-2">
                  {#each preferences.excluded_clients as email}
                    <div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                      <span class="text-sm text-gray-700">{email}</span>
                      <button
                        type="button"
                        class="text-red-600 hover:text-red-800 text-sm"
                        onclick={() => removeExcludedClient(email)}
                      >
                        Remove
                      </button>
                    </div>
                  {/each}
                </div>
              </div>
            {:else}
              <div class="text-center py-8 text-gray-500">
                <p class="text-sm">No excluded clients</p>
                <p class="text-xs">Add client emails above to exclude them from automatic reminders</p>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Save Button -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          {#if message}
            <div class="text-sm {message.includes('success') ? 'text-green-600' : 'text-red-600'}">
              {message}
            </div>
          {:else}
            <div></div>
          {/if}
          
          <button
            type="button"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            onclick={savePreferences}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
