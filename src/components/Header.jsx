import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  Users,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
  Settings,
  History,
  ChevronDown,
} from "lucide-react";

const Header = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Races", path: "/races", icon: Trophy },
    // { name: "Members", path: "/members", icon: Users },
  ];

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

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    closeMenu();
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-[120] bg-black/90 backdrop-blur-xl border-b border-white/5 h-20">
        <div className="container mx-auto px-6 h-full flex items-center justify-between max-w-7xl">
          {/* LOGO */}
          <Link to="/" onClick={closeMenu} className="relative shrink-0 group">
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
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)] animate-in fade-in zoom-in duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <div className="relative group hidden sm:flex items-center gap-3">
                {/* Badge Nama */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">
                    {user.full_name?.charAt(0) || "R"}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
                    {user.full_name || "Runner"}
                  </span>
                  <ChevronDown
                    size={14}
                    className="text-slate-500 group-hover:rotate-180 transition-transform"
                  />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-950 border border-white/10 rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-[130]">
                  <Link
                    to="/edit-profile"
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Settings size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Edit Profile
                    </span>
                  </Link>
                  <Link
                    to="/race-history"
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <History size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Race History
                    </span>
                  </Link>
                  <div className="border-t border-white/5 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/5 transition-colors w-full text-left"
                  >
                    <LogOut size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                <LogIn size={14} />
                Login
              </Link>
            )}

            {/* Menu Mobile Toggle */}
            <button
              onClick={toggleMenu}
              className="p-2 text-white md:hidden transition-colors outline-none focus:ring-0"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-[110] bg-slate-950 transition-all duration-300 flex flex-col md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-20 flex items-center justify-end px-6 shrink-0">
          <button onClick={closeMenu} className="p-2 text-white outline-none">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 space-y-3">
          {/* Tampilan Profile di Mobile (Jika Login) */}
          {user && (
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-4 p-5 rounded-3xl bg-blue-600/10 border border-blue-500/20 mb-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-lg font-black italic shadow-lg shadow-blue-600/20">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : "R"}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
                  Runner Profile
                </p>
                <p className="text-white font-black uppercase tracking-wider">
                  {user.full_name || "Athlete"}
                </p>
              </div>
              <ChevronRight
                size={20}
                className="text-blue-500 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          )}

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
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                    : "bg-slate-900/40 border-slate-800/50 text-slate-500"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-blue-500"}
                />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  {link.name}
                </span>
              </Link>
            );
          })}

          <div className="pt-6">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-between w-full px-6 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-[0.98] transition-transform"
              >
                Logout Account
                <LogOut size={16} />
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={closeMenu}
                className="flex items-center justify-between w-full px-6 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-[0.98] transition-transform"
              >
                Login
                <LogIn size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
