// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ title, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        text-sm font-medium hover:text-blue-400 transition duration-200 
        ${
          isActive
            ? "text-blue-400 font-bold border-b-2 border-blue-400"
            : "text-white"
        }
        
        /* Tambahan: Pastikan teks NavItem sejajar dengan item tetangga */
        flex items-center h-full
      `}
    >
      {title}
    </Link>
  );
};

const Header = () => {
  return (
    <header className="sticky top-0 w-full z-20 p-5 flex justify-between items-center text-white bg-black bg-opacity-90 shadow-lg">
      {/* 1. Kontainer Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src="./3One.png"
            alt="3One Runners Logo"
            className="inline h-8"
          />
        </Link>
      </div>

      {/* 2. Navigasi: Pastikan Navigasi juga Flex dan di tengah */}
      <nav className="space-x-6 flex items-center">
        <NavItem title="Home" to="/" />
        <NavItem title="Events" to="/events" />
      </nav>
    </header>
  );
};

export default Header;
