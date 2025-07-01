import { supabase } from '../utils/supabaseClient.js';
import type {
	GasSponsorshipProgram,
	FavoriteClient,
	SponsoredTransaction,
	GasSponsorshipSettings,
	GasSponsorshipStats,
	ClientSponsorshipInfo
} from '../types/gasSponsorship.js';
import {
	DEFAULT_GAS_SPONSORSHIP_SETTINGS,
	GAS_SPONSORSHIP_CONFIG
} from '../types/gasSponsorship.js';

export class GasSponsorshipService {
	private static instance: GasSponsorshipService;
	private settings: GasSponsorshipSettings = DEFAULT_GAS_SPONSORSHIP_SETTINGS;

	static getInstance(): GasSponsorshipService {
		if (!GasSponsorshipService.instance) {
			GasSponsorshipService.instance = new GasSponsorshipService();
		}
		return GasSponsorshipService.instance;
	}

	/**
	 * Initialize gas sponsorship program for a freelancer
	 */
	async initializeGasSponsorshipProgram(
		freelancerAddress: string,
		initialBudget: number,
		budgetToken = 'NERO'
	): Promise<GasSponsorshipProgram> {
		try {
			const { data, error } = await supabase
				.from('gas_sponsorship_programs')
				.insert({
					freelancer_address: freelancerAddress,
					total_budget: initialBudget,
					remaining_budget: initialBudget,
					budget_token: budgetToken,
					is_active: true,
					max_sponsorship_per_tx: DEFAULT_GAS_SPONSORSHIP_SETTINGS.default_max_gas_per_tx,
					sponsored_transactions_count: 0,
					total_sponsored_amount: 0
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error initializing gas sponsorship program:', error);
			throw error;
		}
	}

	/**
	 * Get gas sponsorship program for a freelancer
	 */
	async getGasSponsorshipProgram(freelancerAddress: string): Promise<GasSponsorshipProgram | null> {
		try {
			const { data, error } = await supabase
				.from('gas_sponsorship_programs')
				.select('*')
				.eq('freelancer_address', freelancerAddress)
				.single();

			if (error && error.code !== 'PGRST116') throw error;
			return data;
		} catch (error) {
			console.error('Error getting gas sponsorship program:', error);
			return null;
		}
	}

	/**
	 * Add or update a favorite client
	 */
	async addFavoriteClient(
		freelancerAddress: string,
		clientAddress: string,
		clientEmail?: string,
		clientName?: string
	): Promise<FavoriteClient> {
		try {
			// Get client stats from invoices
			const { data: invoices } = await supabase
				.from('invoices')
				.select('amount, status, created_at, paid_at')
				.eq('user_address', freelancerAddress)
				.eq('client_email', clientEmail)
				.eq('status', 'paid');

			const totalInvoices = invoices?.length || 0;
			const totalPaidAmount = invoices?.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0;
			const firstInvoiceDate = invoices?.length
				? invoices[invoices.length - 1].created_at
				: new Date().toISOString();
			const lastActivityDate = invoices?.length
				? invoices[0].paid_at || invoices[0].created_at
				: new Date().toISOString();

			// Upsert favorite client
			const { data, error } = await supabase
				.from('favorite_clients')
				.upsert(
					{
						freelancer_address: freelancerAddress,
						client_address: clientAddress,
						client_email: clientEmail,
						client_name: clientName,
						is_favorite: true,
						total_invoices: totalInvoices,
						total_paid_amount: totalPaidAmount,
						first_invoice_date: firstInvoiceDate,
						last_activity_date: lastActivityDate,
						gas_sponsorship_enabled: true,
						max_gas_per_transaction: DEFAULT_GAS_SPONSORSHIP_SETTINGS.default_max_gas_per_tx,
						sponsored_transactions_count: 0,
						total_sponsored_gas: 0
					},
					{
						onConflict: 'freelancer_address,client_address'
					}
				)
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error adding favorite client:', error);
			throw error;
		}
	}

	/**
	 * Get favorite clients for a freelancer
	 */
	async getFavoriteClients(freelancerAddress: string): Promise<FavoriteClient[]> {
		try {
			const { data, error } = await supabase
				.from('favorite_clients')
				.select('*')
				.eq('freelancer_address', freelancerAddress.toLowerCase())
				.eq('is_favorite', true)
				.order('last_activity_date', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error getting favorite clients:', error);
			return [];
		}
	}

	/**
	 * Update gas sponsorship settings for a client
	 */
	async updateClientGasSponsorship(
		freelancerAddress: string,
		clientAddress: string,
		enabled: boolean,
		maxGasPerTx?: number
	): Promise<void> {
		try {
			const updateData: any = {
				gas_sponsorship_enabled: enabled,
				updated_at: new Date().toISOString()
			};

			if (maxGasPerTx !== undefined) {
				updateData.max_gas_per_transaction = Math.min(
					Math.max(maxGasPerTx, GAS_SPONSORSHIP_CONFIG.MIN_GAS_PER_TX),
					GAS_SPONSORSHIP_CONFIG.MAX_GAS_PER_TX
				);
			}

			const { error } = await supabase
				.from('favorite_clients')
				.update(updateData)
				.eq('freelancer_address', freelancerAddress.toLowerCase())
				.eq('client_address', clientAddress.toLowerCase());

			if (error) throw error;
		} catch (error) {
			console.error('Error updating client gas sponsorship:', error);
			throw error;
		}
	}

	/**
	 * Check if a client qualifies for gas sponsorship
	 */
	async checkGasSponsorshipEligibility(
		freelancerAddress: string,
		clientAddress: string
	): Promise<ClientSponsorshipInfo | null> {
		try {
			// Get favorite client info
			const { data: favoriteClient, error } = await supabase
				.from('favorite_clients')
				.select('*')
				.eq('freelancer_address', freelancerAddress.toLowerCase())
				.eq('client_address', clientAddress.toLowerCase())
				.single();

			if (error && error.code !== 'PGRST116') throw error;

			if (!favoriteClient) {
				return null; // Not a favorite client
			}

			// Calculate relationship duration
			const firstInvoiceDate = new Date(favoriteClient.first_invoice_date);
			const now = new Date();
			const relationshipDurationDays = Math.floor(
				(now.getTime() - firstInvoiceDate.getTime()) / (1000 * 60 * 60 * 24)
			);

			return {
				is_favorite: favoriteClient.is_favorite,
				gas_sponsorship_enabled: favoriteClient.gas_sponsorship_enabled,
				max_gas_per_transaction: favoriteClient.max_gas_per_transaction,
				sponsored_transactions_count: favoriteClient.sponsored_transactions_count,
				total_sponsored_gas: favoriteClient.total_sponsored_gas,
				client_stats: {
					total_invoices: favoriteClient.total_invoices,
					total_paid_amount: favoriteClient.total_paid_amount,
					relationship_duration_days: relationshipDurationDays,
					last_activity_date: favoriteClient.last_activity_date
				}
			};
		} catch (error) {
			console.error('Error checking gas sponsorship eligibility:', error);
			return null;
		}
	}

	/**
	 * Sponsor gas for a transaction
	 */
	async sponsorGas(
		freelancerAddress: string,
		clientAddress: string,
		transactionHash: string,
		originalGasFee: number,
		invoiceId?: string
	): Promise<boolean> {
		try {
			// Check if sponsorship is enabled for this client
			const eligibility = await this.checkGasSponsorshipEligibility(
				freelancerAddress,
				clientAddress
			);
			if (!eligibility || !eligibility.gas_sponsorship_enabled) {
				console.log('Gas sponsorship not enabled for this client');
				return false;
			}

			// Get sponsorship program
			const program = await this.getGasSponsorshipProgram(freelancerAddress);
			if (!program || !program.is_active) {
				console.log('No active gas sponsorship program');
				return false;
			}

			// Calculate sponsorship amount (limited by max per transaction and remaining budget)
			const maxSponsorshipAmount = Math.min(
				eligibility.max_gas_per_transaction,
				originalGasFee,
				program.remaining_budget
			);

			if (maxSponsorshipAmount <= 0) {
				console.log('No budget remaining for gas sponsorship');
				return false;
			}

			// Record the sponsored transaction
			const { error: sponsorError } = await supabase.from('sponsored_transactions').insert({
				freelancer_address: freelancerAddress.toLowerCase(),
				client_address: clientAddress.toLowerCase(),
				transaction_hash: transactionHash,
				original_gas_fee: originalGasFee,
				sponsored_amount: maxSponsorshipAmount,
				gas_token: program.budget_token,
				invoice_id: invoiceId,
				transaction_type: invoiceId ? 'invoice_payment' : 'other',
				status: 'completed',
				sponsored_at: new Date().toISOString()
			});

			if (sponsorError) throw sponsorError;

			// Update sponsorship program budget
			const { error: programError } = await supabase
				.from('gas_sponsorship_programs')
				.update({
					remaining_budget: program.remaining_budget - maxSponsorshipAmount,
					sponsored_transactions_count: program.sponsored_transactions_count + 1,
					total_sponsored_amount: program.total_sponsored_amount + maxSponsorshipAmount,
					updated_at: new Date().toISOString()
				})
				.eq('freelancer_address', freelancerAddress.toLowerCase());

			if (programError) throw programError;

			// Update client sponsored stats
			const { error: clientError } = await supabase
				.from('favorite_clients')
				.update({
					sponsored_transactions_count: eligibility.sponsored_transactions_count + 1,
					total_sponsored_gas: eligibility.total_sponsored_gas + maxSponsorshipAmount,
					updated_at: new Date().toISOString()
				})
				.eq('freelancer_address', freelancerAddress.toLowerCase())
				.eq('client_address', clientAddress.toLowerCase());

			if (clientError) throw clientError;

			console.log(`✅ Sponsored ${maxSponsorshipAmount} ${program.budget_token} for gas`);
			return true;
		} catch (error) {
			console.error('Error sponsoring gas:', error);
			return false;
		}
	}

	/**
	 * Auto-add clients as favorites based on activity
	 */
	async autoAddFavoriteClients(freelancerAddress: string): Promise<void> {
		try {
			const settings = await this.getGasSponsorshipSettings(freelancerAddress);
			if (!settings.auto_add_favorites) return;

			// Find clients with enough paid invoices who aren't already favorites
			const { data: clientStats } = await supabase
				.from('invoices')
				.select('client_email, client_name, amount, paid_at')
				.eq('user_address', freelancerAddress.toLowerCase())
				.eq('status', 'paid')
				.not('client_email', 'is', null);

			if (!clientStats) return;

			// Group by client email and count invoices
			const clientMap = new Map();
			clientStats.forEach((invoice) => {
				const key = invoice.client_email;
				if (!clientMap.has(key)) {
					clientMap.set(key, {
						email: invoice.client_email,
						name: invoice.client_name,
						invoices: [],
						totalAmount: 0
					});
				}
				const client = clientMap.get(key);
				client.invoices.push(invoice);
				client.totalAmount += parseFloat(invoice.amount);
			});

			// Check which clients qualify
			for (const [email, client] of clientMap) {
				if (client.invoices.length >= settings.auto_favorite_threshold) {
					// Check if already a favorite
					const { data: existing } = await supabase
						.from('favorite_clients')
						.select('id')
						.eq('freelancer_address', freelancerAddress.toLowerCase())
						.eq('client_email', email)
						.single();

					if (!existing) {
						// Add as favorite (we don't have client wallet address, so use email as identifier)
						await this.addFavoriteClient(
							freelancerAddress,
							email, // Using email as address placeholder
							email,
							client.name
						);
						console.log(`Auto-added ${email} as favorite client`);
					}
				}
			}
		} catch (error) {
			console.error('Error auto-adding favorite clients:', error);
		}
	}

	/**
	 * Get gas sponsorship statistics
	 */
	async getGasSponsorshipStats(freelancerAddress: string): Promise<GasSponsorshipStats> {
		try {
			const [program, favoriteClients, sponsoredTxs] = await Promise.all([
				this.getGasSponsorshipProgram(freelancerAddress),
				this.getFavoriteClients(freelancerAddress),
				this.getSponsoredTransactions(freelancerAddress, 10)
			]);

			if (!program) {
				throw new Error('No gas sponsorship program found');
			}

			// Calculate budget utilization
			const budgetUtilization =
				program.total_budget > 0
					? ((program.total_budget - program.remaining_budget) / program.total_budget) * 100
					: 0;

			// Get active sponsorships count
			const activeSponsorships = favoriteClients.filter(
				(client) => client.gas_sponsorship_enabled
			).length;

			// Calculate average sponsorship amount
			const averageSponsorship =
				program.sponsored_transactions_count > 0
					? program.total_sponsored_amount / program.sponsored_transactions_count
					: 0;

			// Get monthly spending (current month)
			const startOfMonth = new Date();
			startOfMonth.setDate(1);
			startOfMonth.setHours(0, 0, 0, 0);

			const { data: monthlyTxs } = await supabase
				.from('sponsored_transactions')
				.select('sponsored_amount')
				.eq('freelancer_address', freelancerAddress.toLowerCase())
				.gte('sponsored_at', startOfMonth.toISOString());

			const monthlySpending = monthlyTxs?.reduce((sum, tx) => sum + tx.sponsored_amount, 0) || 0;

			// Get top sponsored clients
			const topClients = favoriteClients
				.filter((client) => client.sponsored_transactions_count > 0)
				.sort((a, b) => b.total_sponsored_gas - a.total_sponsored_gas)
				.slice(0, 5)
				.map((client) => ({
					client_address: client.client_address,
					client_name: client.client_name,
					sponsored_count: client.sponsored_transactions_count,
					sponsored_amount: client.total_sponsored_gas
				}));

			return {
				total_budget: program.total_budget,
				remaining_budget: program.remaining_budget,
				budget_utilization_percent: budgetUtilization,
				total_sponsored_transactions: program.sponsored_transactions_count,
				total_sponsored_amount: program.total_sponsored_amount,
				favorite_clients_count: favoriteClients.length,
				active_sponsorships_count: activeSponsorships,
				average_sponsorship_amount: averageSponsorship,
				monthly_spending: monthlySpending,
				top_sponsored_clients: topClients,
				recent_sponsorships: sponsoredTxs
			};
		} catch (error) {
			console.error('Error getting gas sponsorship stats:', error);
			throw error;
		}
	}

	/**
	 * Get sponsored transactions history
	 */
	async getSponsoredTransactions(
		freelancerAddress: string,
		limit = 50,
		offset = 0
	): Promise<SponsoredTransaction[]> {
		try {
			const { data, error } = await supabase
				.from('sponsored_transactions')
				.select('*')
				.eq('freelancer_address', freelancerAddress.toLowerCase())
				.order('sponsored_at', { ascending: false })
				.range(offset, offset + limit - 1);

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error getting sponsored transactions:', error);
			return [];
		}
	}

	/**
	 * Top up gas sponsorship budget
	 */
	async topUpBudget(freelancerAddress: string, amount: number): Promise<boolean> {
		try {
			const program = await this.getGasSponsorshipProgram(freelancerAddress);
			if (!program) {
				throw new Error('No gas sponsorship program found');
			}

			// TODO: Implement actual payment processing here
			// For now, just update the database
			const { error } = await supabase
				.from('gas_sponsorship_programs')
				.update({
					total_budget: program.total_budget + amount,
					remaining_budget: program.remaining_budget + amount,
					updated_at: new Date().toISOString()
				})
				.eq('freelancer_address', freelancerAddress.toLowerCase());

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error topping up budget:', error);
			return false;
		}
	}

	/**
	 * Get gas sponsorship settings
	 */
	async getGasSponsorshipSettings(freelancerAddress: string): Promise<GasSponsorshipSettings> {
		try {
			const { data, error } = await supabase
				.from('gas_sponsorship_settings')
				.select('*')
				.eq('freelancer_address', freelancerAddress.toLowerCase())
				.single();

			if (error && error.code !== 'PGRST116') throw error;

			if (data) {
				return data;
			} else {
				// Return default settings if none exist
				return {
					...DEFAULT_GAS_SPONSORSHIP_SETTINGS,
					freelancer_address: freelancerAddress.toLowerCase()
				};
			}
		} catch (error) {
			console.error('Error getting gas sponsorship settings:', error);
			return {
				...DEFAULT_GAS_SPONSORSHIP_SETTINGS,
				freelancer_address: freelancerAddress.toLowerCase()
			};
		}
	}

	/**
	 * Update gas sponsorship settings
	 */
	async updateGasSponsorshipSettings(
		freelancerAddress: string,
		settings: Partial<GasSponsorshipSettings>
	): Promise<void> {
		try {
			const { error } = await supabase.from('gas_sponsorship_settings').upsert(
				{
					freelancer_address: freelancerAddress.toLowerCase(),
					...settings,
					updated_at: new Date().toISOString()
				},
				{
					onConflict: 'freelancer_address'
				}
			);

			if (error) throw error;
		} catch (error) {
			console.error('Error updating gas sponsorship settings:', error);
			throw error;
		}
	}
}
