import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Instagram,
  Camera,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ChevronDown,
  Upload,
  Fingerprint,
  Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // State Form: Mixed from Users & Members
  const [formData, setFormData] = useState({
    user_full_name: user?.full_name || "", // Dari tabel users
    nickname: "", // Dari tabel members (full_name)
    phone: "", // Dari tabel members
    gender: "Male", // Dari tabel members
    instagram_handle: "", // Dari tabel members
    member_id: "", // ID record di tabel members
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfileSpecs();
  }, [user]);

  const fetchProfileSpecs = async () => {
    setFetching(true);
    try {
      // Kita panggil resource members yang sudah ter-JOIN dengan users di API
      const response = await fetch(
        `${API_URL}?resource=members&user_id=${user.id}`,
        { headers: { "X-TOKEN": SECRET_TOKEN } }
      );
      const result = await response.json();

      if (result.status === "success" && result.data) {
        const member = Array.isArray(result.data)
          ? result.data.find((m) => parseInt(m.user_id) === parseInt(user.id))
          : result.data;

        if (member) {
          setFormData({
            user_full_name: user.full_name || "", // Tetap ambil dari session user (tabel users)
            nickname: member.full_name || "", // Nama di tabel members jadi Nickname
            phone: member.phone || "",
            gender: member.gender || "Male",
            instagram_handle: member.instagram_handle || "",
            member_id: member.id,
          });
          setLogoPreview(member.photo_url || "");
        }
      }
    } catch (err) {
      console.error("Sync Protocol Failed");
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    data.append("id", formData.member_id);
    data.append("user_id", user.id);
    data.append("user_full_name", formData.user_full_name); // Untuk update tabel users
    data.append("full_name", formData.nickname); // Untuk update tabel members
    data.append("phone", formData.phone);
    data.append("gender", formData.gender);
    data.append("instagram_handle", formData.instagram_handle);

    if (logoFile) data.append("logo_file", logoFile);

    try {
      const response = await fetch(`${API_URL}?resource=members`, {
        method: "POST",
        headers: { "X-TOKEN": SECRET_TOKEN },
        body: data,
      });

      const result = await response.json();

      if (result.status === "success") {
        setMessage({
          type: "success",
          text: "Identity Specifications Applied",
        });
        // Update local session dengan nama baru dari tabel users
        const updatedSession = { ...user, full_name: formData.user_full_name };
        localStorage.setItem("user_session", JSON.stringify(updatedSession));
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Operation Failed",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Link Protocol Error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={24} />
      </div>
    );

  return (
    <div className="max-w-xl mx-auto py-10 px-4 animate-in fade-in duration-700">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 hover:text-white transition-all mb-8 group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">
          Back to System
        </span>
      </button>

      <div className="relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">
            Edit <span className="text-blue-500">Profile</span>
          </h1>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-3 rounded-xl flex items-center gap-2 border animate-in slide-in-from-top-1 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            <span className="text-[8px] font-black uppercase tracking-widest">
              {message.text}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div
              onClick={() => fileInputRef.current.click()}
              className="group relative w-24 h-24 rounded-3xl bg-slate-950 border border-dashed border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden flex items-center justify-center shadow-2xl"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt="P"
                />
              ) : (
                <Camera size={20} className="text-slate-700" />
              )}
              <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={14} className="text-white" />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest mt-3 italic">
              Avatar Spec
            </span>
          </div>

          <div className="space-y-4">
            {/* Full Name (Users Table) */}
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Fingerprint size={10} className="text-blue-500" /> Full Name
              </label>
              <input
                required
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-5 text-[10px] text-white outline-none focus:border-blue-500/50 transition-all font-bold"
                value={formData.user_full_name}
                onChange={(e) =>
                  setFormData({ ...formData, user_full_name: e.target.value })
                }
              />
            </div>

            {/* Nickname (Members Table) */}
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Tag size={10} className="text-amber-500" /> Nickname
              </label>
              <input
                className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-5 text-[10px] text-white outline-none focus:border-amber-500/50 transition-all font-bold"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData({ ...formData, nickname: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Smartphone size={10} className="text-emerald-500" /> Mobile
                </label>
                <input
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-5 text-[10px] text-white outline-none focus:border-blue-500/50"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  Gender
                </label>
                <select
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-5 text-[10px] text-white outline-none appearance-none"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="pt-2 opacity-30">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={10} /> Email Address
              </label>
              <div className="w-full bg-transparent border border-white/5 rounded-xl py-2 px-5 text-[9px] text-slate-500 font-bold italic">
                {user?.email}
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-[9px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 mt-4"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}{" "}
            Save Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
