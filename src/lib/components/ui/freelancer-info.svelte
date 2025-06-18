<script lang="ts">
    let { formData = $bindable() } = $props();
    let showResumePopup = $state(false);

    function handleFileUpload(type: 'image' | 'resume', event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            if (type === 'resume') {
                formData.resume = file;
                formData.nameOfResume = file.name;
            } else {
                formData[type] = file;
            }
        }
    }
</script>

<div>
    <h2 class="mb-6 text-xl font-semibold">Freelancer Profile</h2>

    <div class="mb-6">
        <h3 class="mb-2 block text-sm font-medium text-gray-700">Full Name</h3>
        <input
            type="text"
            placeholder="Enter your full name"
            bind:value={formData.fullName}
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>

    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
            <h3 class="mb-2 block text-sm font-medium text-gray-700">Profile Image</h3>
            <div
                class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400"
            >
                <svg
                    class="mx-auto mb-2 h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                </svg>
                <p class="mb-1 text-sm text-gray-600">
                    <label class="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                        Browse photo
                        <input
                            type="file"
                            class="hidden"
                            accept="image/*"
                            onchange={(e) => handleFileUpload('image', e)}
                        />
                    </label>
                    or drop here
                </p>
                <p class="text-xs text-gray-500">
                    A photo larger than 400 pixels works best. Max size 5 MB.
                </p>
            </div>
        </div>

        <div>
            <h3 class="mb-2 block text-sm font-medium text-gray-700">Resume</h3>
            <button
                onclick={() => (showResumePopup = true)}
                class="w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400"
            >
                <svg
                    class="mx-auto mb-2 h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                </svg>
                <p class="mb-1 text-sm text-gray-600">
                    {#if formData.nameOfResume}
                        {formData.nameOfResume}
                    {:else}
                        Click to upload resume
                    {/if}
                </p>
                <p class="text-xs text-gray-500">PDF or DOC, max size 10 MB.</p>
            </button>
        </div>
    </div>

    <div class="mb-6">
        <h3 class="mb-2 block text-sm font-medium text-gray-700">Biography</h3>
        <textarea
            placeholder="Tell us about yourself..."
            bind:value={formData.biography}
            class="resize-vertical min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        ></textarea>
    </div>

    {#if showResumePopup}
        <dialog
            open
            class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold mb-4">Upload Resume</h3>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onchange={(e) => {
                        handleFileUpload('resume', e);
                        showResumePopup = false;
                    }}
                    class="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2"
                />
                {#if formData.nameOfResume}
                    <p class="text-sm text-gray-600 mb-4">Selected: {formData.nameOfResume}</p>
                {/if}
                <div class="flex justify-end space-x-2">
                    <button
                        onclick={() => (showResumePopup = false)}
                        class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onclick={() => (showResumePopup = false)}
                        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        disabled={!formData.resume}
                    >
                        Save
                    </button>
                </div>
            </div>
        </dialog>
    {/if}
</div>