<script lang="ts">
    let { formData = $bindable() } = $props();
</script>

<div>
    <div class="mb-6">
        <h3 class="mb-2 block text-sm font-medium text-gray-700">Professional Title</h3>
        <input
            type="text"
            placeholder="E.g., Software Engineer"
            bind:value={formData.title}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
    </div>

    <div class="mb-6">
        <h3 class="mb-2 block text-sm font-medium text-gray-700">Experience</h3>
        <textarea
            placeholder="Describe your professional experience..."
            bind:value={formData.experience}
            class="resize-vertical min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        ></textarea>
    </div>

    <div class="mb-6">
        <h3 class="mb-2 block text-sm font-medium text-gray-700">Personal Website</h3>
        <input
            type="url"
            placeholder="Your website or portfolio URL..."
            bind:value={formData.personalWebsite}
            class="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
    </div>
</div>