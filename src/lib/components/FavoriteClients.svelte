<script lang="ts">
	import { supabase } from '$lib/utils/supabaseClient';
	import { getSigner } from '$lib/utils/aaUtils';
	import { addNotification } from '$lib/utils/notifications';

	interface FavoriteClient {
		id: string;
		client_email: string;
		client_name?: string;
		added_at: string;
		notes?: string;
	}

	let favoriteClients = $state<FavoriteClient[]>([]);
	let isLoading = $state(false);
	let freelancerAddress = $state('');
	let showAddForm = $state(false);
	let newClientEmail = $state('');
	let newClientName = $state('');
	let newClientNotes = $state('');

	// Load favorite clients when component mounts
	$effect(() => {
		loadFavoriteClients();
	});

	async function loadFavoriteClients() {
		try {
			isLoading = true;
			const signer = await getSigner();
			freelancerAddress = await signer.getAddress();

			const { data, error } = await supabase
				.from('favorite_clients')
				.select('*')
				.eq('freelancer_address', freelancerAddress)
				.order('added_at', { ascending: false });

			if (error) {
				console.error('Error loading favorite clients:', error);
				return;
			}

			favoriteClients = data || [];
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading = false;
		}
	}

	async function addFavoriteClient() {
		if (!newClientEmail.trim()) {
			addNotification({
				type: 'error',
				message: 'Email is required',
				userWallet: freelancerAddress
			});
			return;
		}

		try {
			const { error } = await supabase.from('favorite_clients').insert({
				freelancer_address: freelancerAddress,
				client_email: newClientEmail.toLowerCase().trim(),
				client_name: newClientName.trim() || null,
				notes: newClientNotes.trim() || null
			});

			if (error) {
				if (error.code === '23505') {
					// Unique constraint violation
					addNotification({
						type: 'error',
						message: 'This client is already in your favorites list',
						userWallet: freelancerAddress
					});
				} else {
					throw error;
				}
				return;
			}

			addNotification({
				type: 'success',
				message: 'Client added to favorites! They will get free platform fees.',
				userWallet: freelancerAddress
			});

			// Reset form
			newClientEmail = '';
			newClientName = '';
			newClientNotes = '';
			showAddForm = false;

			// Reload list
			await loadFavoriteClients();
		} catch (error) {
			console.error('Error adding favorite client:', error);
			addNotification({
				type: 'error',
				message: 'Failed to add client to favorites',
				userWallet: freelancerAddress
			});
		}
	}

	async function removeFavoriteClient(clientId: string) {
		try {
			const { error } = await supabase
				.from('favorite_clients')
				.delete()
				.eq('id', clientId)
				.eq('freelancer_address', freelancerAddress);

			if (error) throw error;

			addNotification({
				type: 'success',
				message: 'Client removed from favorites',
				userWallet: freelancerAddress
			});

			await loadFavoriteClients();
		} catch (error) {
			console.error('Error removing favorite client:', error);
			addNotification({
				type: 'error',
				message: 'Failed to remove client from favorites',
				userWallet: freelancerAddress
			});
		}
	}
</script>

<div class="bg-white rounded-lg shadow p-6">
	<div class="flex justify-between items-center mb-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-900">Favorite Clients</h3>
			<p class="text-sm text-gray-600">
				Clients in this list don't pay the 0.2 token platform fee
			</p>
		</div>
		<button
			type="button"
			class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
			onclick={() => (showAddForm = !showAddForm)}
		>
			{showAddForm ? 'Cancel' : 'Add Client'}
		</button>
	</div>

	<!-- Add Client Form -->
	{#if showAddForm}
		<div class="bg-gray-50 rounded-lg p-4 mb-6">
			<h4 class="font-medium text-gray-900 mb-4">Add Favorite Client</h4>
			<div class="grid grid-cols-1 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">
						Client Email <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						bind:value={newClientEmail}
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="client@example.com"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
					<input
						type="text"
						bind:value={newClientName}
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Optional client name"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
					<textarea
						bind:value={newClientNotes}
						rows="2"
						class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Optional notes about this client"
					></textarea>
				</div>
				<div class="flex gap-3">
					<button
						type="button"
						onclick={addFavoriteClient}
						class="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700"
					>
						Add to Favorites
					</button>
					<button
						type="button"
						onclick={() => (showAddForm = false)}
						class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-400"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Favorite Clients List -->
	{#if isLoading}
		<div class="text-center py-8">
			<div class="text-gray-500">Loading favorite clients...</div>
		</div>
	{:else if favoriteClients.length === 0}
		<div class="text-center py-8">
			<div class="text-gray-500 mb-2">No favorite clients yet</div>
			<p class="text-sm text-gray-400">
				Add clients to give them free platform fees on their payments
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each favoriteClients as client}
				<div class="border border-gray-200 rounded-lg p-4">
					<div class="flex justify-between items-start">
						<div class="flex-1">
							<div class="flex items-center gap-2 mb-2">
								<h4 class="font-medium text-gray-900">
									{client.client_name || client.client_email}
								</h4>
								<span
									class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
								>
									Fee Waived
								</span>
							</div>
							<p class="text-sm text-gray-600">{client.client_email}</p>
							{#if client.notes}
								<p class="text-sm text-gray-500 mt-1">{client.notes}</p>
							{/if}
							<p class="text-xs text-gray-400 mt-2">
								Added on {new Date(client.added_at).toLocaleDateString()}
							</p>
						</div>
						<button
							type="button"
							onclick={() => removeFavoriteClient(client.id)}
							class="text-red-600 hover:text-red-800 text-sm font-medium"
						>
							Remove
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
