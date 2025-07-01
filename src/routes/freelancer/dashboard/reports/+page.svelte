<script lang="ts">
import { supabase } from '$lib/utils/supabaseClient.js';
import { getSigner } from '$lib/utils/aaUtils';
import { Calendar, DollarSign, FileText, TrendingUp } from '@lucide/svelte';

let invoices = $state<any[]>([]);
let loading = $state(true);
let stats = $state({
  totalInvoices: 0,
  totalEarned: 0,
  paidInvoices: 0,
  pendingInvoices: 0,
  rejectedInvoices: 0
});

$effect(() => {
  async function loadReports() {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      
      console.log('Loading reports for address:', address);
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_address', address)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      invoices = data || [];
      
      console.log(`Final result: Found ${invoices.length} invoices`);
      console.log('Reports page loaded invoices:', invoices.map(inv => ({
        id: inv.id,
        project: inv.project_name,
        status: inv.status,
        user_address: inv.user_address,
        chain_tx_hash: inv.chain_tx_hash,
        has_tx_hash: !!inv.chain_tx_hash
      })));
      
      // Calculate stats - use status field as primary source of truth
      stats.totalInvoices = invoices.length;
      stats.paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
      stats.pendingInvoices = invoices.filter(inv => inv.status === 'pending' || !inv.status).length;
      stats.rejectedInvoices = invoices.filter(inv => inv.status === 'rejected').length;
      stats.totalEarned = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      loading = false;
    }
  }
  
  loadReports();
});

function downloadCSV() {
  const headers = ['Invoice ID', 'Project Name', 'Amount (NERO)', 'Status', 'Created Date', 'Transaction Hash'];
  const csvContent = [
    headers.join(','),
    ...invoices.map(inv => [
      inv.id,
      `"${inv.project_name || 'Untitled'}"`,
      inv.amount,
      inv.status || 'pending',
      new Date(inv.created_at).toLocaleDateString(),
      inv.chain_tx_hash || 'N/A'
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nerowork-invoices-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

let chartCanvas: HTMLCanvasElement;

function getMonthlyData() {
  const monthlyStats: { [key: string]: { count: number; amount: number; paid: number } } = {};
  
  // Get last 12 months
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    monthlyStats[monthKey] = { count: 0, amount: 0, paid: 0 };
  }
  
  invoices.forEach(invoice => {
    const date = new Date(invoice.created_at);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (monthlyStats[monthKey]) {
      monthlyStats[monthKey].count++;
      if (invoice.status === 'paid') {
        monthlyStats[monthKey].amount += parseFloat(invoice.amount) || 0;
        monthlyStats[monthKey].paid++;
      }
    }
  });
  
  return monthlyStats;
}

function getMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
}

let chartData = $derived(() => {
  const monthlyData = getMonthlyData();
  const months = Object.keys(monthlyData).sort();
  
  if (months.length === 0) return { months: [], data: [] };
  
  const maxAmount = Math.max(...months.map(month => monthlyData[month].amount), 1);
  const maxCount = Math.max(...months.map(month => monthlyData[month].count), 1);
  
  return {
    months,
    data: months.map(month => ({
      month: getMonthName(month),
      count: monthlyData[month].count,
      amount: monthlyData[month].amount,
      paid: monthlyData[month].paid,
      countPercentage: (monthlyData[month].count / maxCount) * 100,
      amountPercentage: (monthlyData[month].amount / maxAmount) * 100
    }))
  };
});

let hoveredIndex = $state(-1);
</script>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
</style>

<div class="min-h-screen bg-gray-50 p-6">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 mb-1">Reports & Analytics</h1>
        <p class="text-gray-600">Track your invoice performance and earnings</p>
      </div>
      <button 
        onclick={downloadCSV}
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <FileText class="w-4 h-4" />
        Export CSV
      </button>
    </div>

    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    {:else}
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-gray-900">{stats.totalInvoices}</div>
              <div class="text-gray-600 text-sm">Total Invoices</div>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <FileText class="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-green-600">{stats.totalEarned.toFixed(2)}</div>
              <div class="text-gray-600 text-sm">Total Earned (NERO)</div>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <DollarSign class="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-green-600">{stats.paidInvoices}</div>
              <div class="text-gray-600 text-sm">Paid Invoices</div>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <TrendingUp class="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-yellow-600">{stats.pendingInvoices}</div>
              <div class="text-gray-600 text-sm">Pending Invoices</div>
            </div>
            <div class="bg-yellow-100 p-3 rounded-lg">
              <Calendar class="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-red-600">{stats.rejectedInvoices}</div>
              <div class="text-gray-600 text-sm">Rejected Invoices</div>
            </div>
            <div class="bg-red-100 p-3 rounded-lg">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Invoice Trends Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Monthly Invoice Trends</h2>
          <p class="text-sm text-gray-600 mt-1">Invoice creation and earnings over the last 12 months</p>
        </div>

        <div class="p-6">
          {#if chartData().data.length === 0}
            <div class="flex items-center justify-center h-64 text-gray-500">
              <div class="text-center">
                <FileText class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No invoice data available</p>
                <p class="text-sm">Create some invoices to see trends</p>
              </div>
            </div>
          {:else}
            <!-- Chart Container -->
            <div class="relative">
              <!-- Legend -->
              <div class="flex items-center justify-center gap-6 mb-6">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <span class="text-sm text-gray-600">Invoice Count</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-green-600"></div>
                  <span class="text-sm text-gray-600">Earnings (NERO)</span>
                </div>
              </div>

              <!-- SVG Chart -->
              <div class="w-full overflow-x-auto">
                <svg viewBox="0 0 800 300" class="w-full h-80">
                  <!-- Gradient Definitions -->
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.8" />
                      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.2" />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:#10b981;stop-opacity:0.8" />
                      <stop offset="100%" style="stop-color:#10b981;stop-opacity:0.2" />
                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.1"/>
                    </filter>
                  </defs>

                  <!-- Grid Lines -->
                  {#each [0, 25, 50, 75, 100] as gridLine}
                    <line 
                      x1="60" 
                      y1={240 - (gridLine * 1.8)} 
                      x2="740" 
                      y2={240 - (gridLine * 1.8)} 
                      stroke="#f3f4f6" 
                      stroke-width="1"
                    />
                    <text 
                      x="50" 
                      y={245 - (gridLine * 1.8)} 
                      fill="#9ca3af" 
                      font-size="12" 
                      text-anchor="end"
                    >
                      {gridLine}%
                    </text>
                  {/each}

                  <!-- Chart Bars -->
                  {#each chartData().data as dataPoint, index}
                    {@const barWidth = 25}
                    {@const spacing = 55}
                    {@const x = 70 + index * spacing}
                    
                    <!-- Invoice Count Bar -->
                    <rect
                      role="button"
                      tabindex="0"
                      x={x - barWidth/2}
                      y={240 - (dataPoint.countPercentage * 1.8)}
                      width={barWidth}
                      height={dataPoint.countPercentage * 1.8}
                      fill="url(#blueGradient)"
                      rx="2"
                      filter="url(#shadow)"
                      class="transition-all duration-300 hover:opacity-80"
                      onmouseenter={() => hoveredIndex = index}
                      onmouseleave={() => hoveredIndex = -1}
                    />
                    
                    <!-- Earnings Bar -->
                    <rect
                      role="button"
                      tabindex="0"
                      x={x + barWidth/2 + 3}
                      y={240 - (dataPoint.amountPercentage * 1.8)}
                      width={barWidth}
                      height={dataPoint.amountPercentage * 1.8}
                      fill="url(#greenGradient)"
                      rx="2"
                      filter="url(#shadow)"
                      class="transition-all duration-300 hover:opacity-80"
                      onmouseenter={() => hoveredIndex = index}
                      onmouseleave={() => hoveredIndex = -1}
                    />

                    <!-- Month Label -->
                    <text
                      x={x + barWidth/2}
                      y="265"
                      fill="#6b7280"
                      font-size="12"
                      text-anchor="middle"
                      class="font-medium"
                    >
                      {dataPoint.month}
                    </text>

                    <!-- Hover Tooltip -->
                    {#if hoveredIndex === index}
                      <g class="animate-fade-in">
                        <!-- Tooltip Background -->
                        <rect
                          x={x - 40}
                          y={Math.min(240 - dataPoint.countPercentage * 1.8, 240 - dataPoint.amountPercentage * 1.8) - 60}
                          width="120"
                          height="50"
                          fill="white"
                          stroke="#e5e7eb"
                          stroke-width="1"
                          rx="6"
                          filter="url(#shadow)"
                        />
                        <!-- Tooltip Text -->
                        <text
                          x={x + 20}
                          y={Math.min(240 - dataPoint.countPercentage * 1.8, 240 - dataPoint.amountPercentage * 1.8) - 40}
                          fill="#374151"
                          font-size="11"
                          text-anchor="middle"
                          class="font-medium"
                        >
                          {dataPoint.month}
                        </text>
                        <text
                          x={x + 20}
                          y={Math.min(240 - dataPoint.countPercentage * 1.8, 240 - dataPoint.amountPercentage * 1.8) - 28}
                          fill="#3b82f6"
                          font-size="10"
                          text-anchor="middle"
                        >
                          {dataPoint.count} invoices
                        </text>
                        <text
                          x={x + 20}
                          y={Math.min(240 - dataPoint.countPercentage * 1.8, 240 - dataPoint.amountPercentage * 1.8) - 18}
                          fill="#10b981"
                          font-size="10"
                          text-anchor="middle"
                        >
                          {dataPoint.amount.toFixed(1)} NERO
                        </text>
                      </g>
                    {/if}
                  {/each}

                  <!-- Chart Title -->
                  <text
                    x="400"
                    y="20"
                    fill="#111827"
                    font-size="16"
                    text-anchor="middle"
                    class="font-semibold"
                  >
                    Performance Trends
                  </text>
                </svg>
              </div>

              <!-- Summary Stats Below Chart -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                {#if chartData().data.length > 0}
                  {@const currentData = chartData().data}
                  {@const totalThisMonth = currentData[currentData.length - 1] || { count: 0, amount: 0, paid: 0 }}
                  {@const totalLastMonth = currentData[currentData.length - 2] || { count: 0, amount: 0, paid: 0 }}
                  {@const countGrowth = totalLastMonth.count > 0 ? ((totalThisMonth.count - totalLastMonth.count) / totalLastMonth.count * 100) : 0}
                  {@const earningsGrowth = totalLastMonth.amount > 0 ? ((totalThisMonth.amount - totalLastMonth.amount) / totalLastMonth.amount * 100) : 0}

                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{totalThisMonth.count}</div>
                    <div class="text-sm text-gray-600">This Month</div>
                    {#if countGrowth !== 0}
                      <div class="text-xs {countGrowth > 0 ? 'text-green-600' : 'text-red-600'} mt-1">
                        {countGrowth > 0 ? '+' : ''}{countGrowth.toFixed(1)}% vs last month
                      </div>
                    {/if}
                  </div>

                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">{totalThisMonth.amount.toFixed(1)}</div>
                    <div class="text-sm text-gray-600">Earned (NERO)</div>
                    {#if earningsGrowth !== 0}
                      <div class="text-xs {earningsGrowth > 0 ? 'text-green-600' : 'text-red-600'} mt-1">
                        {earningsGrowth > 0 ? '+' : ''}{earningsGrowth.toFixed(1)}% vs last month
                      </div>
                    {/if}
                  </div>

                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">{totalThisMonth.paid}</div>
                    <div class="text-sm text-gray-600">Paid Invoices</div>
                    <div class="text-xs text-gray-500 mt-1">
                      {totalThisMonth.count > 0 ? ((totalThisMonth.paid / totalThisMonth.count) * 100).toFixed(0) : 0}% conversion
                    </div>
                  </div>

                  <div class="text-center">
                    {#if totalThisMonth.paid > 0}
                      {@const avgAmount = totalThisMonth.amount / totalThisMonth.paid}
                      <div class="text-2xl font-bold text-orange-600">{avgAmount.toFixed(1)}</div>
                    {:else}
                      <div class="text-2xl font-bold text-orange-600">0.0</div>
                    {/if}
                    <div class="text-sm text-gray-600">Avg. Invoice</div>
                    <div class="text-xs text-gray-500 mt-1">NERO value</div>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Recent Invoices Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">All Invoices</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {#if stats.rejectedInvoices > 0}
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejection Reason</th>
                {/if}
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each invoices as invoice}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{invoice.project_name || 'Untitled'}</div>
                    <div class="text-sm text-gray-500">ID: {invoice.id}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{invoice.amount} NERO</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {invoice.status === 'paid' ? 'bg-green-100 text-green-800' : invoice.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}">
                      {invoice.status || 'pending'}
                    </span>
                  </td>
                  {#if stats.rejectedInvoices > 0}
                    <td class="px-6 py-4">
                      {#if invoice.status === 'rejected' && invoice.rejection_reason}
                        <div class="max-w-xs">
                          <div class="text-sm text-gray-900 truncate" title={invoice.rejection_reason}>
                            {invoice.rejection_reason}
                          </div>
                        </div>
                      {:else if invoice.status === 'rejected'}
                        <span class="text-sm text-gray-500">No reason provided</span>
                      {:else}
                        <span class="text-sm text-gray-400">-</span>
                      {/if}
                    </td>
                  {/if}
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {#if invoice.chain_tx_hash}
                      <a 
                        href="https://testnet.neroscan.io/tx/{invoice.chain_tx_hash}" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="text-blue-600 hover:text-blue-800 underline"
                        title="Invoice Creation Transaction"
                      >
                        View Transaction
                      </a>
                    {:else}
                      <span class="text-gray-400">No transaction</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        {#if invoices.length === 0}
          <div class="p-6 text-center text-gray-500">
            No invoices found. Create your first invoice to see reports.
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
