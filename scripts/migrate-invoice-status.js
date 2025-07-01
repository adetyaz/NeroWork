/**
 * Migration script to update invoice status from 'unpaid' to 'pending'
 * and ensure all invoices have proper status values
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
	console.error('❌ Missing required environment variables:');
	console.error('  - PUBLIC_SUPABASE_URL');
	console.error('  - SUPABASE_SERVICE_ROLE_KEY');
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateInvoiceStatus() {
	console.log('🚀 Starting invoice status migration...');

	try {
		// Step 1: Get all invoices with null or 'unpaid' status
		console.log('📊 Fetching invoices that need migration...');
		const { data: invoices, error: fetchError } = await supabase
			.from('invoices')
			.select('id, status, transaction_hash')
			.or('status.is.null,status.eq.unpaid');

		if (fetchError) {
			throw new Error(`Failed to fetch invoices: ${fetchError.message}`);
		}

		console.log(`📋 Found ${invoices.length} invoices to migrate`);

		if (invoices.length === 0) {
			console.log('✅ No invoices need migration. All done!');
			return;
		}

		// Step 2: Update invoices based on their current state
		let updatedCount = 0;

		for (const invoice of invoices) {
			let newStatus = 'pending'; // Default for null or 'unpaid'

			// If invoice has a transaction hash, it should be marked as 'paid'
			if (invoice.transaction_hash) {
				newStatus = 'paid';
			}

			console.log(`🔄 Updating invoice ${invoice.id}: ${invoice.status || 'null'} → ${newStatus}`);

			const { error: updateError } = await supabase
				.from('invoices')
				.update({ status: newStatus })
				.eq('id', invoice.id);

			if (updateError) {
				console.error(`❌ Failed to update invoice ${invoice.id}:`, updateError.message);
			} else {
				updatedCount++;
			}
		}

		console.log(`✅ Migration completed! Updated ${updatedCount}/${invoices.length} invoices`);

		// Step 3: Verify migration results
		console.log('🔍 Verifying migration results...');
		const { data: statusCounts, error: verifyError } = await supabase
			.from('invoices')
			.select('status')
			.not('status', 'is', null);

		if (verifyError) {
			console.error('❌ Failed to verify results:', verifyError.message);
			return;
		}

		const counts = statusCounts.reduce((acc, invoice) => {
			const status = invoice.status || 'unknown';
			acc[status] = acc[status] ? acc[status] + 1 : 1;
			return acc;
		}, Object.create(null));

		console.log('📈 Current status distribution:');
		Object.entries(counts).forEach(([status, count]) => {
			console.log(`  ${status}: ${count}`);
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('❌ Migration failed:', errorMessage);
		process.exit(1);
	}
}

// Run migration
migrateInvoiceStatus()
	.then(() => {
		console.log('🎉 Migration script completed successfully!');
		process.exit(0);
	})
	.catch((error) => {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error('💥 Migration script failed:', errorMessage);
		process.exit(1);
	});
