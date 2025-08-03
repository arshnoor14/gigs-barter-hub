import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white pt-16">
      <div className="container mx-auto p-8 text-center">
        {/* Main Heading */}
        <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Welcome to Gig & Barter Hub
        </h2>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Find or post short-term gigs. Pay or exchange services—your call!
        </p>

        {/* Call to Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link
            to="/browse"
            className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-purple-700"
          >
            Browse Gigs
          </Link>
          <Link
            to="/post-gig"
            className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Post a Gig
          </Link>
        </div>
      </div>
    </div>
  );
}