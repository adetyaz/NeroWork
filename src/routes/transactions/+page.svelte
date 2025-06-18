<script lang="ts">
// Demo UI for NeroInvoice smart contract

import { getSigner, executeOperation } from '../../lib/utils/aaUtils';
import { API_KEY, NERO_CHAIN_CONFIG } from '../../lib/config';

// Hardcode the ABI inline to avoid import errors
const NeroInvoiceABI = [
  "function createInvoice(address client, string clientEmail, string title, string description, uint256 amount) external"
];

const BadgeNFTABI = [
  "function mintBadge(address to, string name, string description, string imageUrl) external returns (uint256)"
];

let contractAddress = '0x6da24cb091a69bc3026b233dbdd146ceb3b72727'; // NeroInvoice contract address
let badgeContractAddress = '0x69f87d3d588c049ace05975212c6ed272e5c1fa9'; // BadgeNFT contract address
let loading = false;
let txHash = '';
let status = '';

// Milestone options
const milestones = [
  { name: 'First Invoice', description: 'Awarded for minting your first invoice', imageUrl: 'https://example.com/first.png' },
  { name: '10 Invoices', description: 'Awarded for minting 10 invoices', imageUrl: 'https://example.com/10.png' },
  { name: '25 Invoices', description: 'Awarded for minting 25 invoices', imageUrl: 'https://example.com/25.png' },
  { name: '50 Invoices', description: 'Awarded for minting 50 invoices', imageUrl: 'https://example.com/50.png' },
  { name: '100 Invoices', description: 'Awarded for minting 100 invoices', imageUrl: 'https://example.com/100.png' }
];

let selectedMilestone = milestones[0];
let imageUrl = selectedMilestone.imageUrl;

function handleMilestoneChange(event: Event) {
  const idx = +(event.target as HTMLSelectElement).value;
  selectedMilestone = milestones[idx];
  imageUrl = selectedMilestone.imageUrl;
}

// Integrate ethers/web3 logic: import ABI and aaUtils, implement createInvoiceDemo to call createInvoice on the contract using executeOperation, update status and txHash accordingly.
async function mintInvoice() {
  status = '';
  txHash = '';
  loading = true;
  try {
    const signer = await getSigner();
    // Use zero address and empty fields for minimal mint
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const result = await executeOperation(
      signer,
      contractAddress,
      NeroInvoiceABI as any,
      'createInvoice',
      [zeroAddress, '', '', '', 0],
      0,
      '',
      { apiKey: API_KEY }
    );
    txHash = result.transactionHash;
    status = 'Invoice minted successfully!';
  } catch (error) {
    status = 'Failed to mint invoice: ' + ( error);
  } finally {
    loading = false;
  }
}

async function mintBadge() {
  status = '';
  txHash = '';
  loading = true;
  try {
    const signer = await getSigner();
    const result = await executeOperation(
      signer,
      badgeContractAddress,
      BadgeNFTABI as any,
      'mintBadge',
      [await signer.getAddress(), selectedMilestone.name, selectedMilestone.description, imageUrl],
      0,
      '',
      { apiKey: API_KEY }
    );
    txHash = result.transactionHash;
    status = 'Badge minted successfully!';
  } catch (error) {
    status = 'Failed to mint badge: ' + (error?.message || error);
  } finally {
    loading = false;
  }
}
</script>

<div class="max-w-xl mx-auto p-8 bg-white rounded shadow mt-10">
  <h1 class="text-2xl font-bold mb-4">Mint Invoice NFT</h1>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Contract Address</label>
    <input class="w-full border rounded px-3 py-2" bind:value={contractAddress} placeholder="Paste deployed contract address here" />
  </div>
  <button class="bg-blue-600 text-white px-4 py-2 rounded" on:click={mintInvoice} disabled={loading}>
    {#if loading}Minting...{:else}Mint Invoice NFT{/if}
  </button>
  {#if status}
    <div class="mt-4 text-blue-700">{status}</div>
  {/if}
  {#if txHash}
    <div class="mt-2 text-green-700">
      Tx Hash: <a href={`${NERO_CHAIN_CONFIG.explorer}/tx/${txHash}`} target="_blank" rel="noopener">{txHash}</a>
    </div>
  {/if}

  <h1 class="text-2xl font-bold mb-4 mt-10">Mint Badge NFT</h1>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Contract Address</label>
    <input class="w-full border rounded px-3 py-2" bind:value={badgeContractAddress} placeholder="Paste deployed BadgeNFT contract address here" />
  </div>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Milestone</label>
    <select class="w-full border rounded px-3 py-2" on:change={handleMilestoneChange}>
      {#each milestones as milestone, idx}
        <option value={idx}>{milestone.name}</option>
      {/each}
    </select>
  </div>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Description</label>
    <input class="w-full border rounded px-3 py-2" value={selectedMilestone.description} readonly />
  </div>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Image URL</label>
    <input class="w-full border rounded px-3 py-2" bind:value={imageUrl} />
  </div>
  <button class="bg-blue-600 text-white px-4 py-2 rounded" on:click={mintBadge} disabled={loading}>
    {#if loading}Minting...{:else}Mint Badge NFT{/if}
  </button>
  {#if status}
    <div class="mt-4 text-blue-700">{status}</div>
  {/if}
  {#if txHash}
    <div class="mt-2 text-green-700">
      Tx Hash: <a href={`${NERO_CHAIN_CONFIG.explorer}/tx/${txHash}`} target="_blank" rel="noopener">{txHash}</a>
    </div>
  {/if}
</div>
