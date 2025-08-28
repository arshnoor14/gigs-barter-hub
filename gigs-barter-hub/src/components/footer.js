import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-auto">
      <div className="container mx-auto flex justify-center space-x-6">
        <Link to="/faqs" className="text-gray-400 hover:text-white transition-colors duration-300">
          FAQs
        </Link>
        <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
          Contact Us
        </Link>
      </div>
    </footer>
  );
}