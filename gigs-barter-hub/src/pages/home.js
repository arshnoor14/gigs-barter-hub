import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 text-gray-900 dark:text-white pt-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between container mx-auto px-8 py-20 gap-8">
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-purple-600 animate-slideInDown">
            Welcome to Gig & Barter Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-400 max-w-xl mx-auto md:mx-0 animate-fadeIn delay-200">
            Find gigs, offer services, or exchange skills. A platform for opportunities and happy vibes!
          </p>
          <div className="flex justify-center md:justify-start gap-6 mt-4">
            <Link
              to="/browse"
              className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:bg-purple-700 hover:shadow-2xl animate-bounceIn"
            >
              Browse Gigs
            </Link>
            <Link
              to="/post-gig"
              className="bg-white text-purple-600 font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-110 hover:bg-purple-100 hover:shadow-2xl animate-bounceIn delay-200"
            >
              Post a Gig
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src="https://cdn.prod.website-files.com/606a802fcaa89bc357508cad/61a66ca40534663ab0f2195f_Gig%20image%20guidelines%20-%20WIIF%20sellers.png"
            alt="Happy vibes illustration"
            className="w-80 h-80 rounded-3xl shadow-2xl object-cover animate-fadeIn"
          />
        </div>
      </section>

      <section className="container mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-500 animate-slideInDown">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="flex-1 bg-pink-50 dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform text-center animate-fadeInUp">
            <h3 className="text-2xl font-bold mb-4 text-pink-500">Browse Gigs</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Explore available gigs around the world or near you. Find opportunities to grow your skills.
            </p>
          </div>
          <div className="flex-1 bg-yellow-50 dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform text-center animate-fadeInUp delay-100">
            <h3 className="text-2xl font-bold mb-4 text-yellow-500">Post Your Services</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Offer your skills and attract clients or collaborators easily. Let the world know your talents!
            </p>
          </div>
          <div className="flex-1 bg-purple-50 dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform text-center animate-fadeInUp delay-200">
            <h3 className="text-2xl font-bold mb-4 text-purple-600">Barter Skills</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Exchange your skills with others without money. Connect, collaborate, and grow together!
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-600 animate-slideInDown">
          What People Say
        </h2>
        <div className="container mx-auto px-8 flex flex-col md:flex-row gap-8 justify-center">
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              "I found amazing gigs and connected with talented people! This platform makes me happy every day."
            </p>
            <span className="font-bold text-purple-600">— Alex</span>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              "Bartering my services has been a game-changer. Fun, vibrant, and super easy to use!"
            </p>
            <span className="font-bold text-pink-500">— Maya</span>
          </div>
        </div>
      </section>
    </div>
  );
}
