import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", isLogin ? "Login" : "Register", formData);
    // Nanti di sini kita tembak API PHP-nya
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
              {isLogin ? "LOGIN" : "SIGN UP"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Nama Lengkap
                </label>
                <div className="relative group/input">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="John Doe"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Alamat Email
              </label>
              <div className="relative group/input">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="runner@3one.com"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-[9px] font-black text-blue-500 uppercase hover:underline"
                  >
                    Lupa Password?
                  </button>
                )}
              </div>
              <div className="relative group/input">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 group/btn"
            >
              {isLogin ? "Login" : "Create Account"}
              <ArrowRight
                size={16}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-[11px] font-bold uppercase">
              {isLogin ? "Belum Memiliki Akun?" : "Sudah Memiliki Akun?"}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: "", password: "", fullName: "" });
              }}
              className="mt-2 text-white font-black text-xs uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
