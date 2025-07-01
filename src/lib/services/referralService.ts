import { supabase } from '../utils/supabaseClient.js';
import type {
	ReferralProgram,
	Referral,
	ReferralReward,
	ReferralStats,
	ReferralTier,
	ReferralConfig
} from '../types/referrals.js';
import { DEFAULT_REFERRAL_CONFIG } from '../types/referrals.js';

export class ReferralService {
	private static instance: ReferralService;
	private config: ReferralConfig = DEFAULT_REFERRAL_CONFIG;

	static getInstance(): ReferralService {
		if (!ReferralService.instance) {
			ReferralService.instance = new ReferralService();
		}
		return ReferralService.instance;
	}

	/**
	 * Generate a unique referral code for a user
	 */
	generateReferralCode(userAddress: string): string {
		const timestamp = Date.now().toString(36);
		const addressHash = userAddress.slice(-6);
		return `NERO${addressHash.toUpperCase()}${timestamp}`.slice(0, 12);
	}

	/**
	 * Initialize referral program for a new user
	 */
	async initializeReferralProgram(userAddress: string): Promise<ReferralProgram> {
		try {
			const referralCode = this.generateReferralCode(userAddress);

			const { data, error } = await supabase
				.from('referral_programs')
				.insert({
					referrer_address: userAddress,
					referral_code: referralCode,
					total_referrals: 0,
					total_rewards_earned: 0,
					rewards_claimed: 0,
					rewards_pending: 0,
					is_active: true
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error initializing referral program:', error);
			throw error;
		}
	}

	/**
	 * Get referral program for a user
	 */
	async getReferralProgram(userAddress: string): Promise<ReferralProgram | null> {
		try {
			const { data, error } = await supabase
				.from('referral_programs')
				.select('*')
				.eq('referrer_address', userAddress)
				.single();

			if (error && error.code !== 'PGRST116') throw error;
			return data;
		} catch (error) {
			console.error('Error getting referral program:', error);
			return null;
		}
	}

	/**
	 * Get referral program by referral code
	 */
	async getReferralProgramByCode(referralCode: string): Promise<ReferralProgram | null> {
		try {
			const { data, error } = await supabase
				.from('referral_programs')
				.select('*')
				.eq('referral_code', referralCode.toUpperCase())
				.eq('is_active', true)
				.single();

			if (error && error.code !== 'PGRST116') throw error;
			return data;
		} catch (error) {
			console.error('Error getting referral program by code:', error);
			return null;
		}
	}

	/**
	 * Get or create referral program for a user
	 */
	async getOrCreateReferralProgram(userAddress: string): Promise<ReferralProgram> {
		let program = await this.getReferralProgram(userAddress);

		if (!program) {
			program = await this.initializeReferralProgram(userAddress);
		}

		return program;
	}

	/**
	 * Process a new user signup with referral code
	 */
	async processReferralSignup(newUserAddress: string, referralCode: string): Promise<boolean> {
		try {
			// Find the referrer by code
			const { data: referrer, error: referrerError } = await supabase
				.from('referral_programs')
				.select('*')
				.eq('referral_code', referralCode.toUpperCase())
				.eq('is_active', true)
				.single();

			if (referrerError || !referrer) {
				console.log('Invalid referral code:', referralCode);
				return false;
			}

			// Check if user was already referred
			const { data: existingReferral } = await supabase
				.from('referrals')
				.select('id')
				.eq('referee_address', newUserAddress)
				.single();

			if (existingReferral) {
				console.log('User already referred:', newUserAddress);
				return false;
			}

			// Create referral record
			const { error: referralError } = await supabase.from('referrals').insert({
				referrer_address: referrer.referrer_address,
				referee_address: newUserAddress,
				referral_code: referralCode.toUpperCase(),
				status: 'pending',
				reward_amount: this.config.base_reward,
				reward_token: this.config.reward_token
			});

			if (referralError) throw referralError;

			// Update referrer's total count
			await this.updateReferralStats(referrer.referrer_address);

			console.log('✅ Referral processed successfully');
			return true;
		} catch (error) {
			console.error('Error processing referral signup:', error);
			return false;
		}
	}

	/**
	 * Check if referral should be completed (user met activity threshold)
	 */
	async checkAndCompleteReferrals(userAddress: string): Promise<void> {
		try {
			// Get pending referrals for this user
			const { data: pendingReferrals, error } = await supabase
				.from('referrals')
				.select('*')
				.eq('referee_address', userAddress)
				.eq('status', 'pending');

			if (error || !pendingReferrals?.length) return;

			// Check user's total invoice activity
			const { data: invoices } = await supabase
				.from('invoices')
				.select('amount')
				.eq('user_address', userAddress)
				.eq('status', 'paid');

			const totalActivity = invoices?.reduce((sum, inv) => sum + parseFloat(inv.amount), 0) || 0;

			if (totalActivity >= this.config.min_activity_threshold) {
				// Complete all pending referrals for this user
				for (const referral of pendingReferrals) {
					await this.completeReferral(referral.id);
				}
			}
		} catch (error) {
			console.error('Error checking referral completion:', error);
		}
	}

	/**
	 * Complete a referral and create reward
	 */
	async completeReferral(referralId: string): Promise<void> {
		try {
			const now = new Date().toISOString();

			// Update referral status
			const { data: referral, error: updateError } = await supabase
				.from('referrals')
				.update({
					status: 'completed',
					completion_date: now
				})
				.eq('id', referralId)
				.select()
				.single();

			if (updateError) throw updateError;

			// Get referrer's current tier for reward calculation
			const stats = await this.getReferralStats(referral.referrer_address);
			const finalReward = this.config.base_reward * stats.current_tier.reward_multiplier;

			// Create reward (claimable after delay)
			const claimableDate = new Date();
			claimableDate.setDate(claimableDate.getDate() + this.config.reward_delay_days);

			await supabase.from('referral_rewards').insert({
				referrer_address: referral.referrer_address,
				referral_id: referralId,
				amount: finalReward,
				token: this.config.reward_token,
				status: 'pending'
			});

			// Update referrer's stats
			await this.updateReferralStats(referral.referrer_address);

			console.log('✅ Referral completed and reward created');
		} catch (error) {
			console.error('Error completing referral:', error);
			throw error;
		}
	}

	/**
	 * Update referral statistics for a user
	 */
	async updateReferralStats(userAddress: string): Promise<void> {
		try {
			// Count total referrals
			const { count: totalReferrals } = await supabase
				.from('referrals')
				.select('*', { count: 'exact' })
				.eq('referrer_address', userAddress);

			// Sum total rewards earned
			const { data: rewards } = await supabase
				.from('referral_rewards')
				.select('amount, status')
				.eq('referrer_address', userAddress);

			const totalRewardsEarned = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;
			const rewardsClaimed =
				rewards?.filter((r) => r.status === 'claimed').reduce((sum, r) => sum + r.amount, 0) || 0;
			const rewardsPending = totalRewardsEarned - rewardsClaimed;

			// Update referral program
			await supabase
				.from('referral_programs')
				.update({
					total_referrals: totalReferrals || 0,
					total_rewards_earned: totalRewardsEarned,
					rewards_claimed: rewardsClaimed,
					rewards_pending: rewardsPending,
					updated_at: new Date().toISOString()
				})
				.eq('referrer_address', userAddress);
		} catch (error) {
			console.error('Error updating referral stats:', error);
		}
	}

	/**
	 * Get comprehensive referral statistics
	 */
	async getReferralStats(userAddress: string): Promise<ReferralStats> {
		try {
			const program = await this.getOrCreateReferralProgram(userAddress);

			// Get referrals breakdown
			const { data: referrals } = await supabase
				.from('referrals')
				.select('status')
				.eq('referrer_address', userAddress);

			const successfulReferrals = referrals?.filter((r) => r.status === 'completed').length || 0;
			const pendingReferrals = referrals?.filter((r) => r.status === 'pending').length || 0;

			// Determine current tier
			const currentTier = this.getCurrentTier(program.total_referrals);
			const nextTier = this.getNextTier(currentTier.level);
			const referralsToNextTier = nextTier ? nextTier.min_referrals - program.total_referrals : 0;

			return {
				total_referrals: program.total_referrals,
				successful_referrals: successfulReferrals,
				pending_referrals: pendingReferrals,
				total_rewards_earned: program.total_rewards_earned,
				total_rewards_claimed: program.rewards_claimed,
				current_tier: currentTier,
				next_tier: nextTier,
				referrals_to_next_tier: Math.max(0, referralsToNextTier)
			};
		} catch (error) {
			console.error('Error getting referral stats:', error);
			throw error;
		}
	}

	/**
	 * Get current tier based on referral count
	 */
	getCurrentTier(referralCount: number): ReferralTier {
		const sortedTiers = [...this.config.tiers].sort((a, b) => b.min_referrals - a.min_referrals);

		for (const tier of sortedTiers) {
			if (referralCount >= tier.min_referrals) {
				return tier;
			}
		}

		return this.config.tiers[0]; // Default to first tier
	}

	/**
	 * Get next tier
	 */
	getNextTier(currentLevel: number): ReferralTier | undefined {
		return this.config.tiers.find((tier) => tier.level === currentLevel + 1);
	}

	/**
	 * Get user's referrals with details
	 */
	async getUserReferrals(userAddress: string, limit = 50, offset = 0): Promise<Referral[]> {
		try {
			const { data, error } = await supabase
				.from('referrals')
				.select('*')
				.eq('referrer_address', userAddress)
				.order('created_at', { ascending: false })
				.range(offset, offset + limit - 1);

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error getting user referrals:', error);
			return [];
		}
	}

	/**
	 * Get claimable rewards for a user
	 */
	async getClaimableRewards(userAddress: string): Promise<ReferralReward[]> {
		try {
			const { data, error } = await supabase
				.from('referral_rewards')
				.select('*')
				.eq('referrer_address', userAddress)
				.eq('status', 'pending')
				.order('created_at', { ascending: false });

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error getting claimable rewards:', error);
			return [];
		}
	}

	/**
	 * Claim rewards (placeholder for blockchain transaction)
	 */
	async claimRewards(userAddress: string, rewardIds: string[]): Promise<boolean> {
		try {
			// TODO: Implement actual blockchain transaction to send rewards

			// For now, just mark as claimed
			const { error } = await supabase
				.from('referral_rewards')
				.update({
					status: 'claimed',
					claimed_at: new Date().toISOString(),
					transaction_hash: 'mock_tx_' + Date.now() // Mock transaction hash
				})
				.in('id', rewardIds)
				.eq('referrer_address', userAddress);

			if (error) throw error;

			// Update stats
			await this.updateReferralStats(userAddress);

			return true;
		} catch (error) {
			console.error('Error claiming rewards:', error);
			return false;
		}
	}

	/**
	 * Get referral link for sharing
	 */
	getReferralLink(referralCode: string): string {
		return `https://nerowork.netlify.app/signup?ref=${referralCode}`;
	}

	/**
	 * Validate referral code format
	 */
	isValidReferralCode(code: string): boolean {
		return /^NERO[A-Z0-9]{8}$/.test(code.toUpperCase());
	}
}
