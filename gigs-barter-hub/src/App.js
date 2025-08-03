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

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseGigs />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

        
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