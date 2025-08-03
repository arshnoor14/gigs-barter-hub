import React, { useState, useEffect } from 'react';

export default function MyProfile() {
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // We'll get the token from local storage after a successful login.
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    // Fetch user data from the backend to pre-fill the form
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        setError("You must be logged in to view your profile.");
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            bio: data.bio,
            skills: data.skills.join(', '), // Display skills as a comma-separated string
            location: data.location,
          });
        } else {
          setError("Failed to fetch profile data.");
        }
      } catch (err) {
        setError("Server error while fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const profileData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()), // Convert skills string back to array
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("Server error while updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
        <p className="text-xl text-gray-700 dark:text-gray-200">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">
          My Profile
        </h2>
        {message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">{message}</div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="bio" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
              placeholder="Tell us a little about yourself."
            />
          </div>
          <div>
            <label htmlFor="skills" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Skills</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Web Development, Graphic Design, Content Writing"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-lg font-medium text-gray-700 dark:text-gray-200">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., New York, NY"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-purple-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}