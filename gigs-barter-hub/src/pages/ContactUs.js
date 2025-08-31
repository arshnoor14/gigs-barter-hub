export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 pb-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-10">
        Contact Us
      </h2>

      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-blue-100 text-center">
        <p className="text-gray-700 text-lg mb-6">
          Have questions, suggestions, or feedback? We’d love to hear from you! Reach out and we’ll get back to you as soon as possible.
        </p>

        <p className="text-gray-900 font-semibold mb-2">Email:</p>
        <a 
          href="mailto:support@gigsbarterhub.com" 
          className="text-purple-600 font-bold hover:underline"
        >
          support@gigsbarterhub.com
        </a>

        <p className="mt-6 text-gray-500">
          Follow us on social media for updates and announcements.
        </p>
        <div className="flex justify-center space-x-4 mt-4 text-gray-700">
          <a href="#" className="hover:text-purple-600 transition-colors">Twitter</a>
          <a href="#" className="hover:text-purple-600 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-purple-600 transition-colors">Instagram</a>
        </div>
      </div>
    </div>
  );
}
