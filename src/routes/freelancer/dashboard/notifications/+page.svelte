<script lang="ts">
import { onMount } from 'svelte';
import { getNotifications, markNotificationRead, addNotification, type Notification } from '$lib/utils/notifications';
import { supabase } from '$lib/utils/supabaseClient';
import NotificationsList from '$lib/components/ui/NotificationsList.svelte';

let notifications: Notification[] = $state([]);
let allNotifications: Notification[] = $state([]);
let userWallet = $state('');
let loading = $state(true);

onMount(async () => {
  await loadUserAndNotifications();
});

async function loadUserAndNotifications() {
  try {
    loading = true;
    // Get user wallet address from localStorage
    userWallet = localStorage.getItem('connectedWallet') || '';
    console.log('Using wallet address:', userWallet);
    console.log('Wallet address type:', typeof userWallet);
    console.log('Wallet address length:', userWallet?.length);
    
    // Get ALL notifications for debugging
    const { data: allNotifs, error: allError } = await supabase
      .from('notifications')
      .select('*')
      .order('timestamp', { ascending: false });
    
    console.log('Raw DB query result:', { 
      count: allNotifs?.length || 0, 
      error: allError,
      sample: allNotifs?.slice(0, 3) 
    });
    
    allNotifications = allNotifs || [];
    
    // Load user-specific notifications
    if (userWallet) {
      notifications = await getNotifications(userWallet);
    }
  } catch (error) {
    console.error('Error loading notifications:', error);
  } finally {
    loading = false;
  }
}

async function showAllNotificationsQuery() {
  try {
    console.log('=== DIRECT DB QUERY TEST ===');
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' });
    
    console.log('Direct query result:', {
      data: data?.length || 0,
      count,
      error,
      firstFew: data?.slice(0, 3)
    });
    
    if (data && data.length > 0) {
      console.log('Sample notification user_wallet values:');
      data.slice(0, 5).forEach((notif, i) => {
        console.log(`[${i}] user_wallet:`, {
          value: notif.user_wallet,
          type: typeof notif.user_wallet,
          length: notif.user_wallet?.length,
          currentUserMatch: notif.user_wallet === userWallet,
          currentUserLowerMatch: notif.user_wallet?.toLowerCase() === userWallet?.toLowerCase()
        });
      });
    }
  } catch (error) {
    console.error('Error in direct query:', error);
  }
}

async function createTestNotification() {
  if (!userWallet) {
    alert('No wallet connected! Please connect your wallet first.');
    return;
  }
  
  try {
    console.log('=== CREATING TEST NOTIFICATION ===');
    console.log('Creating test notification for wallet:', userWallet);
    
    const testNotification = {
      user_wallet: userWallet,
      type: 'test',
      message: `Test notification created at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
      job_id: null,
      read: false
    };
    
    console.log('Notification data:', testNotification);
    
    const { data: insertData, error: insertError } = await supabase
      .from('notifications')
      .insert(testNotification)
      .select();
    
    console.log('Insert result:', { 
      success: !insertError,
      data: insertData, 
      error: insertError 
    });
    
    if (insertError) {
      console.error('❌ Failed to create notification:', insertError);
      alert(`Failed to create notification: ${insertError.message}`);
      return;
    }
    
    console.log('✅ Test notification created successfully!');
    alert('✅ Test notification created successfully!');
    
    // Refresh the notifications
    await loadUserAndNotifications();
    
  } catch (error) {
    console.error('Error creating test notification:', error);
    alert(`Error: ${error}`);
  }
}

async function createMultipleTestNotifications() {
  if (!userWallet) {
    alert('No wallet connected! Please connect your wallet first.');
    return;
  }
  
  try {
    console.log('=== CREATING MULTIPLE TEST NOTIFICATIONS ===');
    
    const notifications = [
      {
        user_wallet: userWallet,
        type: 'job_application',
        message: 'Your application for "Frontend Developer" position has been submitted',
        job_id: null,
        read: false
      },
      {
        user_wallet: userWallet,
        type: 'payment',
        message: 'Payment of $500 has been received for completed project',
        job_id: null,
        read: false
      },
      {
        user_wallet: userWallet,
        type: 'message',
        message: 'You have a new message from client about project requirements',
        job_id: null,
        read: true // This one is already read
      },
      {
        user_wallet: userWallet,
        type: 'deadline',
        message: 'Project deadline is approaching in 2 days',
        job_id: null,
        read: false
      },
      {
        user_wallet: userWallet,
        type: 'system',
        message: 'Welcome to NeroWork! Complete your profile to get started',
        job_id: null,
        read: false
      }
    ];
    
    console.log('Creating', notifications.length, 'test notifications...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)
      .select();
    
    if (insertError) {
      console.error('❌ Failed to create notifications:', insertError);
      alert(`Failed to create notifications: ${insertError.message}`);
      return;
    }
    
    console.log('✅ Created', insertData?.length || 0, 'test notifications!');
    alert(`✅ Created ${insertData?.length || 0} test notifications!`);
    
    // Refresh the notifications
    await loadUserAndNotifications();
    
  } catch (error) {
    console.error('Error creating test notifications:', error);
    alert(`Error: ${error}`);
  }
}

async function markAsRead(id: string) {
  try {
    await markNotificationRead(id);
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    allNotifications = allNotifications.map(n => n.id === id ? { ...n, read: true } : n);
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}


async function createNotificationsTable() {
  console.log('=== CREATING NOTIFICATIONS TABLE ===');
  
  const createTableSQL = `
-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_wallet TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  job_id UUID NULL,
  read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_wallet ON notifications(user_wallet);
CREATE INDEX IF NOT EXISTS idx_notifications_timestamp ON notifications(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations on notifications" ON notifications
  FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;
  
  console.log('📋 SQL to create notifications table:');
  console.log(createTableSQL);
  console.log('');
  console.log('🔹 INSTRUCTIONS:');
  console.log('1. Go to Supabase Dashboard → SQL Editor');
  console.log('2. Copy the SQL above and paste it');
  console.log('3. Click "RUN" to execute');
  console.log('4. Come back and click "Test Table Access" button');
  
  // Also copy to clipboard if possible
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(createTableSQL);
      console.log('✅ SQL copied to clipboard!');
      alert('SQL copied to clipboard! Go to Supabase SQL Editor and paste it.');
    } catch (err) {
      console.log('Could not copy to clipboard:', err);
      alert('Please copy the SQL from the console and run it in Supabase SQL Editor.');
    }
  } else {
    alert('Please copy the SQL from the console and run it in Supabase SQL Editor.');
  }
}

async function testTableAccess() {
  console.log('=== TESTING TABLE ACCESS ===');
  
  try {
    // Test 1: Check if table exists and is accessible
    console.log('Test 1: Basic table access');
    const { data: testData, error: testError, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .limit(1);
    
    console.log('Table access result:', {
      accessible: !testError,
      recordCount: count || 0,
      error: testError?.message,
      errorCode: testError?.code
    });
    
    if (testError) {
      if (testError.code === '42P01') {
        console.log('❌ Table does not exist. Please run the CREATE TABLE SQL first.');
        alert('Table does not exist. Please run the CREATE TABLE SQL first.');
        return;
      } else {
        console.log('❌ Access error:', testError.message);
        return;
      }
    }
    
    console.log('✅ Table is accessible!');
    
    // Test 2: Try to insert a test record
    console.log('Test 2: Insert permission test');
    const testNotification = {
      user_wallet: '0x1234567890123456789012345678901234567890',
      type: 'system',
      message: 'Table setup test notification',
      job_id: null,
      read: false
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('notifications')
      .insert(testNotification)
      .select();
    
    console.log('Insert test result:', {
      success: !insertError,
      data: insertData,
      error: insertError?.message,
      errorCode: insertError?.code
    });
    
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      if (insertError.code === '42501') {
        console.log('This is an RLS policy issue. The CREATE TABLE SQL should have fixed this.');
      }
      return;
    }
    
    console.log('✅ Insert successful!');
    
    // Test 3: Try to read the record back
    console.log('Test 3: Read permission test');
    const { data: readData, error: readError } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    console.log('Read test result:', {
      success: !readError,
      recordCount: readData?.length || 0,
      records: readData,
      error: readError?.message
    });
    
    if (!readError && readData && readData.length > 0) {
      console.log('✅ All tests passed! Table is ready to use.');
      alert('✅ All tests passed! The notifications table is set up correctly.');
      await loadUserAndNotifications(); // Refresh the page data
    }
    
  } catch (error) {
    console.error('Error in table access test:', error);
  }
  
  console.log('=== END TABLE ACCESS TEST ===');
}
</script>

<div class="max-w-4xl mx-auto p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Notifications</h1>
  
  {#if loading}
    <div class="text-gray-500">Loading notifications...</div>
  {:else}
    <div class="mb-4">
      <p class="text-sm text-gray-600 mb-2">User Wallet: {userWallet || 'Not connected'}</p>
      <div class="space-y-2">
        <!-- Setup buttons -->
        <div class="bg-blue-50 p-3 rounded border border-blue-200">
          <p class="text-sm font-medium text-blue-800 mb-2">🔧 Setup New Table:</p>
          <button 
            class="px-3 py-1 bg-blue-600 text-white rounded text-xs mr-2" 
            onclick={createNotificationsTable}
          >
            1. Create Table SQL
          </button>
          <button 
            class="px-3 py-1 bg-blue-700 text-white rounded text-xs" 
            onclick={testTableAccess}
          >
            2. Test Table Access
          </button>
        </div>
        
        <!-- Testing buttons -->
        <div class="bg-green-50 p-3 rounded border border-green-200">
          <p class="text-sm font-medium text-green-800 mb-2">🧪 Test Notifications:</p>
          <button 
            class="px-3 py-1 bg-green-600 text-white rounded text-xs mr-2" 
            onclick={createTestNotification}
          >
            Create Single Test
          </button>
          <button 
            class="px-3 py-1 bg-green-700 text-white rounded text-xs mr-2" 
            onclick={createMultipleTestNotifications}
          >
            Create Multiple Tests
          </button>
          <button 
            class="px-3 py-1 bg-green-800 text-white rounded text-xs" 
            onclick={loadUserAndNotifications}
          >
            Refresh
          </button>
        </div>
        
        <!-- Debug buttons (if needed) -->
        <div class="bg-gray-50 p-3 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-800 mb-2">🔍 Debug Tools:</p>
          <button 
            class="px-3 py-1 bg-purple-600 text-white rounded text-xs mr-2" 
            onclick={showAllNotificationsQuery}
          >
            Debug DB Query
          </button>
          <button 
            class="px-3 py-1 bg-red-600 text-white rounded text-xs mr-2" 
        
          >
            Test DB Connection
          </button>
          <button 
            class="px-3 py-1 bg-indigo-600 text-white rounded text-xs" 
            
          >
            Check Schema
          </button>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- User notifications (same as navbar) -->
      <div>
        <h2 class="text-xl font-semibold mb-3">Your Notifications</h2>
        {#if userWallet}
          <NotificationsList userWallet={userWallet} />
        {:else}
          <div class="text-gray-500">No wallet connected</div>
        {/if}
      </div>

      <!-- All notifications for debugging -->
      <div>
        <h2 class="text-xl font-semibold mb-3">All Notifications (Debug)</h2>
        {#if allNotifications.length === 0}
          <div class="text-gray-500">No notifications in database.</div>
        {:else}
          <div class="w-full bg-white rounded shadow p-4 max-h-96 overflow-y-auto">
            <ul class="divide-y">
              {#each allNotifications as notif}
                <li class="py-2 {notif.read ? 'opacity-60' : ''}">
                  <div class="text-sm font-medium">{notif.message}</div>
                  <div class="text-xs text-gray-400">{new Date(notif.timestamp).toLocaleString()}</div>
                  <div class="text-xs text-gray-500">Wallet: {notif.user_wallet}</div>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
