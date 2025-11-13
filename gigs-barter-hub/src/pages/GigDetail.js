// src/pages/GigDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // 👈 Make sure Link is imported
import { jwtDecode } from 'jwt-decode';

// 👇 STEP 1: Accept setTokenCount as a prop
export default function GigDetail({ setTokenCount }) { 
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let loggedInUserId = null;

  if (token) {
    try {
      loggedInUserId = jwtDecode(token).id;
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/gigs/${id}`);
        if (!response.ok) {
          throw new Error('Gig not found');
        }
        const data = await response.json();
        setGig(data);

        // Check if the logged-in user is the owner
        if (loggedInUserId && data.user && data.user._id === loggedInUserId) {
          setIsOwner(true);
        }

        // Check if the user has already applied
        if (loggedInUserId) {
          const appResponse = await fetch(`http://localhost:5000/api/users/${loggedInUserId}/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (appResponse.ok) {
            const applications = await appResponse.json();
            
            // 👇 STEP 2: FIX FOR THE CRASH
            // Add "app.gig &&" to safely check for null gigs
            if (applications.some(app => app.gig && app.gig._id === id)) {
              setHasApplied(true);
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGigDetails();
  }, [id, token, loggedInUserId]);

  const handleApply = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setError('');
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/gigs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        // --- 👇 STEP 3: TOKEN LOGIC ---
        const newCount = data.remainingTokens;
        localStorage.setItem("applicationTokens", newCount); // Update localStorage
        setTokenCount(newCount); // Update global state in App.js
        // --- 👆 END TOKEN LOGIC ---

        setMessage('Application submitted successfully!');
        setHasApplied(true); // Disable button after applying
      } else {
        // Show error from backend (e.g., "Out of tokens")
        setError(data.message || 'Failed to apply');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-24 text-center">Loading gig details...</div>;
  }

  if (error && !gig) {
    return <div className="min-h-screen pt-24 text-center text-red-500">Error: {error}</div>;
  }
  
  if (!gig) {
     return <div className="min-h-screen pt-24 text-center">Gig not found.</div>;
  }

  return (
    <div className="container mx-auto p-8 pt-24 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-4xl font-extrabold text-gray-800">{gig.title}</h2>
          <span className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full font-semibold text-lg">
            {gig.price}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Posted by: <span className="font-medium text-gray-700">{gig.user ? gig.user.name : 'Unknown'}</span>
        </p>
        
        <h3 className="text-2xl font-bold text-gray-700 mb-2">Description</h3>
        <p className="text-gray-700 text-lg whitespace-pre-wrap mb-8">
          {gig.description}
        </p>

        {message && <div className="text-green-600 mb-4">{message}</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="text-center">
          {isOwner ? (
            <button
              onClick={() => navigate(`/edit-gig/${gig._id}`)}
              className="bg-gray-700 hover:bg-gray-800 text-white text-lg font-semibold py-3 px-8 rounded-lg"
            >
              Edit Your Gig
            </button>
          ) : hasApplied ? (
            <span className="text-green-600 font-semibold text-lg">✅ Applied</span>
          ) : (
            <button
              onClick={handleApply}
              disabled={!token}
              className={`bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-3 px-8 rounded-lg ${!token ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Apply Now
            </button>
          )}
          {/* Add a link to login if user is not logged in */}
          {!token && !isOwner && <p className="text-sm text-gray-500 mt-2">You must be <Link to="/login" className="text-purple-600">logged in</Link> to apply.</p>}
        </div>
      </div>
    </div>
  );
}