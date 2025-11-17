import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PostGig() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError("You must be logged in to post a gig.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Gig posted successfully!");
        setFormData({ title: '', description: '', price: '' });
        navigate('/browse');
      } else {
        setError(data.message || "Failed to post gig.");
      }
    } catch (err) {
      console.error("Post gig error:", err);
      setError("An error occurred. Please check your network and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 ">
  <div className="bg-gradient-to-br from-white via-gray-50 to-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center tracking-wide">
      Post a New Gig
    </h2>

    {message && (
      <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mb-4 rounded-md shadow-sm" role="alert">
        {message}
      </div>
    )}

    {error && (
      <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-4 rounded-md shadow-sm" role="alert">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Gig Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Website development, Logo design"
          required
          className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 hover:shadow-md"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the gig in detail..."
          rows="5"
          required
          className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 hover:shadow-md"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-lg font-semibold text-gray-700">Price / Barter Offer</label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g. $500 or Barter: Web hosting"
          required
          className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300 hover:shadow-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
      >
        Post Gig
      </button>
    </form>
  </div>
</div>

  );
}