export interface GasSponsorshipProgram {
	id: string;
	freelancer_address: string;
	total_budget: number;
	remaining_budget: number;
	budget_token: string;
	is_active: boolean;
	max_sponsorship_per_tx: number;
	sponsored_transactions_count: number;
	total_sponsored_amount: number;
	created_at: string;
	updated_at: string;
}

export interface FavoriteClient {
	id: string;
	freelancer_address: string;
	client_address: string;
	client_email?: string;
	client_name?: string;
	is_favorite: boolean;
	total_invoices: number;
	total_paid_amount: number;
	first_invoice_date: string;
	last_activity_date: string;
	gas_sponsorship_enabled: boolean;
	max_gas_per_transaction: number;
	sponsored_transactions_count: number;
	total_sponsored_gas: number;
	notes?: string;
	created_at: string;
	updated_at: string;
}

export interface SponsoredTransaction {
	id: string;
	freelancer_address: string;
	client_address: string;
	transaction_hash: string;
	original_gas_fee: number;
	sponsored_amount: number;
	gas_token: string;
	invoice_id?: string;
	transaction_type: 'invoice_payment' | 'other';
	status: 'pending' | 'completed' | 'failed';
	sponsored_at: string;
	created_at: string;
}

export interface GasSponsorshipSettings {
	freelancer_address: string;
	auto_add_favorites: boolean; // Auto-add clients after X invoices
	auto_favorite_threshold: number; // Number of invoices to auto-add as favorite
	default_max_gas_per_tx: number; // Default max gas per transaction for new favorites
	budget_alert_threshold: number; // Alert when remaining budget is below this %
	monthly_budget_limit: number; // Optional monthly spending limit
	allowed_transaction_types: string[]; // Types of transactions to sponsor
	email_notifications: boolean; // Send email when gas is sponsored
}

export interface GasSponsorshipStats {
	total_budget: number;
	remaining_budget: number;
	budget_utilization_percent: number;
	total_sponsored_transactions: number;
	total_sponsored_amount: number;
	favorite_clients_count: number;
	active_sponsorships_count: number;
	average_sponsorship_amount: number;
	monthly_spending: number;
	top_sponsored_clients: Array<{
		client_address: string;
		client_name?: string;
		sponsored_count: number;
		sponsored_amount: number;
	}>;
	recent_sponsorships: SponsoredTransaction[];
}

export interface ClientSponsorshipInfo {
	is_favorite: boolean;
	gas_sponsorship_enabled: boolean;
	max_gas_per_transaction: number;
	sponsored_transactions_count: number;
	total_sponsored_gas: number;
	client_stats: {
		total_invoices: number;
		total_paid_amount: number;
		relationship_duration_days: number;
		last_activity_date: string;
	};
}

// Default gas sponsorship settings
export const DEFAULT_GAS_SPONSORSHIP_SETTINGS: GasSponsorshipSettings = {
	freelancer_address: '',
	auto_add_favorites: true,
	auto_favorite_threshold: 3, // After 3 paid invoices
	default_max_gas_per_tx: 0.01, // 0.01 NERO per transaction
	budget_alert_threshold: 20, // Alert when 20% budget remaining
	monthly_budget_limit: 10, // 10 NERO per month
	allowed_transaction_types: ['invoice_payment'],
	email_notifications: true
};

// Gas sponsorship configuration
export const GAS_SPONSORSHIP_CONFIG = {
	MIN_BUDGET: 1, // Minimum 1 NERO budget
	MAX_BUDGET: 1000, // Maximum 1000 NERO budget
	MIN_GAS_PER_TX: 0.001, // Minimum 0.001 NERO per transaction
	MAX_GAS_PER_TX: 0.1, // Maximum 0.1 NERO per transaction
	SUPPORTED_TOKENS: ['NERO'], // Only NERO for now
	BUDGET_TOP_UP_AMOUNTS: [5, 10, 25, 50, 100] // Quick top-up amounts
};
