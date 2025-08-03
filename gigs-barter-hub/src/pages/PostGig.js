import React from 'react';

export default function PostGig() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Gig posted!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          Post a New Gig
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Gig Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              placeholder="e.g. Website development, Logo design"
              required 
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="Describe the gig in detail..."
              rows="5"
              required 
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Price / Barter Offer</label>
            <input 
              type="text" 
              id="price" 
              name="price" 
              placeholder="e.g. $500 or Barter: Web hosting"
              required 
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-purple-700"
          >
            Post Gig
          </button>
        </form>
      </div>
    </div>
  );
}