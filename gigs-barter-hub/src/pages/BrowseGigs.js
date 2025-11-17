import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { Link } from "react-router-dom";

export default function BrowseGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [appliedGigs, setAppliedGigs] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchQuery, setSearchQuery] = useState(""); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    let currentUserId = null; 

    const fetchAppliedGigs = async (userId, token) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setAppliedGigs(data.map(app => app.gig ? app.gig._id : null).filter(id => id !== null));
        }
      } catch (err) {
        console.error("Failed to fetch applied gigs:", err);
      }
    };

    if (token) {
      try {
        const decoded = jwtDecode(token);
        currentUserId = decoded.id; 
        setLoggedInUserId(currentUserId);
        fetchAppliedGigs(currentUserId, token);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }

    const fetchGigs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`http://localhost:5000/api/gigs?search=${searchQuery}`);
        if (!response.ok) throw new Error("Failed to fetch gigs");
        const data = await response.json();
        
       
        if (currentUserId) {
          const otherUserGigs = data.filter(gig => gig.user && gig.user._id !== currentUserId);
          setGigs(otherUserGigs);
        } else {
          setGigs(data);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [token, searchQuery]); 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-50 text-xl font-semibold text-gray-900">
        <p>Loading gigs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-50 text-xl font-semibold text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 pb-12 bg-gradient-to-br from-teal-50 via-white to-indigo-50 min-h-screen">
      <header className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Discover Opportunities
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mt-3 max-w-2xl mx-auto">
          Find gigs that match your skills. Apply, connect, and collaborate!
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); setSearchQuery(searchTerm); }} className="mt-6 max-w-lg mx-auto">
          <div className="flex rounded-lg shadow-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for 'design', 'python', 'barter'..."
              className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-r-lg"
            >
              Search
            </button>
          </div>
        </form>
      </header>

      <main>
        {gigs.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-700 mb-4">
              {searchQuery ? `No gigs found matching "${searchQuery}".` : "No gigs posted yet."}
            </p>
            <Link
              to="/post-gig"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Post a Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gigs.map((gig) => (
              <article
                key={gig._id}
                className={`flex flex-col justify-between bg-gradient-to-tr from-pink-50 via-white to-purple-50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-purple-700">{gig.title}</h3>
                    <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-semibold text-sm flex-shrink-0 ml-2">
                      {gig.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Posted by: <span className="font-medium text-gray-700">{gig.user ? gig.user.name : "Unknown"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    
                    {loggedInUserId && appliedGigs.includes(gig._id) ? (
                      <span className="text-green-600 font-semibold text-sm">✅ Applied</span>
                    ) : (
                      <Link
                        to={`/gig/${gig._id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}