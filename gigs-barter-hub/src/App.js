import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import PostGig from "./pages/PostGig";
import BrowseGigs from "./pages/BrowseGigs";
import MyProfile from "./pages/MyProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import FAQs from "./pages/FAQs";
import ContactUs from "./pages/ContactUs";
import EditGig from "./pages/EditGig";
import Dashboard from "./pages/Dashboard";
import jwtDecode from "jwt-decode";
import "./App.css";

// -------------------------
// ProtectedRoute Component
// -------------------------
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// -------------------------
// App Routes
// -------------------------
function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // called after successful login/signup
  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/"); // redirect to home (optional)
  };

  // called when user clicks logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseGigs />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protected Routes */}
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
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <MyProfile />
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

// -------------------------
// Main App Component
// -------------------------
function App() {
  return <AppRoutes />;
}

export default App;
