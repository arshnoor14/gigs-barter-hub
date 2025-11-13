import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
  console.log("Signup successful:", data);
  localStorage.setItem("token", data.token); 
  onLogin(data.user.applicationTokens); 
  navigate('/dashboard'); 
} else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred. Please check your network and try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          Create Your Account
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-purple-700"
          >
            Create Account
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account? 
          <Link to="/login" className="text-purple-600 font-bold hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;