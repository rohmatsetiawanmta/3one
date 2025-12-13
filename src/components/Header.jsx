// src/components/Header.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ title, to }) => {
  const location = useLocation();
  // Gunakan regex untuk menandai '/' sebagai aktif hanya di root
  const isActive =
    location.pathname === to || (to === "/" && location.pathname === "/");

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
      {/* 1. Logo (Selalu terlihat, h-20) */}
      <Link to="/">
        <img
          src="./3One.png"
          alt="3One Runners Logo"
          className="inline h-20 mr-2"
        />
      </Link>

      {/* 2. Navigasi Desktop (Sembunyi di mobile, Tampil di md ke atas) */}
      <nav className="space-x-6 hidden md:flex items-center">
        <NavItem title="Home" to="/" />
        <NavItem title="Acara Lari" to="/events" />
        <NavItem title="Anggota" to="/members" />
      </nav>

      {/* 3. Aksi (Tombol Gabung dan Ikon Menu) */}
      <div className="flex items-center space-x-4">
        {/* Tombol Gabung (Sembunyi di xs, tampil di sm/md ke atas) */}
        <button className="bg-blue-900 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-800 hidden sm:block">
          Gabung
        </button>

        {/* Ikon Menu Burger (Tampil di mobile, Sembunyi di md ke atas) */}
        {/* CATATAN: Karena kita HANYA menggunakan CSS, ikon ini hanya placeholder
             dan TIDAK akan memunculkan menu dropdown. */}
        <button className="md:hidden text-white focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
