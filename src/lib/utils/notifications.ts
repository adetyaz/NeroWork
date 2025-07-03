// Svelte 5 notification utility for Supabase
// Usage: import { addNotification, getNotifications, markNotificationRead } from './notifications';

import { supabase } from './supabaseClient.js';

interface AddNotificationParams {
	userWallet: string;
	type: string;
	message: string;
	jobId?: string | null;
}

export async function addNotification({
	userWallet,
	type,
	message,
	jobId = null
}: AddNotificationParams) {
	const { error } = await supabase.from('notifications').insert({
		user_wallet: userWallet,
		type,
		message,
		job_id: jobId,
		read: false,
		timestamp: new Date().toISOString()
	});

	if (error) {
		console.error('Error adding notification:', error);
		throw error;
	}
	console.log('Notification added successfully for wallet:', userWallet);
}

export interface Notification {
	id: string;
	user_wallet: string;
	type: string;
	message: string;
	job_id: string | null;
	read: boolean;
	timestamp: string;
}

export async function getNotifications(userWallet: string): Promise<Notification[]> {
	console.log('=== getNotifications - RETURN ALL NOTIFICATIONS ===');
	console.log('Input wallet (ignored):', userWallet);

	try {
		// Get ALL notifications from the database without any filtering
		const { data: allNotifications, error } = await supabase
			.from('notifications')
			.select('*')
			.order('timestamp', { ascending: false });

		console.log('ALL notifications in DB:', {
			count: allNotifications?.length || 0,
			error: error
		});

		// If no notifications found, let's investigate further
		if (!allNotifications || allNotifications.length === 0) {
			console.log("⚠️  No notifications found! Let's debug...");
			// Check what tables exist - try different approaches for different Supabase setups
			try {
				console.log('Attempting to list tables...');

				// Try direct SQL query first (works in most cases)
				const { data: tables, error: tablesError } = await supabase.rpc('get_table_names', {});

				if (tablesError) {
					console.log('RPC function not available, trying information_schema...');

					// Fallback: try to query a known table to check permissions
					const { data: testQuery, error: testError } = await supabase
						.from('notifications')
						.select('*')
						.limit(0);

					console.log('Notifications table access test:', {
						accessible: !testError,
						error: testError?.message,
						code: testError?.code
					});

					// Try to get any available tables by testing common ones
					const commonTables = ['notifications', 'users', 'invoices', 'jobs', 'profiles'];
					const accessibleTables = [];

					for (const tableName of commonTables) {
						try {
							const { data, error } = await supabase.from(tableName).select('*').limit(0);

							if (!error) {
								accessibleTables.push(tableName);
							}
						} catch (err) {
							// Table doesn't exist or no access
						}
					}

					console.log('Accessible tables found:', accessibleTables);
				} else {
					console.log('Available tables in database:', {
						tables: tables || [],
						error: tablesError
					});
				}
			} catch (err) {
				console.log('Could not list tables:', err);
			}

			// Check if there are any tables with similar names
			const possibleTableNames = ['notification', 'user_notifications', 'alerts', 'messages'];

			for (const tableName of possibleTableNames) {
				try {
					const { data: testData, error: testError } = await supabase
						.from(tableName)
						.select('*')
						.limit(1);

					if (!testError && testData) {
						console.log(`✅ Found table "${tableName}" with ${testData.length} records`);
					}
				} catch (err) {
					// Table doesn't exist, ignore
				}
			}
		}

		if (error) {
			console.error('Error fetching all notifications:', error);
			throw error;
		}

		if (allNotifications && allNotifications.length > 0) {
			console.log('All notifications (first 5):');
			allNotifications.slice(0, 5).forEach((notif, i) => {
				console.log(`[${i}]:`, {
					id: notif.id,
					user_wallet: notif.user_wallet,
					message: notif.message.substring(0, 50) + '...',
					type: notif.type,
					read: notif.read,
					timestamp: notif.timestamp
				});
			});
		}

		console.log('Returning ALL notifications:', allNotifications?.length || 0);
		return allNotifications || [];
	} catch (error) {
		console.error('Error in getNotifications:', error);
		throw error;
	}
}

export async function markNotificationRead(notificationId: string): Promise<void> {
	const { error } = await supabase
		.from('notifications')
		.update({ read: true })
		.eq('id', notificationId);

	if (error) throw error;
}

// Debug function to test database connection
export async function debugDatabaseConnection() {
	console.log('=== DATABASE CONNECTION DEBUG ===');

	try {
		// Test 1: Basic Supabase client info
		console.log('Test 1: Supabase client info');
		console.log('Supabase client exists:', !!supabase);
		console.log(
			'Client methods available:',
			Object.getOwnPropertyNames(Object.getPrototypeOf(supabase))
		);

		// Test 2: Try connecting to a table that should exist (invoices)
		console.log('Test 2: Testing connection with invoices table');
		const { data: invoicesTest, error: invoicesError } = await supabase
			.from('invoices')
			.select('*')
			.limit(1);

		console.log('Invoices table test:', {
			success: !invoicesError,
			error: invoicesError?.message,
			count: invoicesTest?.length || 0
		});

		// Test 3: Test notifications table specifically
		console.log('Test 3: Testing notifications table');
		const { data: notifTest, error: notifError } = await supabase
			.from('notifications')
			.select('*')
			.limit(1);

		console.log('Notifications table test:', {
			success: !notifError,
			error: notifError?.message,
			errorCode: notifError?.code,
			count: notifTest?.length || 0
		});

		// Test 4: Get all available tables
		console.log('Test 4: Listing all tables in database');
		const { data: tables, error: tablesError } = await supabase
			.from('information_schema.tables')
			.select('table_name')
			.eq('table_schema', 'public');

		console.log('Available tables:', {
			tables: tables?.map((t) => t.table_name) || [],
			error: tablesError?.message
		});

		// Test 5: Look for notification-related tables
		if (tables && tables.length > 0) {
			console.log('Test 5: Checking for notification-related tables');
			const notificationTables = tables.filter(
				(t) =>
					t.table_name.toLowerCase().includes('notif') ||
					t.table_name.toLowerCase().includes('alert') ||
					t.table_name.toLowerCase().includes('message')
			);

			console.log(
				'Notification-related tables:',
				notificationTables.map((t) => t.table_name)
			);

			// Test each notification-related table for data
			for (const table of notificationTables) {
				try {
					const { data: tableData, error: tableError } = await supabase
						.from(table.table_name)
						.select('*')
						.limit(5);

					console.log(`Table "${table.table_name}":`, {
						count: tableData?.length || 0,
						error: tableError?.message,
						sample: tableData?.slice(0, 2)
					});
				} catch (err) {
					console.log(`Error checking table "${table.table_name}":`, err);
				}
			}
		}
	} catch (error) {
		console.error('Database debug failed:', error);
	}

	console.log('=== END DATABASE DEBUG ===');
}

// New function to get detailed table schema information
export async function getTableSchema(tableName: string = 'notifications') {
	console.log(`=== SCHEMA INFO FOR TABLE: ${tableName} ===`);

	try {
		// Get column information
		const { data: columns, error: columnsError } = await supabase
			.from('information_schema.columns')
			.select('column_name, data_type, is_nullable, column_default')
			.eq('table_name', tableName)
			.eq('table_schema', 'public');

		console.log('Table columns:', {
			columns: columns || [],
			error: columnsError?.message
		});

		// Get table info (like row count)
		const {
			data: tableData,
			error: tableError,
			count
		} = await supabase.from(tableName).select('*', { count: 'exact' }).limit(0);

		console.log('Table statistics:', {
			totalRows: count,
			error: tableError?.message
		});

		// If table has data, show sample records
		if (count && count > 0) {
			const { data: sampleData, error: sampleError } = await supabase
				.from(tableName)
				.select('*')
				.limit(3);

			console.log('Sample records:', {
				data: sampleData,
				error: sampleError?.message
			});
		}
	} catch (error) {
		console.error(`Error getting schema for ${tableName}:`, error);
	}

	console.log(`=== END SCHEMA INFO FOR ${tableName} ===`);
}

// Function to show current environment configuration
export async function showEnvironmentInfo() {
	console.log('=== ENVIRONMENT INFO ===');

	try {
		// Check if we can access environment variables
		// Note: This will only work in development, not in production builds
		const envInfo = {
			// These should be available in static/public context
			hasSupabaseUrl:
				!!import.meta.env?.VITE_PUBLIC_SUPABASE_URL || !!process.env?.PUBLIC_SUPABASE_URL,
			hasSupabaseKey:
				!!import.meta.env?.VITE_PUBLIC_SUPABASE_ANON_KEY || !!process.env?.PUBLIC_SUPABASE_ANON_KEY,
			nodeEnv: import.meta.env?.NODE_ENV || process.env?.NODE_ENV || 'unknown',
			mode: import.meta.env?.MODE || 'unknown'
		};

		console.log('Environment configuration:', envInfo);

		// Try to get Supabase project ID from URL if possible
		// The URL format is usually: https://[project-id].supabase.co
		const urlPattern = /https:\/\/([^.]+)\.supabase\.co/;

		// We can't access the actual URL directly due to TypeScript restrictions,
		// but we can test the connection to see if it's working
		const { data: testConnection, error: connectionError } = await supabase
			.from('information_schema.tables')
			.select('table_name')
			.limit(1);

		console.log('Supabase connection test:', {
			connected: !connectionError,
			error: connectionError?.message,
			tablesAccessible: !!testConnection
		});

		// Try to identify the project by looking at available tables
		if (testConnection) {
			const { data: allTables, error: tablesError } = await supabase
				.from('information_schema.tables')
				.select('table_name')
				.eq('table_schema', 'public');

			console.log('Project tables (may help identify environment):', {
				tableCount: allTables?.length || 0,
				tables: allTables?.map((t) => t.table_name).sort() || [],
				error: tablesError?.message
			});

			// Check for specific tables that might indicate which environment this is
			const keyTables = ['invoices', 'users', 'jobs', 'notifications', 'profiles'];
			const existingKeyTables =
				allTables
					?.filter((t) => keyTables.includes(t.table_name.toLowerCase()))
					.map((t) => t.table_name) || [];

			console.log('Key application tables found:', existingKeyTables);

			// Count records in key tables to get a sense of the data
			for (const tableName of existingKeyTables) {
				try {
					const { count, error } = await supabase
						.from(tableName)
						.select('*', { count: 'exact' })
						.limit(0);

					console.log(`Table "${tableName}" record count:`, {
						count: count || 0,
						error: error?.message
					});
				} catch (err) {
					console.log(`Error counting records in "${tableName}":`, err);
				}
			}
		}
	} catch (error) {
		console.error('Error getting environment info:', error);
	}

	console.log('=== END ENVIRONMENT INFO ===');
}

// Function to help diagnose the missing notifications issue
export async function findMissingNotifications() {
	console.log('=== FINDING MISSING NOTIFICATIONS ===');

	try {
		// 1. Check all possible notification-related tables for data
		const { data: allTables } = await supabase
			.from('information_schema.tables')
			.select('table_name')
			.eq('table_schema', 'public');

		const possibleTables =
			allTables?.filter((t) => {
				const name = t.table_name.toLowerCase();
				return (
					name.includes('notif') ||
					name.includes('message') ||
					name.includes('alert') ||
					name.includes('activity') ||
					name.includes('event') ||
					name.includes('log') ||
					name.includes('history')
				);
			}) || [];

		console.log(
			'Checking possible notification tables:',
			possibleTables.map((t) => t.table_name)
		);

		// Check each table for data
		for (const table of possibleTables) {
			try {
				const {
					data: tableData,
					error,
					count
				} = await supabase.from(table.table_name).select('*', { count: 'exact' }).limit(10);

				if (count && count > 0) {
					console.log(`🔍 FOUND DATA in table "${table.table_name}":`, {
						totalRecords: count,
						sampleData: tableData?.slice(0, 3)
					});

					// If this table has data, check its structure
					const { data: columns } = await supabase
						.from('information_schema.columns')
						.select('column_name, data_type')
						.eq('table_name', table.table_name)
						.eq('table_schema', 'public');

					console.log(
						`Schema for "${table.table_name}":`,
						columns?.map((c) => `${c.column_name} (${c.data_type})`) || []
					);
				} else {
					console.log(`Table "${table.table_name}": ${count || 0} records`);
				}
			} catch (err) {
				console.log(`Error checking table "${table.table_name}":`, err);
			}
		}

		// 2. Check for any tables with user-related data that might contain notifications
		const userTables =
			allTables?.filter((t) => {
				const name = t.table_name.toLowerCase();
				return name.includes('user') || name.includes('profile') || name.includes('account');
			}) || [];

		console.log('Checking user-related tables for notification columns:');
		for (const table of userTables) {
			try {
				const { data: columns } = await supabase
					.from('information_schema.columns')
					.select('column_name, data_type')
					.eq('table_name', table.table_name)
					.eq('table_schema', 'public');

				const notifColumns =
					columns?.filter(
						(c) =>
							c.column_name.toLowerCase().includes('notif') ||
							c.column_name.toLowerCase().includes('message') ||
							c.column_name.toLowerCase().includes('alert')
					) || [];

				if (notifColumns.length > 0) {
					console.log(
						`Table "${table.table_name}" has notification columns:`,
						notifColumns.map((c) => c.column_name)
					);
				}
			} catch (err) {
				console.log(`Error checking columns in "${table.table_name}":`, err);
			}
		}

		// 3. Look for recently created tables (in case notifications were moved)
		console.log('All tables in database (sorted by name):');
		console.log(allTables?.map((t) => t.table_name).sort() || []);

		// 4. Check if there are any views that might contain notifications
		const { data: views } = await supabase
			.from('information_schema.views')
			.select('table_name')
			.eq('table_schema', 'public');

		if (views && views.length > 0) {
			console.log(
				'Available views:',
				views.map((v) => v.table_name)
			);

			const notifViews = views.filter((v) => v.table_name.toLowerCase().includes('notif'));

			for (const view of notifViews) {
				try {
					const { data: viewData, count } = await supabase
						.from(view.table_name)
						.select('*', { count: 'exact' })
						.limit(5);

					console.log(`View "${view.table_name}":`, {
						count: count || 0,
						sample: viewData?.slice(0, 2)
					});
				} catch (err) {
					console.log(`Error checking view "${view.table_name}":`, err);
				}
			}
		}
	} catch (error) {
		console.error('Error in findMissingNotifications:', error);
	}

	console.log('=== END MISSING NOTIFICATIONS SEARCH ===');
}

// Function to diagnose and handle Row-Level Security issues
export async function diagnoseRLSIssue() {
	console.log('=== DIAGNOSING ROW-LEVEL SECURITY ===');

	try {
		// 1. Test basic table access
		console.log('Test 1: Checking basic table access');
		const { data: selectTest, error: selectError } = await supabase
			.from('notifications')
			.select('*')
			.limit(1);

		console.log('SELECT access:', {
			allowed: !selectError,
			error: selectError?.message,
			code: selectError?.code
		});

		// 2. Test insert with minimal data
		console.log('Test 2: Testing INSERT permissions');
		const testData = {
			user_wallet: '0x0000000000000000000000000000000000000000',
			type: 'test',
			message: 'RLS test message',
			job_id: null,
			read: false,
			timestamp: new Date().toISOString()
		};

		const { data: insertTest, error: insertError } = await supabase
			.from('notifications')
			.insert(testData);

		console.log('INSERT test result:', {
			success: !insertError,
			error: insertError?.message,
			code: insertError?.code,
			data: insertTest
		});

		// 3. If RLS is the issue, suggest solutions
		if (insertError?.code === '42501') {
			console.log('🛡️ ROW-LEVEL SECURITY ISSUE DETECTED');
			console.log('');
			console.log('SOLUTION OPTIONS:');
			console.log('1. **Disable RLS temporarily for testing:**');
			console.log('   Go to Supabase Dashboard → Database → Tables → notifications');
			console.log('   Toggle off "Enable RLS" (not recommended for production)');
			console.log('');
			console.log('2. **Create a policy to allow inserts:**');
			console.log('   Go to Supabase Dashboard → Authentication → Policies');
			console.log('   Create a new policy for the notifications table');
			console.log('   Example policy: "Allow all operations" with expression: true');
			console.log('');
			console.log('3. **Use service role key (for server-side operations):**');
			console.log('   Replace anon key with service role key in your .env');
			console.log('   This bypasses RLS but should only be used server-side');
		}

		// 4. Test with service authentication if available
		console.log('Test 3: Checking current authentication status');
		const {
			data: { user },
			error: authError
		} = await supabase.auth.getUser();

		console.log('Current user authentication:', {
			authenticated: !!user,
			userId: user?.id || 'none',
			email: user?.email || 'none',
			error: authError?.message
		});

		if (!user) {
			console.log('💡 TIP: You might need to be authenticated to insert notifications');
			console.log('Consider implementing user authentication or using service role key');
		}
	} catch (error) {
		console.error('Error in RLS diagnosis:', error);
	}

	console.log('=== END RLS DIAGNOSIS ===');
}
