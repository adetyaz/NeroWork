<script lang="ts">
    let { formData = $bindable() } = $props();
</script>

<div>
    <div class="mb-6">
        <label class="mb-2 block text-sm font-medium text-gray-700">Address</label>
        <div class="relative">
            <svg
                class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
            </svg>
            <input
                type="text"
                placeholder="Enter your address"
                bind:value={formData.address}
                class="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>

    <div class="mb-6">
        <label class="mb-2 block text-sm font-medium text-gray-700">Phone</label>
        <div class="flex">
            <div class="relative w-24">
                <select
                    bind:value={formData.phoneCountry}
                    class="w-full appearance-none rounded-l-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                    <option value="+880">+880</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                </select>
                <svg
                    class="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
            <div class="relative flex-1">
                <svg
                    class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                </svg>
                <input
                    type="tel"
                    placeholder="Phone number..."
                    bind:value={formData.phone}
                    class="w-full rounded-r-lg border border-l-0 border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    </div>

    <div class="mb-6">
        <label class="mb-2 block text-sm font-medium text-gray-700">Email</label>
        <div class="relative">
            <svg
                class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
            </svg>
            <input
                type="email"
                placeholder="Email address"
                bind:value={formData.email}
                class="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
        </div>
    </div>
</div>