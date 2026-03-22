import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trophy, Users, LayoutDashboard, LogIn, Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Races", path: "/races", icon: Trophy },
    // { name: "Members", path: "/members", icon: Users },
  ];

  // Lock scroll saat menu terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* HEADER UTAMA */}
      <header className="sticky top-0 z-[100] bg-black/90 backdrop-blur-xl border-b border-white/5 h-20">
        <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-7xl">
          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="relative z-[120] shrink-0 group"
          >
            <div className="h-7 w-auto transition-transform origin-left group-hover:scale-105">
              <img
                src="./3One.png"
                alt="3One Logo"
                className="h-full w-auto object-contain block"
              />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative py-2 group/nav"
                >
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 group-hover/nav:text-slate-300"
                    }`}
                  >
                    {link.name}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ACTION & HAMBURGER */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/auth"
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <LogIn size={14} /> Login
            </Link>

            {/* Tombol Hamburger (Hanya muncul kalau menu TERTUTUP) */}
            {!isMenuOpen && (
              <button
                onClick={toggleMenu}
                className="p-2 text-white md:hidden outline-none"
              >
                <Menu size={28} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR OVERLAY */}
      <div
        className={`fixed inset-0 z-[110] bg-slate-950 transition-all duration-300 flex flex-col md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* TOMBOL CLOSE (X) - Ditaruh DI DALAM Sidebar agar PASTI di atas background hitam */}
        <div className="h-20 flex items-center justify-end px-6 shrink-0">
          <button onClick={closeMenu} className="p-2 text-white outline-none">
            <X size={28} />
          </button>
        </div>

        {/* KONTEN MENU */}
        <div className="flex-1 flex flex-col justify-center px-10 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                    : "bg-slate-900/40 border-slate-800/50 text-slate-500"
                }`}
              >
                <Icon size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  {link.name}
                </span>
              </Link>
            );
          })}

          <div className="pt-6">
            <Link
              to="/auth"
              onClick={closeMenu}
              className="flex items-center justify-between w-full px-6 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px]"
            >
              Login Account
              <LogIn size={16} />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="pb-10 text-center">
          <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.6em] opacity-40">
            3One Runners Community
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
