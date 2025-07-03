import { ethers } from 'ethers';
import type { PaymentOption } from '$lib/types/tokens';
import { supabase } from '$lib/utils/supabaseClient';
import { addNotification } from '$lib/utils/notifications';
import { getSigner } from '$lib/utils/aaUtils';
import { GasSponsorshipService } from './gasSponsorshipService';
import { ReferralService } from './referralService';
import { API_KEY } from '$lib/config';

export interface PaymentRequest {
	invoice: {
		id: string;
		user_address: string;
		amount: number;
		project_name: string;
		preferred_token?: string;
		client_email?: string; // Add client email for favorite check
	};
	selectedToken: PaymentOption;
	platformWallet: string;
	clientEmail?: string; // Client email from the transaction
}

export interface PaymentResult {
	success: boolean;
	transactionHash?: string;
	errorMessage?: string;
	gasSponsorshipUsed?: boolean;
	feeWaived?: boolean; // New field to indicate if fee was waived for favorite client
}

export class InvoicePaymentService {
	private static instance: InvoicePaymentService;
	private gasSponsorshipService = GasSponsorshipService.getInstance();
	private referralService = ReferralService.getInstance();

	static getInstance(): InvoicePaymentService {
		if (!InvoicePaymentService.instance) {
			InvoicePaymentService.instance = new InvoicePaymentService();
		}
		return InvoicePaymentService.instance;
	}

	/**
	 * Execute payment for an invoice
	 */
	async executePayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
		const { invoice, selectedToken, platformWallet, clientEmail } = paymentRequest;

		try {
			const signer = await getSigner();
			const clientAddress = await signer.getAddress();

			// Import token utilities
			const { checkSufficientBalance, checkAndApproveToken, ERC20_ABI } = await import(
				'$lib/utils/tokenUtils'
			);

			const isFavoriteClient = await this.checkIfFavoriteClient(
				invoice.user_address,
				clientEmail || invoice.client_email
			);
			const feeWaived = isFavoriteClient;

			console.log(`Fee waiver status: ${feeWaived ? 'WAIVED' : 'NOT WAIVED'}`);

			// 1. Check sufficient balance (adjust for potential fee waiver)
			const invoiceAmount = invoice.amount;
			const platformFee = feeWaived ? 0 : 0.2;
			const totalRequired = invoiceAmount + platformFee;

			const balanceCheck = await checkSufficientBalance(
				signer,
				selectedToken,
				totalRequired.toString()
			);
			if (!balanceCheck.sufficient) {
				return {
					success: false,
					errorMessage: `Insufficient ${selectedToken.symbol} balance. You have ${balanceCheck.balance}, but need ${totalRequired}`
				};
			}

			// 2. Check gas sponsorship eligibility
			const useGasSponsorship = await this.checkGasSponsorshipEligibility(
				invoice.user_address,
				clientAddress
			);

			let transactionHash = '';

			if (selectedToken.isNative) {
				transactionHash = await this.executeNativePayment(
					signer,
					invoice,
					platformWallet,
					useGasSponsorship,
					feeWaived
				);
			} else {
				transactionHash = await this.executeTokenPayment(
					signer,
					selectedToken,
					invoice,
					platformWallet,
					useGasSponsorship,
					ERC20_ABI,
					checkAndApproveToken,
					feeWaived
				);
			}

			// 3. Update database
			await this.updateInvoiceStatus(
				invoice.id,
				transactionHash,
				selectedToken,
				useGasSponsorship,
				feeWaived
			);

			// 4. Record gas sponsorship if used
			if (useGasSponsorship) {
				await this.recordGasSponsorship(invoice, clientAddress, transactionHash);
			}

			// 5. Check referrals
			await this.processReferrals(invoice.user_address);

			// 6. Send notification
			await this.sendPaymentNotification(invoice, selectedToken, feeWaived);

			return {
				success: true,
				transactionHash,
				gasSponsorshipUsed: useGasSponsorship,
				feeWaived
			};
		} catch (error) {
			console.error('Payment execution error:', error);
			return {
				success: false,
				errorMessage: error instanceof Error ? error.message : 'Payment failed'
			};
		}
	}

	/**
	 * Check gas sponsorship eligibility
	 */
	private async checkGasSponsorshipEligibility(
		freelancerAddress: string,
		clientAddress: string
	): Promise<boolean> {
		try {
			const eligibility = await this.gasSponsorshipService.checkGasSponsorshipEligibility(
				freelancerAddress,
				clientAddress
			);
			return eligibility?.gas_sponsorship_enabled || false;
		} catch (error) {
			console.log('Note: Could not check gas sponsorship eligibility:', error);
			return false;
		}
	}

	/**
	 * Check if client email is in freelancer's favorite client list
	 */
	private async checkIfFavoriteClient(
		freelancerAddress: string,
		clientEmail?: string
	): Promise<boolean> {
		if (!clientEmail) return false;

		try {
			console.log(`Checking if ${clientEmail} is a favorite client of ${freelancerAddress}`);

			const normalizedEmail = clientEmail.toLowerCase().trim();
			const normalizedFreelancerAddress = freelancerAddress.toLowerCase();

			const { data, error } = await supabase
				.from('favorite_clients')
				.select('*')
				.eq('freelancer_address', normalizedFreelancerAddress)
				.eq('client_email', normalizedEmail);

			if (error) {
				console.error('Error checking favorite client:', error);
				return false;
			}

			// Log the result for debugging
			if (data && data.length > 0) {
				console.log('Found favorite client match:', data[0]);
				return true;
			} else {
				console.log('No favorite client match found');
				// Try a case-insensitive search as fallback
				const { data: fuzzyData } = await supabase
					.from('favorite_clients')
					.select('*')
					.eq('freelancer_address', normalizedFreelancerAddress)
					.ilike('client_email', `%${normalizedEmail}%`);

				if (fuzzyData && fuzzyData.length > 0) {
					console.log('Found fuzzy match:', fuzzyData[0]);
					return true;
				}
				return false;
			}
		} catch (error) {
			console.error('Error checking favorite client:', error);
			return false;
		}
	}

	/**
	 * Execute native token (NERO) payment
	 */
	private async executeNativePayment(
		signer: ethers.Signer,
		invoice: any,
		platformWallet: string,
		useGasSponsorship: boolean,
		feeWaived: boolean
	): Promise<string> {
		const amountNero = ethers.utils.parseEther(invoice.amount.toString());
		const feeNero = feeWaived ? ethers.utils.parseEther('0') : ethers.utils.parseEther('0.2');

		if (useGasSponsorship) {
			try {
				// Use Account Abstraction with sponsored gas
				const userOp = await signer.sendTransaction({
					to: invoice.user_address,
					value: amountNero
				});

				const receipt = await userOp.wait();
				console.log('✅ Sponsored transaction completed:', receipt.transactionHash);

				// Send platform fee separately if not waived
				if (!feeWaived && feeNero.gt(0)) {
					const tx2 = await signer.sendTransaction({
						to: platformWallet,
						value: feeNero
					});
					await tx2.wait();
				} else if (feeWaived) {
					console.log('✅ Platform fee waived for favorite client');
				}

				return receipt.transactionHash;
			} catch (sponsorError) {
				console.warn(
					'Sponsored transaction failed, falling back to regular payment:',
					sponsorError
				);
				// Fall through to regular payment
			}
		}

		// Regular payment (client pays gas)
		const tx1 = await signer.sendTransaction({
			to: invoice.user_address,
			value: amountNero
		});
		const receipt1 = await tx1.wait();

		// Send platform fee if not waived
		if (!feeWaived && feeNero.gt(0)) {
			const tx2 = await signer.sendTransaction({
				to: platformWallet,
				value: feeNero
			});
			await tx2.wait();
		} else if (feeWaived) {
			console.log('✅ Platform fee waived for favorite client');
		}

		return receipt1.transactionHash;
	}

	/**
	 * Execute ERC-20 token payment
	 */
	private async executeTokenPayment(
		signer: ethers.Signer,
		selectedToken: PaymentOption,
		invoice: any,
		platformWallet: string,
		useGasSponsorship: boolean,
		ERC20_ABI: any[],
		checkAndApproveToken: (
			signer: ethers.Signer,
			token: PaymentOption,
			spenderAddress: string,
			amount: string
		) => Promise<boolean>,
		feeWaived: boolean
	): Promise<string> {
		if (!selectedToken.contractAddress) {
			throw new Error(`Missing contract address for ${selectedToken.symbol}`);
		}

		const tokenContract = new ethers.Contract(selectedToken.contractAddress, ERC20_ABI, signer);

		// Get token decimals
		const decimals = await tokenContract.decimals();
		const amount = ethers.utils.parseUnits(invoice.amount.toString(), decimals);
		const fee = feeWaived
			? ethers.utils.parseUnits('0', decimals)
			: ethers.utils.parseUnits('0.2', decimals);

		// Check and approve token spending if needed (adjust for potential fee waiver)
		const totalNeeded = feeWaived ? amount : amount.add(fee);
		const totalAmount = ethers.utils.formatUnits(totalNeeded, decimals);
		await checkAndApproveToken(signer, selectedToken, await signer.getAddress(), totalAmount);

		if (useGasSponsorship) {
			try {
				// Use Account Abstraction with sponsored gas for ERC-20 transfers
				const { executeSponsoredOperation } = await import('$lib/utils/aaUtils');

				const result = await executeSponsoredOperation(
					signer,
					selectedToken.contractAddress,
					ERC20_ABI,
					'transfer',
					[invoice.user_address, amount],
					{ apiKey: API_KEY }
				);

				console.log('✅ Sponsored ERC-20 transaction completed:', result.transactionHash);

				// Send platform fee if not waived
				if (!feeWaived && fee.gt(0)) {
					await tokenContract.transfer(platformWallet, fee);
				} else if (feeWaived) {
					console.log('✅ Platform fee waived for favorite client');
				}

				return result.transactionHash;
			} catch (sponsorError) {
				console.warn(
					'Sponsored ERC-20 transaction failed, falling back to regular payment:',
					sponsorError
				);
				// Fall through to regular payment
			}
		}

		// Regular ERC-20 payment (client pays gas)
		const tx1 = await tokenContract.transfer(invoice.user_address, amount);
		const receipt1 = await tx1.wait();

		// Send platform fee if not waived
		if (!feeWaived && fee.gt(0)) {
			const tx2 = await tokenContract.transfer(platformWallet, fee);
			await tx2.wait();
		} else if (feeWaived) {
			console.log('✅ Platform fee waived for favorite client');
		}

		return receipt1.transactionHash;
	}

	/**
	 * Update invoice status in database
	 */
	private async updateInvoiceStatus(
		invoiceId: string,
		transactionHash: string,
		selectedToken: PaymentOption,
		gasSponsorshipUsed: boolean,
		feeWaived: boolean
	): Promise<void> {
		// Handle ID type properly for the update query
		let updateQuery;
		const numericId = parseInt(invoiceId);
		if (!isNaN(numericId) && numericId.toString() === invoiceId.toString()) {
			console.log('Using numeric ID for invoice status update:', numericId);
			updateQuery = supabase
				.from('invoices')
				.update({
					status: 'paid',
					chain_tx_hash: transactionHash
				})
				.eq('id', numericId);
		} else {
			updateQuery = supabase
				.from('invoices')
				.update({
					status: 'paid',
					chain_tx_hash: transactionHash
				})
				.eq('id', invoiceId);
		}

		const { data, error } = await updateQuery;

		if (error) {
			console.error('Failed to update invoice status:', error);
			throw new Error(`Failed to update invoice status: ${error.message}`);
		} else {
			console.log('Invoice status updated successfully:', data);
		}
	}

	/**
	 * Record gas sponsorship in database
	 */
	private async recordGasSponsorship(
		invoice: any,
		clientAddress: string,
		transactionHash: string
	): Promise<void> {
		try {
			// Estimate gas fee that was sponsored (approximate)
			const estimatedGasFee = 0.001; // Rough estimate in NERO

			const gasSponsored = await this.gasSponsorshipService.sponsorGas(
				invoice.user_address, // freelancer (sponsor)
				clientAddress, // client (being sponsored)
				transactionHash,
				estimatedGasFee,
				invoice.id
			);

			if (gasSponsored) {
				console.log('✅ Gas sponsorship recorded in database');
			}
		} catch (gasSponsorshipError) {
			console.log('Note: Gas sponsorship database recording failed:', gasSponsorshipError);
			// Don't fail the payment for gas sponsorship issues
		}
	}

	/**
	 * Process referrals for the freelancer
	 */
	private async processReferrals(freelancerAddress: string): Promise<void> {
		try {
			await this.referralService.checkAndCompleteReferrals(freelancerAddress);
		} catch (referralError) {
			console.log('Note: Referral check failed:', referralError);
			// Don't fail the payment for referral issues
		}
	}

	/**
	 * Send payment notification to freelancer
	 */
	private async sendPaymentNotification(
		invoice: any,
		selectedToken: PaymentOption,
		feeWaived: boolean
	): Promise<void> {
		try {
			await addNotification({
				userWallet: invoice.user_address,
				type: 'invoice_paid',
				message:
					`Invoice "${invoice.project_name}" was paid with ${selectedToken.symbol} by client.` +
					(feeWaived ? ' (Fee waived for favorite client)' : '')
			});
			console.log('Payment notification sent to freelancer:', invoice.user_address);
		} catch (error) {
			console.error('Failed to send payment notification:', error);
			// Don't fail the entire payment for notification issues
		}
	}
}
