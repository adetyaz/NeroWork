<script lang="ts">
// Demo UI for NeroInvoice smart contract

import { getSigner, executeOperation } from '../../lib/utils/aaUtils';
import { API_KEY, NERO_CHAIN_CONFIG } from '../../lib/config';
import NeroInvoiceABI from '../../../contracts/ABI/NeroInvoice.json';

let contractAddress = '0x6da24cb091a69bc3026b233dbdd146ceb3b72727';
let clientEmail = '';
let title = '';
let description = '';
let amount = '';
let loading = false;
let txHash = '';
let status = '';

// Integrate ethers/web3 logic: import ABI and aaUtils, implement createInvoiceDemo to call createInvoice on the contract using executeOperation, update status and txHash accordingly.
async function mintInvoice() {
  status = '';
  txHash = '';
  loading = true;
  try {
    if (!clientEmail || !title || !description || !amount || !contractAddress) {
      status = 'All fields are required.';
      return;
    }
    const signer = await getSigner();
    // Use msg.sender as freelancer, client address is set to zero address
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const result = await executeOperation(
      signer,
      contractAddress,
      NeroInvoiceABI as any,
      'createInvoice',
      [zeroAddress, clientEmail, title, description, amount],
      0,
      '',
      { apiKey: API_KEY }
    );
    txHash = result.transactionHash;
    status = 'Invoice minted successfully!';
  } catch (error) {
    status = 'Failed to mint invoice: ' + (error?.message || error);
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
  <div class="mb-4">
    <label class="block mb-1 font-medium">Client Email</label>
    <input class="w-full border rounded px-3 py-2" bind:value={clientEmail} placeholder="client@email.com" />
  </div>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Title</label>
    <input class="w-full border rounded px-3 py-2" bind:value={title} placeholder="Invoice Title" />
  </div>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Description</label>
    <input class="w-full border rounded px-3 py-2" bind:value={description} placeholder="Description" />
  </div>
  <div class="mb-4">
    <label class="block mb-1 font-medium">Amount (NERO, smallest unit)</label>
    <input class="w-full border rounded px-3 py-2" bind:value={amount} placeholder="1000000000000000000" />
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
</div>
