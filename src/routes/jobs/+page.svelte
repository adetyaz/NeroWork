<script>
  // Placeholder data - we'll make this dynamic later
  const service = {
    title: "I will design a professional logo for your business",
    description: `I will create a unique and memorable logo that perfectly represents your brand. With years of experience in graphic design, I ensure high-quality and original designs. You will receive multiple concepts and revisions until you are completely satisfied.`,
    packages: [
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
    buttonColor: "#007bff", // Example button color
  };
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6" style={`background-color: ${service.primaryColor}; color: ${service.textColor};`}>
  <div class="flex flex-col gap-3">
    {#each service.images as image}
      <img src={image} alt="Service Image" class="rounded-lg shadow-md">
    {/each}
  </div>

  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-semibold">{service.title}</h1>
    <p class="text-gray-300">{service.description}</p>

    <div class="mt-4">
      <h2 class="text-xl font-semibold mb-2">Choose your package</h2>
      <div class="flex flex-col gap-3">
        {#each service.packages as packageTask}
          <div class="rounded-lg shadow-md p-4" style={`background-color: ${service.cardBackgroundColor};`}>
            <h3 class="text-lg font-semibold mb-1">{packageTask.name}</h3>
            <p class="text-xl font-bold">${packageTask.price}</p>
            <ul class="list-disc list-inside text-gray-300 mt-2">
              {#each packageTask.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">Order Now</button>
          </div>
        {/each}
      </div>
    </div>

    <div class="mt-6 rounded-lg shadow-md p-4 flex items-center gap-4" style={`background-color: ${service.cardBackgroundColor};`}>
      <img src={service.freelancer.profilePicture} alt={service.freelancer.name} class="w-12 h-12 rounded-full object-cover">
      <div>
        <h3 class="font-semibold">{service.freelancer.name} (<span class="text-gray-300">{service.freelancer.username}</span>)</h3>
        {#if service.freelancer.rating}
          <p class="text-sm text-gray-300">Rating: {service.freelancer.rating} ({service.freelancer.reviews} reviews)</p>
        {/if}
      </div>
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto">Contact Seller</button>
    </div>

    <div class="mt-6 rounded-lg shadow-md p-4" style={`background-color: ${service.cardBackgroundColor};`}>
      <h2 class="text-xl font-semibold mb-2">Service Details</h2>
      <p class="text-gray-300">Delivery Time: {service.deliveryTime}</p>
      <p class="text-gray-300">Revisions: {service.revisions}</p>
      {#if service.tags.length > 0}
        <p class="text-gray-300">Tags: <span class="text-blue-400">{service.tags.join(', ')}</span></p>
      {/if}
      {#if service.addons.length > 0}
        <h3 class="font-semibold mt-3">Add-ons</h3>
        <ul class="list-disc list-inside text-gray-300 mt-2">
          {#each service.addons as addon}
            <li>{addon.name} - <span class="font-bold">${addon.price}</span></li>
          {/each}
        </ul>
      {/if}
    </div>

    {#if service.reviewsList.length > 0}
      <div class="mt-6 rounded-lg shadow-md p-4" style={`background-color: ${service.cardBackgroundColor};`}>
        <h2 class="text-xl font-semibold mb-2">Client Reviews</h2>
        <div class="flex flex-col gap-3">
          {#each service.reviewsList as review}
            <div class="rounded-md p-3" style={`background-color: ${service.reviewCardBackgroundColor};`}>
              <p class="font-semibold">{review.author}</p>
              <p class="text-sm text-gray-400">Rating: {review.rating}/5</p>
              <p class="text-gray-300">{review.comment}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>