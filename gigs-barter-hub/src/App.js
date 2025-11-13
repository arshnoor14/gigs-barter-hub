import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import PostGig from "./pages/PostGig";
import BrowseGigs from "./pages/BrowseGigs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import FAQs from "./pages/FAQs";
import ContactUs from "./pages/ContactUs";
import EditGig from "./pages/EditGig";
import Dashboard from "./pages/Dashboard";
import GigDetail from "./pages/GigDetail"; 
import jwtDecode from "jwt-decode";
import "./App.css";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  // 👇 NEW STATE: Initialize from localStorage
  const [tokenCount, setTokenCount] = useState(() => localStorage.getItem("applicationTokens") || 0);
  const navigate = useNavigate();

  const handleLogin = (tokens) => { // 👈 handleLogin now accepts tokens
    setIsLoggedIn(true);
    setTokenCount(tokens); // 👈 Set the count in state
    localStorage.setItem("applicationTokens", tokens); // 👈 Save to localStorage
    navigate("/"); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("applicationTokens"); // 👈 Clear tokens on logout
    setIsLoggedIn(false);
    setTokenCount(0); // 👈 Reset state
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 👇 Pass tokenCount to Navbar */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} tokenCount={tokenCount} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseGigs />} />
          {/* 👇 Pass setTokenCount to GigDetail */}
          <Route path="/gig/:id" element={<GigDetail setTokenCount={setTokenCount} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route
            path="/edit-gig/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EditGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-gig"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <PostGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
function App() {
  return <AppRoutes />;
}

export default App;
