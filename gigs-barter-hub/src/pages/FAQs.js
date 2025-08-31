export default function FAQs() {
  const faqs = [
    { 
      q: "What is Gig & Barter Hub?", 
      a: "It's a platform for finding and posting gigs, with options for both monetary payment and service exchange." 
    },
    { 
      q: "How do I create an account?", 
      a: "Click on the 'Sign up' link in the navigation bar, fill out your details, and start exploring gigs!" 
    },
    { 
      q: "Is it free to use?", 
      a: "Yes! Browsing gigs and creating an account is completely free." 
    },
    { 
      q: "Can I barter my services instead of paying?", 
      a: "Absolutely! You can offer your services in exchange for another service, depending on the gig." 
    },
    { 
      q: "How do I post a gig?", 
      a: "Navigate to 'Post a Gig', fill out the title, description, and payment or barter details, and submit it." 
    },
    { 
      q: "How do I apply to a gig?", 
      a: "Simply click on the gig you're interested in, fill out your application, and submit it to the poster." 
    },
    { 
      q: "Is my personal information safe?", 
      a: "Yes! We take privacy seriously and never share your personal details with others without consent." 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 pt-20 pb-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-4xl mx-auto space-y-6 px-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.q}</h3>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
