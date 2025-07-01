<script>
  // Placeholder data - we'll make this dynamic later
  const service = {
    title: "I will design a professional logo for your business",
    description: `I will create a unique and memorable logo that perfectly represents your brand. With years of experience in graphic design, I ensure high-quality and original designs. You will receive multiple concepts and revisions until you are completely satisfied.`,
    plans: [ // Renamed 'packages' to 'plans'
      { name: "Basic", price: 50, features: ["1 Logo Concept", "2 Revisions", "High-Resolution Files"] },
      { name: "Standard", price: 100, features: ["3 Logo Concepts", "Unlimited Revisions", "Source Files", "Brand Guidelines"] },
      { name: "Premium", price: 150, features: ["5 Logo Concepts", "Unlimited Revisions", "Source Files", "Brand Guidelines", "Social Media Kit"] },
    ],
    freelancer: {
      name: "CreativePro",
      username: "creative_pro",
      profilePicture: "https://via.placeholder.com/80", // Replace with actual image URL
      rating: 4.8,
      reviews: 125,
    },
    images: [
      "https://via.placeholder.com/400x300/abcdef/ffffff?Text=Logo+Example+1",
      "https://via.placeholder.com/400x300/fedcba/ffffff?Text=Logo+Example+2",
    ],
    deliveryTime: "3 Days",
    tags: ["logo design", "branding", "graphic design", "business logo"],
    revisions: "Unlimited",
    addons: [
      { name: "Extra Fast Delivery (1 Day)", price: 20 },
      { name: "Social Media Kit", price: 30 },
    ],
    reviewsList: [
      { author: "AwesomeClient", rating: 5, comment: "Fantastic work! The logo is exactly what I wanted." },
      { author: "HappyBuyer", rating: 4, comment: "Great communication and a good design." },
    ],
    primaryColor: "oklch(21% 0.034 264.665)",
    cardBackgroundColor: "oklch(25% 0.034 264.665)",
    reviewCardBackgroundColor: "oklch(28% 0.034 264.665)",
    textColor: "white", // Adjust as needed for contrast
    accentColor: "#3490dc", // A nice blue accent color
    buttonTextColor: "white",
  };
</script>

<div class="min-h-screen py-10" style={`background-color: ${service.primaryColor}; color: ${service.textColor};`}>
  <div class="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl p-6">
    <div class="flex flex-col gap-4">
      {#each service.images as image}
        <img src={image} alt="Service Image" class="rounded-xl shadow-lg object-cover w-full h-auto aspect-video">
      {/each}
    </div>

    <div class="flex flex-col justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-4">{service.title}</h1>
        <p class="text-lg text-gray-300 mb-6">{service.description}</p>

        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-3">Choose your plan</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each service.plans as plan}
              <div class="rounded-lg shadow-md p-6 flex flex-col justify-between" style={`background-color: ${service.cardBackgroundColor};`}>
                <div>
                  <h3 class="text-lg font-semibold mb-2">{plan.name}</h3>
                  <p class="text-xl font-bold mb-3">${plan.price}</p>
                  <ul class="list-disc list-inside text-gray-300 space-y-1">
                    {#each plan.features as feature}
                      <li>{feature}</li>
                    {/each}
                  </ul>
                </div>
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 transition duration-200">Order Now</button>
              </div>
            {/each}
          </div>
        </div>

        <div class="mb-6 rounded-lg shadow-md p-6 flex items-center gap-4" style={`background-color: ${service.cardBackgroundColor};`}>
          <img src={service.freelancer.profilePicture} alt={service.freelancer.name} class="w-16 h-16 rounded-full object-cover">
          <div>
            <h3 class="font-semibold text-lg">{service.freelancer.name} (<span class="text-gray-300">{service.freelancer.username}</span>)</h3>
            {#if service.freelancer.rating}
              <p class="text-sm text-gray-300">Rating: <span class="font-bold">{service.freelancer.rating}</span> ({service.freelancer.reviews} reviews)</p>
            {/if}
          </div>
          <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md ml-auto transition duration-200">Contact Seller</button>
        </div>
      </div>

      <div>
        <div class="mb-6 rounded-lg shadow-md p-6" style={`background-color: ${service.cardBackgroundColor};`}>
          <h2 class="text-xl font-semibold mb-3">Service Details</h2>
          <p class="text-gray-300 mb-2">Delivery Time: <span class="font-semibold">{service.deliveryTime}</span></p>
          <p class="text-gray-300 mb-2">Revisions: <span class="font-semibold">{service.revisions}</span></p>
          {#if service.tags.length > 0}
            <p class="text-gray-300">Tags: <span class="text-blue-400">{service.tags.join(', ')}</span></p>
          {/if}
          {#if service.addons.length > 0}
            <h3 class="font-semibold mt-4 mb-2">Add-ons</h3>
            <ul class="list-disc list-inside text-gray-300 space-y-1">
              {#each service.addons as addon}
                <li>{addon.name} - <span class="font-semibold">${addon.price}</span></li>
              {/each}
            </ul>
          {/if}
        </div>

        {#if service.reviewsList.length > 0}
          <div class="rounded-lg shadow-md p-6" style={`background-color: ${service.cardBackgroundColor};`}>
            <h2 class="text-xl font-semibold mb-3">Client Reviews</h2>
            <div class="mt-4 space-y-4">
              {#each service.reviewsList as review}
                <div class="rounded-md p-4" style={`background-color: ${service.reviewCardBackgroundColor};`}>
                  <p class="font-semibold text-gray-200">{review.author}</p>
                  <p class="text-sm text-gray-400">Rating: <span class="font-bold">{review.rating}/5</span></p>
                  <p class="text-gray-300">{review.comment}</p>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>