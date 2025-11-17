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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-xl font-semibold text-gray-900 dark:text-white">
        <p>Loading gig...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
  <div className="bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-yellow-200">
    <h2 className="text-4xl font-extrabold text-yellow-600 mb-6 text-center tracking-wide">
      Edit Gig
    </h2>

    {message && (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded-md shadow-sm" role="alert">
        {message}
      </div>
    )}

    {error && (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-4 rounded-md shadow-sm" role="alert">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-lg font-semibold text-yellow-700">Gig Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full mt-1 px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 hover:border-yellow-400"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-lg font-semibold text-yellow-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          required
          className="w-full mt-1 px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 hover:border-yellow-400"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-lg font-semibold text-yellow-700">Price / Barter Offer</label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full mt-1 px-4 py-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 hover:border-yellow-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 hover:from-yellow-500 hover:to-yellow-400"
      >
        Update Gig
      </button>
    </form>
  </div>
</div>

  );
}