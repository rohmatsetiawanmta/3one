// src/components/Header.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { supabase } from "../utils/supabaseClient"; // Import supabase untuk logout

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

// Menerima session prop
const Header = ({ session }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login"); // Arahkan kembali ke halaman login setelah logout
  };

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
        {/* <NavItem title="Events" to="/events" /> */}
        <NavItem title="List Race" to="/races" />
        {/* <NavItem title="Members" to="/members" /> */}

        {/* Conditional Login/Logout Link */}
        {session ? (
          <button
            onClick={handleLogout}
            className="ml-4 p-2 rounded-full hover:bg-gray-700 transition duration-200 text-red-400"
            title="Logout Admin"
          >
            <LogOut className="w-5 h-5" />
          </button>
        ) : (
          <Link
            to="/admin/login"
            className="ml-4 p-2 rounded-full hover:bg-gray-700 transition duration-200 text-yellow-400"
            title="Admin Login"
          >
            <LogIn className="w-5 h-5" />
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
