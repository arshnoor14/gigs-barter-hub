import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './pages/home';
import PostGig from './pages/PostGig';
import BrowseGigs from './pages/BrowseGigs';
import MyProfile from './pages/MyProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseGigs />} />
        <Route path="/post-gig" element={<PostGig />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
