import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const GlobalLogo = () => {
  const location = useLocation();

  // Hide on landing (/) and dashboard (/dashboard) where logos are already present
  if (location.pathname === '/' || location.pathname === '/dashboard') return null;

  return (
    <Link
      to="/"
      aria-label="Go to OweSmart home"
      className="fixed top-3 left-3 z-10"
    >
      <div className="w-12 h-12 bg-white rounded-full shadow-md grid place-items-center border border-gray-100">
        <img
          src="/logo.jpg"
          alt="OweSmart"
          className="w-10 h-10 object-cover rounded-full"
          onError={(e) => {
            // Fallback to text if image missing
            e.currentTarget.outerHTML = '<span class="text-blue-600 font-bold text-lg">O</span>';
          }}
        />
        <span className="sr-only">OweSmart</span>
      </div>
    </Link>
  );
};

export default GlobalLogo;
