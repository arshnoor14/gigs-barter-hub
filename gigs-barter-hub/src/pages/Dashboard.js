import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [profile, setProfile] = useState({});
  const [postedGigs, setPostedGigs] = useState([]);
  const [appliedGigs, setAppliedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    bio: '',
    skills: '',
    location: ''
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchDashboardData = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setError('');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Fetch user profile
      const profileResponse = await fetch(`http://localhost:5000/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileResponse.json();
      if (profileResponse.ok) {
        setProfile(profileData);
        setProfileFormData({
          bio: profileData.bio,
          skills: profileData.skills ? profileData.skills.join(', ') : '',
          location: profileData.location,
        });
      } else {
        setError(profileData.message || 'Failed to fetch profile.');
      }

      // Fetch user's posted gigs
      const postedGigsResponse = await fetch(`http://localhost:5000/api/gigs/my-gigs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const postedGigsData = await postedGigsResponse.json();
      if (postedGigsResponse.ok) {
        setPostedGigs(postedGigsData);
      } else {
        setError(postedGigsData.message || 'Failed to fetch your posted gigs.');
      }

      // Fetch user's applied gigs
      const appliedGigsResponse = await fetch(`http://localhost:5000/api/users/${userId}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appliedGigsData = await appliedGigsResponse.json();
      if (appliedGigsResponse.ok) {
        setAppliedGigs(appliedGigsData);
      } else {
        setError(appliedGigsData.message || 'Failed to fetch your applications.');
      }

    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const handleProfileFormChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const updatedProfileData = {
      ...profileFormData,
      skills: profileFormData.skills.split(',').map(skill => skill.trim()),
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditingProfile(false);
        fetchDashboardData(); // Refresh data
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
      <div className="flex items-center justify-center min-h-screen pt-16 bg-gray-100 dark:bg-gray-900 text-xl font-semibold text-gray-900 dark:text-white">
        <p>Loading dashboard...</p>
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
        My Dashboard
      </h2>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* User Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h3>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          {isEditingProfile ? (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Bio</label>
                <textarea
                  name="bio"
                  value={profileFormData.bio}
                  onChange={handleProfileFormChange}
                  rows="3"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={profileFormData.skills}
                  onChange={handleProfileFormChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileFormData.location}
                  onChange={handleProfileFormChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                Save Profile
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              <p><strong>Bio:</strong> {profile.bio || "Not specified"}</p>
              <p><strong>Skills:</strong> {profile.skills && profile.skills.length > 0 ? profile.skills.join(', ') : "Not specified"}</p>
              <p><strong>Location:</strong> {profile.location || "Not specified"}</p>
            </div>
          )}
        </div>

        {/* My Posted Gigs Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Posted Gigs</h3>
          {postedGigs.length > 0 ? (
            <ul className="space-y-4">
              {postedGigs.map(gig => (
                <li key={gig._id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <span className="text-lg text-gray-700 dark:text-gray-300">{gig.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{gig.price}</span>
                    <button onClick={() => navigate(`/edit-gig/${gig._id}`)} className="text-blue-500 hover:underline">Edit</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">You have not posted any gigs yet.</p>
          )}
        </div>

        {/* My Applications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Applications</h3>
          {appliedGigs.length > 0 ? (
            <ul className="space-y-4">
              {appliedGigs.map(application => (
                <li key={application._id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <span className="text-lg text-gray-700 dark:text-gray-300">
Gig: {application.gig?.title || "Gig not found"}
                  </span>
                  <span className={`text-sm font-bold uppercase py-1 px-3 rounded-full ${application.status === 'accepted' ? 'bg-green-200 text-green-800' : application.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    {application.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">You have not applied for any gigs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}