<script>
	import DashboardLayout from '$lib/components/dashboard-layout.svelte';
	import AccountSettingTab from '$lib/components/ui/account-setting-tab.svelte';
	import PersonalTab from '$lib/components/ui/personal-tab.svelte';
	import ProfileTab from '$lib/components/ui/profile-tab.svelte';
	import SocialLinksTab from '$lib/components/ui/social-links-tab.svelte';

	let activeTab = $state('account');
</script>

<div class="rounded-lg bg-white shadow-sm">
	<div class="border-b border-gray-100 p-6">
		<h1 class="text-xl font-semibold">Settings</h1>
	</div>

	<!-- Tabs -->
	<div class="flex border-b border-gray-100">
		<button
			onclick={() => (activeTab = 'personal')}
			class="flex items-center border-b-2 px-6 py-4 text-sm font-medium {activeTab === 'personal'
				? 'border-[#0066ff] text-[#0066ff]'
				: 'border-transparent text-gray-500'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-2"
			>
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
				<circle cx="12" cy="7" r="4"></circle>
			</svg>
			Personal
		</button>
		<button
			onclick={() => (activeTab = 'profile')}
			class="flex items-center border-b-2 px-6 py-4 text-sm font-medium {activeTab === 'profile'
				? 'border-[#0066ff] text-[#0066ff]'
				: 'border-transparent text-gray-500'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-2"
			>
				<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
				<circle cx="12" cy="7" r="4"></circle>
			</svg>
			Profile
		</button>
		<button
			onclick={() => (activeTab = 'social')}
			class="flex items-center border-b-2 px-6 py-4 text-sm font-medium {activeTab === 'social'
				? 'border-[#0066ff] text-[#0066ff]'
				: 'border-transparent text-gray-500'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-2"
			>
				<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
				<polyline points="15 3 21 3 21 9" />
				<line x1="10" y1="14" x2="21" y2="3" />
			</svg>
			Social Links
		</button>
		<button
			onclick={() => (activeTab = 'account')}
			class="flex items-center border-b-2 px-6 py-4 text-sm font-medium {activeTab === 'account'
				? 'border-[#0066ff] text-[#0066ff]'
				: 'border-transparent text-gray-500'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-2"
			>
				<circle cx="12" cy="12" r="3" />
				<path
					d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
				/>
			</svg>
			Account Setting
		</button>
	</div>

	<!-- Tab Content -->
	<div class="p-6">
		{#if activeTab === 'personal'}
			<PersonalTab />
		{:else if activeTab === 'profile'}
			<ProfileTab />
		{:else if activeTab === 'social'}
			<SocialLinksTab />
		{:else if activeTab === 'account'}
			<AccountSettingTab />
		{/if}
	</div>
</div>
