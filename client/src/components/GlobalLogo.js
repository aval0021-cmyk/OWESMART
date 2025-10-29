import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const GlobalLogo = () => {
  const location = useLocation();

  // Hide on landing (/) where a large logo is already shown
  if (location.pathname === '/') return null;

  return (
    <Link
      to="/"
      aria-label="Go to OweSmart home"
      className="fixed top-3 left-3 z-50"
    >
      <div className="w-12 h-12 bg-white rounded-full shadow-md grid place-items-center border border-gray-100">
        {/* Uses /public/logo.jpg if present */}
        <img
          src="/logo.jpg"
          alt="OweSmart"
          className="w-10 h-10 max-w-[40px] max-h-[40px] object-cover rounded-full"
          style={{width: '40px', height: '40px'}}
          onError={(e) => {
            // Fallback to text if image missing
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="sr-only">OweSmart</span>
      </div>
    </Link>
  );
};

export default GlobalLogo;
