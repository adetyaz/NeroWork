<script lang="ts">
// Milestone definitions using static images
const milestones = [
  { count: 1, name: 'First Invoice', description: 'Awarded for your first paid invoice', imageUrl: '/first-invoice.png.png' },
  { count: 5, name: '5 Invoices', description: 'Awarded for 5 paid invoices', imageUrl: '/five-invoices.png.png' },
  { count: 10, name: '10 Invoices', description: 'Awarded for 10 paid invoices', imageUrl: '/ten-invoices.png.jpg' },
  { count: 25, name: '25 Invoices', description: 'Awarded for 25 paid invoices', imageUrl: '/twentyfive-invoices.png.jpg' },
  { count: 50, name: '50 Invoices', description: 'Awarded for 50 paid invoices', imageUrl: '/fifty-invoices.png.jpg' },
  { count: 100, name: '100 Invoices', description: 'Awarded for 100 paid invoices', imageUrl: '/hundred-invoices.png.jpg' }
];

import { executeOperation, getSigner } from '$lib/utils/aaUtils';
import { API_KEY } from '$lib/config';
import { addNotification } from '$lib/utils/notifications';
import { supabase } from '$lib/utils/supabaseClient.js';

let invoices: any[] = $state([]);
let paidCount: number = $state(0);
let freelancerWallet: string = $state('');
let earnedBadges: string[] = $state([]);
let mintableBadge: any = $state(null);
let mintStatus: string = $state('');

// Inline BadgeNFT ABI
const BadgeNFTABI = [
  "function mintBadge(address to, string name, string description, string imageUrl) external returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function getBadgeInfo(uint256 tokenId) external view returns (string name, string description, string imageUrl)"
];

async function loadBadgesAndInvoices() {
  const signer = await getSigner();
  freelancerWallet = await signer.getAddress();
  // Load invoices for this user
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_address', freelancerWallet);
  invoices = data && Array.isArray(data) ? data : [];
  paidCount = invoices.filter(inv => inv.status === 'paid').length;
  // Check which badges are minted
  earnedBadges = milestones.filter(m => localStorage.getItem(`${freelancerWallet}-badge-${m.name}`) === 'minted').map(m => m.name);
  // Find the highest milestone reached but not minted
  mintableBadge = null;
  for (const m of milestones) {
    if (paidCount >= m.count && !earnedBadges.includes(m.name)) {
      mintableBadge = m;
      break;
    }
  }
}

$effect(() => { loadBadgesAndInvoices(); });

async function mintBadge() {
  if (!mintableBadge) return;
  mintStatus = 'Minting...';
  try {
    const signer = await getSigner();
    await executeOperation(
      signer,
      '0x69f87d3d588c049ace05975212c6ed272e5c1fa9',
      BadgeNFTABI,
      'mintBadge',
      [await signer.getAddress(), mintableBadge.name, mintableBadge.description, mintableBadge.imageUrl],
      0,
      '',
      { apiKey: API_KEY }
    );
    localStorage.setItem(`${freelancerWallet}-badge-${mintableBadge.name}`, 'minted');
    addNotification({
      userWallet: freelancerWallet,
      type: 'badge',
      message: `You earned the '${mintableBadge.name}' badge!`,
    });
    mintStatus = 'Badge minted!';
    await loadBadgesAndInvoices();
  } catch (e) {
    mintStatus = 'Mint failed.';
  }
}
</script>

<div class="max-w-2xl mx-auto p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Your Badges</h1>
  {#if mintableBadge}
    <div class="my-4 p-4 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-4">
      <div>
        <strong>Milestone reached:</strong> {mintableBadge.name} <br />
        <span class="text-gray-600 text-sm">{mintableBadge.description}</span>
      </div>
      <button class="ml-auto bg-blue-600 text-white px-4 py-2 rounded shadow" onclick={mintBadge} disabled={mintStatus === 'Minting...'}>
        {mintStatus === 'Minting...' ? 'Minting...' : 'Mint Badge NFT'}
      </button>
      {#if mintStatus && mintStatus !== 'Minting...'}
        <span class="ml-2 text-green-700">{mintStatus}</span>
      {/if}
    </div>
  {/if}
  <ul>
    {#each milestones as badge}
      <li class="mb-3 p-3 border rounded bg-gray-50 flex items-center gap-4">
        <img src={badge.imageUrl} alt={badge.name} class="w-10 h-10 rounded" />
        <div>
          <div class="font-semibold">{badge.name}</div>
          <div class="text-gray-600 text-sm">{badge.description}</div>
        </div>
        {#if earnedBadges.includes(badge.name)}
          <span class="ml-auto px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Earned</span>
        {:else}
          <span class="ml-auto px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">Locked</span>
        {/if}
      </li>
    {/each}
  </ul>
</div>
