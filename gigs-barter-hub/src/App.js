import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/navbar';
import Home from './pages/home';
import PostGig from './pages/PostGig';
import BrowseGigs from './pages/BrowseGigs';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

// This is a helper component that protects a route from unauthenticated users.
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // Redirects to the login page if the user is not logged in.
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Placeholder function for handling a successful login.
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Placeholder function for handling a logout.
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {/* The Navbar now receives the login state and logout function */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseGigs />} />
        {/* The Login component receives the login handler function */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* These routes are now protected by the ProtectedRoute component */}
        <Route
          path="/post-gig"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <PostGig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;