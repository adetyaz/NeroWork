export interface ReferralProgram {
	id: string;
	referrer_address: string;
	referral_code: string;
	total_referrals: number;
	total_rewards_earned: number;
	rewards_claimed: number;
	rewards_pending: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface Referral {
	id: string;
	referrer_address: string;
	referee_address: string;
	referral_code: string;
	status: 'pending' | 'completed' | 'rewarded';
	reward_amount: number;
	reward_token: string;
	completion_date?: string;
	reward_date?: string;
	created_at: string;
}

export interface ReferralReward {
	id: string;
	referrer_address: string;
	referral_id: string;
	amount: number;
	token: string;
	status: 'pending' | 'claimed' | 'failed';
	transaction_hash?: string;
	claimed_at?: string;
	created_at: string;
}

export interface ReferralTier {
	level: number;
	name: string;
	min_referrals: number;
	reward_multiplier: number;
	bonus_reward: number;
	benefits: string[];
}

export interface ReferralStats {
	total_referrals: number;
	successful_referrals: number;
	pending_referrals: number;
	total_rewards_earned: number;
	total_rewards_claimed: number;
	current_tier: ReferralTier;
	next_tier?: ReferralTier;
	referrals_to_next_tier: number;
}

export interface ReferralConfig {
	base_reward: number;
	reward_token: string;
	min_activity_threshold: number; // Minimum invoice amount for referral to count
	reward_delay_days: number; // Days to wait before reward is claimable
	tiers: ReferralTier[];
}

// Default referral configuration
export const DEFAULT_REFERRAL_CONFIG: ReferralConfig = {
	base_reward: 50, // 50 NERO tokens
	reward_token: 'NERO',
	min_activity_threshold: 100, // $100 worth of invoices
	reward_delay_days: 7, // 1 week delay
	tiers: [
		{
			level: 1,
			name: 'Bronze Referrer',
			min_referrals: 0,
			reward_multiplier: 1.0,
			bonus_reward: 0,
			benefits: ['Basic referral rewards', 'Referral tracking']
		},
		{
			level: 2,
			name: 'Silver Referrer',
			min_referrals: 5,
			reward_multiplier: 1.2,
			bonus_reward: 100,
			benefits: ['20% bonus on referral rewards', '100 NERO bonus', 'Priority support']
		},
		{
			level: 3,
			name: 'Gold Referrer',
			min_referrals: 15,
			reward_multiplier: 1.5,
			bonus_reward: 300,
			benefits: ['50% bonus on referral rewards', '300 NERO bonus', 'Exclusive features access']
		},
		{
			level: 4,
			name: 'Platinum Referrer',
			min_referrals: 30,
			reward_multiplier: 2.0,
			bonus_reward: 500,
			benefits: ['100% bonus on referral rewards', '500 NERO bonus', 'Custom branding options']
		}
	]
};
