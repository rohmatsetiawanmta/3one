import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavItem = ({ title, to, onClick }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to || (to === "/" && location.pathname === "/");

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        text-sm font-medium hover:text-blue-400 transition duration-200 
        ${
          isActive
            ? "text-blue-400 font-bold border-b-2 border-blue-400"
            : "text-white"
        }
        flex items-center
      `}
    >
      {title}
    </Link>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk menu mobile
  const closeMenu = () => setIsMenuOpen(false); // Fungsi utilitas

  return (
    <>
      <header className="sticky top-0 w-full z-20 p-5 flex justify-between items-center text-white bg-black bg-opacity-90 shadow-lg">
        <Link to="/" onClick={closeMenu}>
          <img
            src="./3One.png"
            alt="3One Runners Logo"
            className="inline h-8 mr-2"
          />
        </Link>

        <nav className="space-x-6 hidden md:flex items-center">
          <NavItem title="Home" to="/" />
          {/* <NavItem title="Acara Lari" to="/events" /> */}
          {/* <NavItem title="Anggota" to="/members" />n */}
          <NavItem title="Race List" to="/races" /> {/* Ditambahkan */}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none z-30"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed top-[74px] left-0 w-full h-full bg-gray-900 bg-opacity-95 z-40 flex flex-col p-6 space-y-4 md:hidden">
          <NavItem title="Home" to="/" onClick={closeMenu} />
          {/* <NavItem title="Acara Lari" to="/events" onClick={closeMenu} /> */}
          {/* <NavItem title="Anggota" to="/members" onClick={closeMenu} /> */}
          <NavItem title="Race List" to="/races" onClick={closeMenu} />
        </div>
      )}
    </>
  );
};

export default Header;
