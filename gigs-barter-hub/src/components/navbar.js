import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout, tokenCount }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800 text-white shadow-md h-16 md:h-16">
      <div className="container mx-auto flex items-center justify-between h-full px-4 md:px-6">
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold hover:text-gray-300 transition-colors duration-300"
        >
          Gig & Barter Hub
        </Link>

        <div className="flex items-center space-x-3 md:space-x-6">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Us</NavLink>

          {isLoggedIn ? (
            <>
              
              
              <NavLink to="/browse">Browse Gigs</NavLink>
              <NavLink to="/post-gig">Post a Gig</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <span className="text-sm font-medium text-yellow-400">
                Tokens: {tokenCount}
              </span>
              <button
                onClick={onLogout}
                className="bg-gray-700 hover:bg-gray-600 py-1 px-4 md:px-5 rounded-full text-sm md:text-base font-medium transition-transform transform hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gray-700 hover:bg-gray-600 py-1 px-4 md:px-5 rounded-full text-sm md:text-base font-medium transition-transform transform hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm md:text-base font-medium hover:text-gray-300 transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
