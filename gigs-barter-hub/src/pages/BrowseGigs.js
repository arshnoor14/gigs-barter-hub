import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

export default function BrowseGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [appliedGigs, setAppliedGigs] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedInUserId(decoded.id);

        const fetchAppliedGigs = async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/users/${decoded.id}/applications`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setAppliedGigs(data.map(app => app.gig));
            }
          } catch (err) {
            console.error("Failed to fetch applied gigs:", err);
          }
        };
        fetchAppliedGigs();

      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }

    const fetchGigs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gigs');

        if (!response.ok) {
          throw new Error('Failed to fetch gigs');
        }

        const data = await response.json();
        setGigs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [token]);

  const handleApply = async (gigId) => {
    if (!loggedInUserId) {
        setError("You must be logged in to apply for a gig.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/gigs/${gigId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            setAppliedGigs([...appliedGigs, gigId]);
            alert("Application submitted successfully!");
        } else {
            const data = await response.json();
            setError(data.message || "Failed to submit application.");
        }
    } catch (err) {
        setError("An error occurred while submitting your application.");
    }
  };

  const handleDelete = async (gigId) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/gigs/${gigId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setGigs(gigs.filter(gig => gig._id !== gigId));
        } else {
          const data = await response.json();
          setError(data.message || "Failed to delete gig.");
        }
      } catch (err) {
        setError("An error occurred while deleting the gig.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-100 dark:bg-gray-900 text-xl font-semibold text-gray-900 dark:text-white">
        <p>Loading gigs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-100 dark:bg-gray-900 text-xl font-semibold text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 pt-20 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-10">
        Browse Gigs
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12">
        Explore gigs posted by others based on your skillset or interest.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs.length > 0 ? (
          gigs.map((gig) => (
            <div 
              key={gig._id} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
            >
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {gig.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                {gig.description}
              </p>
              <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                <span>Posted by: {gig.user ? gig.user.name : 'Unknown'}</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  {gig.price}
                </span>
              </div>
              {loggedInUserId && gig.user && gig.user._id === loggedInUserId && (
                <div className="absolute top-4 right-4 space-x-2">
                  <Link
                    to={`/edit-gig/${gig._id}`}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}

              {loggedInUserId && gig.user && gig.user._id !== loggedInUserId && !appliedGigs.includes(gig._id) && (
                  <div className="mt-4">
                    <button
                        onClick={() => handleApply(gig._id)}
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-600"
                    >
                        Apply for this Gig
                    </button>
                  </div>
              )}
              {loggedInUserId && appliedGigs.includes(gig._id) && (
                  <div className="mt-4">
                      <p className="text-center text-sm text-green-500 font-semibold">You have applied for this gig.</p>
                  </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-gray-600 dark:text-gray-300 col-span-full">No gigs found. Be the first to post one!</p>
        )}
      </div>
    </div>
  );
}