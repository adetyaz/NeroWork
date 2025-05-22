<script>
  // Placeholder data for form fields - in a real app, these would be bound to state
  let mapLocation = '';
  let phoneNumber = '';
  let emailAddress = '';

  let notifyEmployerShortlisted = false;
  let notifyAppliedJobs = false;
  let notifyFiveJobAlerts = false;
  let notifyEmployerSavedProfile = true; // Appears checked in image
  let notifyEmployerRejected = true;    // Appears checked in image

  let jobAlertRole = '';
  let jobAlertLocation = '';

  let profileIsPublic = true; // Appears Yes in image
  let resumeIsPrivate = false; // Appears No in image

  let currentPassword = '';
  let newPassword = '';
  let confirmPassword = '';

  // For password visibility toggles
  let showCurrentPassword = false;
  let showNewPassword = false;
  let showConfirmPassword = false;

  // Placeholder for primary color (from previous pages)
  const primaryColor = 'oklch(21% 0.034 264.665)'; // Your dark blue/purple color
  const accentColor = 'indigo-600'; // For highlights, buttons
  const borderColor = 'gray-300';
</script>

<div class="min-h-screen bg-gray-50 font-sans text-gray-800">
  <header class="bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-gray-200">
    <div class="flex items-center space-x-4">
      <img src="https://via.placeholder.com/32x32?text=M" alt="MyJob Logo" class="h-8 w-8 rounded-full">
      <span class="font-semibold text-xl">MyJob</span>
      <div class="hidden md:flex space-x-6 text-sm text-gray-600">
        <a href="#" class="hover:text-gray-900">Home</a>
        <a href="#" class="hover:text-gray-900">Find Job</a>
        <a href="#" class="hover:text-gray-900">Find Employers</a>
        <a href="#" class="hover:text-gray-900">Dashboard</a>
        <a href="#" class="hover:text-gray-900">Job Alerts</a>
        <a href="#" class="hover:text-gray-900">Customer Supports</a>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <span class="text-sm text-gray-600 hidden sm:block">+1-262-555-0178</span>
      <select class="text-sm border-none bg-transparent">
        <option>🇬🇧 English</option>
      </select>
      <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <img src="https://via.placeholder.com/32x32?text=P" alt="User Avatar" class="h-8 w-8 rounded-full border border-gray-300">
    </div>
  </header>

  <div class="flex flex-grow max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <aside class="w-64 bg-white rounded-lg shadow-md p-6 mr-6 flex-shrink-0">
      <h2 class="text-lg font-semibold mb-4">Candidate Dashboard</h2>
      <nav class="space-y-2">
        <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
          Overview
        </a>
        <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v2H3a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2h-3V6a4 4 0 00-4-4zm2 6H8V6a2 2 0 114 0v2z" clip-rule="evenodd"/></svg>
          Applied Jobs
        </a>
        <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v2H3a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2h-3V6a4 4 0 00-4-4zm2 6H8V6a2 2 0 114 0v2z" clip-rule="evenodd"/></svg>
          Favorite Jobs
        </a>
        <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clip-rule="evenodd"/></svg>
          Job Alert
        </a>
        <a href="#" class="flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17C10.687 2.228 9.313 2.228 8.51 3.17L2.455 10.655C1.564 11.758 2.383 13.5 3.737 13.5H16.263c1.354 0 2.173-1.742 1.282-2.845l-6.058-7.485zM10 16a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
          Settings
        </a>
      </nav>
      <div class="mt-8 pt-4 border-t border-gray-200">
        <a href="#" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 11.707a1 1 0 001.414 0l4-4a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-2.293 2.293a1 1 0 000 1.414z" clip-rule="evenodd" />
          </svg>
          Log-out
        </a>
      </div>
    </aside>

    <main class="flex-1 bg-white rounded-lg shadow-md p-8">
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <a href="#" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Personal</a>
          <a href="#" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Profile</a>
          <a href="#" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">Social Links</a>
          <a href="#" class="whitespace-nowrap py-4 px-1 border-b-2 border-{accentColor} text-{accentColor} font-medium text-sm" aria-current="page">Account Setting</a>
        </nav>
      </div>

      <section class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Info</h2>
        <div class="space-y-4">
          <div>
            <label for="map-location" class="block text-sm font-medium text-gray-700">Map Location</label>
            <input type="text" id="map-location" bind:value={mapLocation} class="mt-1 block w-full border border-{borderColor} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm" placeholder="">
          </div>
          <div>
            <label for="phone-number" class="block text-sm font-medium text-gray-700">Phone</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-{borderColor} bg-gray-50 text-gray-500 sm:text-sm">+880</span>
              <input type="text" id="phone-number" bind:value={phoneNumber} class="flex-1 block w-full rounded-none rounded-r-md border-{borderColor} py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm" placeholder="Phone number...">
            </div>
          </div>
          <div>
            <label for="email-address" class="block text-sm font-medium text-gray-700">Email</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input type="email" id="email-address" bind:value={emailAddress} class="flex-1 block w-full rounded-md border-{borderColor} py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm" placeholder="Email address">
            </div>
          </div>
          <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-{accentColor} hover:bg-{accentColor}-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-{accentColor}">
            Save Changes
          </button>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Notification</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center">
            <input id="notify-employer-shortlisted" type="checkbox" bind:checked={notifyEmployerShortlisted} class="h-4 w-4 text-{accentColor} border-gray-300 rounded focus:ring-{accentColor}">
            <label for="notify-employer-shortlisted" class="ml-2 block text-sm text-gray-900">
              Notify me when employers shortlisted me
            </label>
          </div>
          <div class="flex items-center">
            <input id="notify-employer-saved" type="checkbox" bind:checked={notifyEmployerSavedProfile} class="h-4 w-4 text-{accentColor} border-gray-300 rounded focus:ring-{accentColor}">
            <label for="notify-employer-saved" class="ml-2 block text-sm text-gray-900">
              Notify me when employers saved my profile
            </label>
          </div>
          <div class="flex items-center">
            <input id="notify-applied-jobs" type="checkbox" bind:checked={notifyAppliedJobs} class="h-4 w-4 text-{accentColor} border-gray-300 rounded focus:ring-{accentColor}">
            <label for="notify-applied-jobs" class="ml-2 block text-sm text-gray-900">
              Notify me when my applied jobs are more
            </label>
          </div>
          <div class="flex items-center">
            <input id="notify-employer-rejected" type="checkbox" bind:checked={notifyEmployerRejected} class="h-4 w-4 text-{accentColor} border-gray-300 rounded focus:ring-{accentColor}">
            <label for="notify-employer-rejected" class="ml-2 block text-sm text-gray-900">
              Notify me when employers rejected me
            </label>
          </div>
          <div class="flex items-center">
            <input id="notify-five-job-alerts" type="checkbox" bind:checked={notifyFiveJobAlerts} class="h-4 w-4 text-{accentColor} border-gray-300 rounded focus:ring-{accentColor}">
            <label for="notify-five-job-alerts" class="ml-2 block text-sm text-gray-900">
              Notify me when I have up to 5 job alerts
            </label>
          </div>
        </div>
      </section>

      <section class="mb-8 border-b pb-8 border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Job Alerts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="job-alert-role" class="block text-sm font-medium text-gray-700">Role</label>
            <input type="text" id="job-alert-role" bind:value={jobAlertRole} class="mt-1 block w-full border border-{borderColor} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm" placeholder="Your Job roles">
          </div>
          <div>
            <label for="job-alert-location" class="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="job-alert-location" bind:value={jobAlertLocation} class="mt-1 block w-full border border-{borderColor} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm" placeholder="City, state, country name">
          </div>
        </div>
        <div class="mt-4">
          <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-{accentColor} hover:bg-{accentColor}-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-{accentColor}">
            Save Changes
          </button>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Privacy</h2>
        <div class="flex items-center space-x-4">
          <label class="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" bind:checked={profileIsPublic} class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-{accentColor} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-{accentColor}"></div>
          </label>
          <span class="text-sm font-medium text-gray-700">
            {profileIsPublic ? 'YES' : 'NO'} <span class="text-gray-500">Your profile is {profileIsPublic ? 'public' : 'private'} now</span>
          </span>
        </div>
      </section>

      <section class="mb-8 border-b pb-8 border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Resume Privacy</h2>
        <div class="flex items-center space-x-4">
          <label class="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" bind:checked={resumeIsPrivate} class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-{accentColor} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-{accentColor}"></div>
          </label>
          <span class="text-sm font-medium text-gray-700">
            {resumeIsPrivate ? 'YES' : 'NO'} <span class="text-gray-500">Your resume is {resumeIsPrivate ? 'private' : 'public'} now</span>
          </span>
        </div>
      </section>

      <section class="mb-8 border-b pb-8 border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="current-password" class="block text-sm font-medium text-gray-700">Current Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type={showCurrentPassword ? 'text' : 'password'} id="current-password" bind:value={currentPassword} class="block w-full pr-10 border-{borderColor} rounded-md py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button type="button" onclick={() => showCurrentPassword = !showCurrentPassword} class="text-gray-400 hover:text-gray-600 focus:outline-none">
                  {#if showCurrentPassword}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.981 12C5.078 14.582 7.636 17 12 17s6.922-2.418 8.019-5c-1.097-2.582-3.655-5-8.019-5S5.078 9.418 3.981 12z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  {/if}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700">New Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type={showNewPassword ? 'text' : 'password'} id="new-password" bind:value={newPassword} class="block w-full pr-10 border-{borderColor} rounded-md py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button type="button" onclick={() => showNewPassword = !showNewPassword} class="text-gray-400 hover:text-gray-600 focus:outline-none">
                  {#if showNewPassword}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.981 12C5.078 14.582 7.636 17 12 17s6.922-2.418 8.019-5c-1.097-2.582-3.655-5-8.019-5S5.078 9.418 3.981 12z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {/if}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirm-password" bind:value={confirmPassword} class="block w-full pr-10 border-{borderColor} rounded-md py-2 px-3 focus:outline-none focus:ring-{accentColor} focus:border-{accentColor} sm:text-sm">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button type="button" onclick={() => showConfirmPassword = !showConfirmPassword} class="text-gray-400 hover:text-gray-600 focus:outline-none">
                  {#if showConfirmPassword}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.981 12C5.078 14.582 7.636 17 12 17s6.922-2.418 8.019-5c-1.097-2.582-3.655-5-8.019-5S5.078 9.418 3.981 12z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {/if}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-{accentColor} hover:bg-{accentColor}-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-{accentColor}">
            Save Changes
          </button>
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-red-700 mb-4">Delete Your Account</h2>
        <p class="text-sm text-gray-700 mb-4">
          If you delete your Jobpilot account, you will no longer be able to get information from it, and it will be permanently deleted from our database. All your data will be deleted and removed. You will be abandoned from all the services of Jobpilot.com.
        </p>
        <button class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clip-rule="evenodd" />
          </svg>
          Close Account
        </button>
      </section>

    </main>
  </div>
</div>