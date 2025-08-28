import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function EditGig() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchGig = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const decoded = jwtDecode(token);
        const response = await fetch(`http://localhost:5000/api/gigs/${id}`);
        const data = await response.json();

        if (response.ok) {
          if (data.user._id !== decoded.id) {
            setError("You are not authorized to edit this gig.");
            setTimeout(() => navigate('/browse'), 2000);
          } else {
            setFormData({
              title: data.title,
              description: data.description,
              price: data.price,
            });
          }
        } else {
          setError("Gig not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching gig details.");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id, navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError("You must be logged in to update a gig.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/gigs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Gig updated successfully!");
        navigate('/browse');
      } else {
        setError(data.message || "Failed to update gig.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network and try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-100 dark:bg-gray-900 text-xl font-semibold text-gray-900 dark:text-white">
        <p>Loading gig...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          Edit Gig
        </h2>
        {message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">{message}</div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields for title, description, and price */}
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Gig Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              required 
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleChange}
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
              value={formData.price}
              onChange={handleChange}
              required 
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-purple-700"
          >
            Update Gig
          </button>
        </form>
      </div>
    </div>
  );
}