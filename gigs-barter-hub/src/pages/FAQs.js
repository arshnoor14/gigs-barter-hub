export default function FAQs() {
  const faqs = [
    { q: "What is Gig & Barter Hub?", a: "It's a platform for finding and posting gigs, with options for both monetary payment and service exchange." },
    { q: "How do I create an account?", a: "Click on the 'Sign up' link in the navigation bar and fill out the form." },
    { q: "Is it free to use?", a: "Yes, creating an account and browsing gigs is completely free." }
  ];

  return (
    <div className="container mx-auto p-8 pt-20 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-6">FAQs</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
            <p className="text-gray-700 dark:text-gray-300">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}