// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from "react"; // 👈 Add useCallback
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function Dashboard() {
  const [profile, setProfile] = useState({});
  const [postedGigs, setPostedGigs] = useState([]);
  const [appliedGigs, setAppliedGigs] = useState([]);
  // 👇 NEW STATE to hold applications received ON your gigs
  const [applicationsOnMyGigs, setApplicationsOnMyGigs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    bio: "",
    skills: "",
    location: "",
    headline: "",
    languages: "",
    linkedin: "",
    github: "",
    website: "",
  });

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 👇 Use useCallback for this function
  const fetchDashboardData = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true); // Set loading at the start
      setError("");
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // --- Fetch Profile ---
      const profileResponse = await fetch(
        `http://localhost:5000/api/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const profileData = await profileResponse.json();
      if (profileResponse.ok) {
        setProfile(profileData);
        setProfileFormData({
          bio: profileData.bio || "", // Add || "" as fallback
          skills: profileData.skills ? profileData.skills.join(", ") : "",
          location: profileData.location || "", // Add || "" as fallback
          headline: profileData.headline || "",
          languages: profileData.languages
            ? profileData.languages.join(", ")
            : "",
          linkedin: profileData.socialLinks?.linkedin || "",
          github: profileData.socialLinks?.github || "",
          website: profileData.socialLinks?.website || "",
        });
      } else {
        setError(profileData.message || "Failed to fetch profile.");
      }

      // --- Fetch Posted Gigs ---
      const postedGigsResponse = await fetch(
        `http://localhost:5000/api/gigs/my-gigs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const postedGigsData = await postedGigsResponse.json();
      if (postedGigsResponse.ok) {
        setPostedGigs(postedGigsData);
        // 👇 NEW: After fetching gigs, fetch applications for them
        fetchApplicationsForGigs(postedGigsData, token);
      } else {
        setError(postedGigsData.message || "Failed to fetch your posted gigs.");
      }

      // --- Fetch Applied Gigs ---
      const appliedGigsResponse = await fetch(
        `http://localhost:5000/api/users/${userId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const appliedGigsData = await appliedGigsResponse.json();
      if (appliedGigsResponse.ok) {
        setAppliedGigs(appliedGigsData);
      } else {
        setError(
          appliedGigsData.message || "Failed to fetch your applications."
        );
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [navigate, token]); // 👈 Add token and navigate

  // 👇 NEW FUNCTION: Fetches applications for all the gigs you posted
  const fetchApplicationsForGigs = async (gigs, token) => {
    const allApplications = [];
    for (const gig of gigs) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/applications/gig/${gig._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const apps = await response.json();
          if (apps.length > 0) {
            allApplications.push({ gigTitle: gig.title, gigId: gig._id, applications: apps });
          }
        }
      } catch (err) {
        console.error("Failed to fetch applications for gig:", gig.title, err);
      }
    }
    setApplicationsOnMyGigs(allApplications);
  };

  // 👇 NEW FUNCTION: Handles accepting or rejecting an application
  const handleApplicationStatus = async (applicationId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Refresh the dashboard data to show the change
        fetchDashboardData();
        alert(`Application ${status}!`);
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("An error occurred.");
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // 👈 Use fetchDashboardData as dependency

  const handleProfileFormChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Make sure to filter out empty strings from skills/languages
    const updatedProfileData = {
      bio: profileFormData.bio,
      headline: profileFormData.headline,
      location: profileFormData.location,
      skills: profileFormData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      languages: profileFormData.languages.split(",").map((lang) => lang.trim()).filter(Boolean),
      socialLinks: {
        linkedin: profileFormData.linkedin,
        github: profileFormData.github,
        website: profileFormData.website,
      },
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfileData),
      });

      if (response.ok) {
        const data = await response.json(); 
        setProfile(data); // Update profile state directly
        alert("Profile updated successfully!");
        setIsEditingProfile(false);
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
  <div className="container mx-auto p-8 pt-20 bg-gray-50 min-h-screen">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-10">
      My Dashboard
    </h2>
    <div className="max-w-4xl mx-auto space-y-10">

      {/* --- MY PROFILE SECTION --- */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-xl border border-purple-300 p-8 transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold text-purple-800">My Profile</h3>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 hover:shadow-lg transition-all"
          >
            {isEditingProfile ? "Cancel" : "Edit Profile"}
          </button>
        </div>
        {isEditingProfile ? (
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            {/* Form fields... (no changes here) */}
            <div>
              <label className="block text-sm font-medium text-purple-800">Bio</label>
              <textarea
                name="bio"
                value={profileFormData.bio}
                onChange={handleProfileFormChange}
                rows="3"
                className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={profileFormData.skills}
                onChange={handleProfileFormChange}
                className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800">Location</label>
              <input
                type="text"
                name="location"
                value={profileFormData.location}
                onChange={handleProfileFormChange}
                className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800">Headline</label>
              <input
                type="text"
                name="headline"
                value={profileFormData.headline}
                onChange={handleProfileFormChange}
                className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800">Languages (comma separated)</label>
              <input
                type="text"
                name="languages"
                value={profileFormData.languages}
                onChange={handleProfileFormChange}
                className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={profileFormData.linkedin}
                onChange={handleProfileFormChange}
                className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800">GitHub</label>
              <input
                type="url"
                name="github"
                value={profileFormData.github}
                onChange={handleProfileFormChange}
                className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800">Website</label>
              <input
                type="url"
                name="website"
                value={profileFormData.website}
                onChange={handleProfileFormChange}
                className="w-full mt-2 px-4 py-2 border border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 hover:shadow-lg transition-all"
            >
              Save Profile
            </button>
          </form>
        ) : (
          <div className="space-y-3 text-purple-900 text-lg">
            {/* Profile details... (no changes here) */}
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Bio:</strong> {profile.bio || "Not specified"}</p>
            <p><strong>Skills:</strong> {profile.skills?.length ? profile.skills.join(", ") : "Not specified"}</p>
            <p><strong>Location:</strong> {profile.location || "Not specified"}</p>
            <p><strong>Headline:</strong> {profile.headline || "Not specified"}</p>
            <p><strong>Languages:</strong> {profile.languages?.length ? profile.languages.join(", ") : "Not specified"}</p>
            <p><strong>LinkedIn:</strong> {profile.socialLinks?.linkedin || "Not specified"}</p>
            <p><strong>GitHub:</strong> {profile.socialLinks?.github || "Not specified"}</p>
            <p><strong>Website:</strong> {profile.socialLinks?.website || "Not specified"}</p>
          </div>
        )}
      </div>

      {/* --- MY POSTED GIGS SECTION --- */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">My Posted Gigs</h3>
        {postedGigs.length > 0 ? (
          <ul className="space-y-4">
            {postedGigs.map((gig) => (
              <li
                key={gig._id}
                className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transform transition-transform hover:-translate-y-0.5"
              >
                <span className="text-lg text-purple-800">{gig.title}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-purple-600">{gig.price}</span>
                  <button
                    onClick={() => navigate(`/edit-gig/${gig._id}`)}
                    className="text-blue-500 hover:text-purple-800 hover:underline font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-purple-800">You have not posted any gigs yet.</p>
        )}
      </div>

      {/* --- APPLICATIONS ON MY GIGS (NEW SECTION) --- */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">Applications on Your Gigs</h3>
        {applicationsOnMyGigs.length > 0 ? (
          <ul className="space-y-6">
            {applicationsOnMyGigs.map((gigApps) => (
              <li key={gigApps.gigId}>
                <h4 className="text-xl font-semibold text-gray-700 mb-3">{gigApps.gigTitle}</h4>
                <ul className="space-y-3 pl-4">
                  {gigApps.applications.map((app) => (
                    <li key={app._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 rounded-lg border">
                      <div className="mb-2 sm:mb-0">
                        <p className="font-medium text-purple-900">{app.user ? app.user.name : "Unknown User"}</p>
                        <p className="text-sm text-gray-600">{app.user ? app.user.email : "No email"}</p>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {app.status === 'applied' ? (
                          <>
                            <button
                              onClick={() => handleApplicationStatus(app._id, 'accepted')}
                              className="text-xs bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicationStatus(app._id, 'rejected')}
                              className="text-xs bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`text-sm font-bold uppercase py-1 px-3 rounded-full ${
                              app.status === "accepted"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No applications on your gigs yet.</p>
        )}
      </div>

      {/* --- MY APPLICATIONS SECTION --- */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transform transition-transform hover:-translate-y-1 hover:shadow-2xl">
        <h3 className="text-2xl font-bold text-purple-800 mb-4">My Applications</h3>
        {appliedGigs.length > 0 ? (
          <ul className="space-y-4">
            {appliedGigs.map((application) => (
              <li
                key={application._id}
                className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transform transition-transform hover:-translate-y-0.5"
              >
                <span className="text-lg text-purple-800">
                  Gig: {application.gig?.title || "Gig not found"}
                </span>
                <span
                  className={`text-sm font-bold uppercase py-1 px-3 rounded-full ${
                    application.status === "accepted"
                      ? "bg-green-200 text-green-800"
                      : application.status === "rejected"
                      ? "bg-red-200 text-red-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {application.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">You have not applied for any gigs yet.</p>
        )}
      </div>

    </div>
  </div>
 
);
}