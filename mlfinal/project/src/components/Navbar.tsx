import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-xl font-semibold text-gray-800">BrestCare</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-pink-500">Home</Link>
            <Link to="/detection" className="text-gray-600 hover:text-pink-500">Detection</Link>
            <Link to="/chatbot" className="text-gray-600 hover:text-pink-500">Chat Assistant</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;