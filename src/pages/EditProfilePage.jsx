// src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    instagram_handle: "",
    photo_url: "",
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchMemberData();
  }, [user]);

  const fetchMemberData = async () => {
    try {
      const response = await fetch(
        `${API_URL}?resource=members&user_id=${user.id}`,
        {
          headers: { "X-TOKEN": SECRET_TOKEN },
        }
      );
      const result = await response.json();
      if (result.status === "success" && result.data) {
        const member = Array.isArray(result.data)
          ? result.data.find((m) => m.user_id === user.id)
          : result.data;

        if (member) {
          setFormData({
            full_name: member.full_name,
            email: user.email,
            instagram_handle: member.instagram_handle || "",
            photo_url: member.photo_url || "",
          });
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data profil");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${API_URL}?resource=members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({ ...formData, user_id: user.id }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
        // Update session di localStorage
        const updatedSession = { ...user, full_name: formData.full_name };
        localStorage.setItem("user_session", JSON.stringify(updatedSession));
      } else {
        setMessage({
          type: "error",
          text: result.message || "Gagal memperbarui profil",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Kesalahan koneksi ke server" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          Kembali
        </span>
      </button>

      <div className="relative bg-slate-950 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
            Edit Profile
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            Update your information
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest">
              {message.text}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Instagram Handle
              </label>
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                value={formData.instagram_handle}
                onChange={(e) =>
                  setFormData({ ...formData, instagram_handle: e.target.value })
                }
                placeholder="@username"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Photo URL
              </label>
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                value={formData.photo_url}
                onChange={(e) =>
                  setFormData({ ...formData, photo_url: e.target.value })
                }
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
