// src/pages/BrowseGigs.js
import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { Link } from "react-router-dom";

export default function BrowseGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [appliedGigs, setAppliedGigs] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedInUserId(decoded.id);

        const fetchAppliedGigs = async () => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/users/${decoded.id}/applications`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              setAppliedGigs(data.map((app) => (app.gig && app.gig._id ? app.gig._id : app.gig)));
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
        const response = await fetch("http://localhost:5000/api/gigs");
        if (!response.ok) throw new Error("Failed to fetch gigs");
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAppliedGigs((prev) => [...prev, gigId]);
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
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setGigs((prev) => prev.filter((gig) => gig._id !== gigId));
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
    <div className="container mx-auto p-8 pt-24 bg-gradient-to-br from-teal-50 via-white to-indigo-50 min-h-screen">
      <header className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Browse Gigs
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mt-3 max-w-2xl mx-auto">
          Discover gigs that match your skills & passion. Apply, connect, and collaborate!
        </p>
      </header>

      <main>
        {gigs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-700 mb-4">No gigs found.</p>
            <Link
              to="/post-gig"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Post a Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gigs.map((gig, idx) => (
              <article
                key={gig._id}
                className={`relative bg-gradient-to-tr from-pink-50 via-white to-purple-50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200`}
                style={{ minHeight: "360px" }} // bigger box
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-purple-700">{gig.title}</h3>
                  <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-semibold text-sm">
                    {gig.price}
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                  {gig.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(gig.tags || gig.categories || []).slice(0, 5).map((t, tidx) => (
                    <span
                      key={tidx}
                      className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full shadow-sm"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-sm text-gray-500">
                    Posted by: <span className="font-medium text-gray-700">{gig.user ? gig.user.name : "Unknown"}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {loggedInUserId && gig.user && gig.user._id === loggedInUserId ? (
                      <>
                        <Link to={`/edit-gig/${gig._id}`} className="text-purple-600 hover:underline text-sm">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(gig._id)} className="text-red-500 hover:underline text-sm">
                          Delete
                        </button>
                      </>
                    ) : loggedInUserId && appliedGigs.includes(gig._id) ? (
                      <span className="text-green-600 font-semibold text-sm">✅ Applied</span>
                    ) : (
                      <button
                        onClick={() => handleApply(gig._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg"
                      >
                        Apply Now
                      </button>
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
