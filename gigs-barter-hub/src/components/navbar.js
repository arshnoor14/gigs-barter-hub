import { Link } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="bg-gray-900 text-white p-6 fixed top-0 left-0 w-full z-50 shadow-xl">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and App Name */}
        <Link to="/" className="text-2xl font-extrabold tracking-wider">
          Gig & Barter Hub
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/browse">Browse Gigs</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/post-gig">Post a Gig</NavLink>
              <NavLink to="/profile">My Profile</NavLink>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-purple-700"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// Helper component for styled navigation links
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-lg font-medium relative group transition-colors duration-300 hover:text-purple-400"
    >
      {children}
      {/* Underline hover effect */}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
    </Link>
  );
}