import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <ul style={{ display: "flex", gap: "20px", listStyle: "none" }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/browse">Browse Gigs</Link></li>
        <li><Link to="/post-gig">Post a Gig</Link></li>
        <li><Link to="/profile">My Profile</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>
    </nav>
  );
}
