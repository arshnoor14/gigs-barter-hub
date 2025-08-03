export default function BrowseGigs() {
  const gigs = [
    {
      id: 1,
      title: "Website Redesign for a Startup",
      description: "A complete redesign of an existing e-commerce website to improve user experience and conversion rates. We need a creative UI/UX designer.",
      postedBy: "Jane Doe",
      price: "$500"
    },
    {
      id: 2,
      title: "Social Media Manager Needed",
      description: "Looking for an experienced social media manager to handle our brand's presence on Instagram and Twitter. Must be proficient in content strategy.",
      postedBy: "John Smith",
      price: "Barter: Graphic Design"
    },
    {
      id: 3,
      title: "Logo Design for a Local Coffee Shop",
      description: "We're a new coffee shop in town and need a unique, memorable logo. Looking for someone with a great portfolio in branding.",
      postedBy: "Coffee Co.",
      price: "$200"
    },
  ];

  return (
    <div className="container mx-auto p-8 pt-20 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-10">
        Browse Gigs
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12">
        Explore gigs posted by others based on your skillset or interest.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs.map((gig) => (
          <div 
            key={gig.id} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {gig.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
              {gig.description}
            </p>
            <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              <span>Posted by: {gig.postedBy}</span>
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {gig.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}