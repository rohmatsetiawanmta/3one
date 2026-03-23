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
  History,
  Settings,
  Trophy,
  MapPin,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("edit"); // "edit" atau "recap"
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userRaces, setUserRaces] = useState([]);

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
    fetchProfileAndRaces();
  }, [user]);

  const fetchProfileAndRaces = async () => {
    setFetching(true);
    try {
      // 1. Ambil Data Member (untuk Form Edit)
      const resMember = await fetch(
        `${API_URL}?resource=members&user_id=${user.id}`,
        {
          headers: { "X-TOKEN": SECRET_TOKEN },
        }
      );
      const memberResult = await resMember.json();

      if (memberResult.status === "success" && memberResult.data) {
        const member = Array.isArray(memberResult.data)
          ? memberResult.data.find((m) => m.user_id === user.id)
          : memberResult.data;

        if (member) {
          setFormData({
            full_name: member.full_name,
            email: user.email,
            instagram_handle: member.instagram_handle || "",
            photo_url: member.photo_url || "",
          });
        }
      }

      const resRecap = await fetch(
        `${API_URL}?resource=recap_race&id=${user.id}`,
        {
          headers: { "X-TOKEN": SECRET_TOKEN },
        }
      );
      const recapResult = await resRecap.json();

      if (recapResult.status === "success") {
        setUserRaces(recapResult.data);
      }
    } catch (err) {
      console.error("Gagal memuat data");
    } finally {
      setFetching(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        localStorage.setItem(
          "user_session",
          JSON.stringify({ ...user, full_name: formData.full_name })
        );
      }
    } catch (err) {
      setMessage({ type: "error", text: "Gagal terhubung ke server" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-blue-500/30 overflow-hidden flex items-center justify-center">
            {formData.photo_url ? (
              <img
                src={formData.photo_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-slate-700" />
            )}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            {formData.full_name || "Runner Name"}
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            {user.email}
          </p>
        </div>
      </div>

      {/* TABS MENU */}
      <div className="flex gap-2 p-1 bg-slate-900/50 border border-white/5 rounded-2xl mb-8 w-fit">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === "edit"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Settings size={14} /> Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("recap")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === "recap"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <History size={14} /> Recap Race
        </button>
      </div>

      {/* CONTENT TAB: EDIT PROFILE */}
      {activeTab === "edit" && (
        <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Instagram
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                  value={formData.instagram_handle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instagram_handle: e.target.value,
                    })
                  }
                  placeholder="@username"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
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
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Save size={18} /> Simpan Profil
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* =========================================================================
   CONTENT TAB: RECAP RACE (Ganti bagian Render activeTab === "recap")
   ========================================================================= */}
      {activeTab === "recap" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {userRaces.length > 0 ? (
            userRaces.map((race) => (
              <div
                key={race.race_id}
                className="relative group overflow-hidden"
              >
                {/* Efek Glow & Border Modern */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>

                <div className="relative bg-slate-950 border border-white/5 p-7 rounded-3xl flex flex-col gap-6 h-full shadow-xl">
                  {/* Bagian Atas: Tanggal & Nama Race */}
                  <div className="flex items-start gap-5">
                    {/* Badge Tanggal yang Menonjol (Mudah dibaca) */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-slate-900 border border-white/5 rounded-2xl p-2 text-center shadow-inner">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest opacity-80">
                        {new Date(race.race_date).toLocaleDateString("id-ID", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-3xl font-black text-white leading-none mt-1 tracking-tighter">
                        {new Date(race.race_date).getDate()}
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 mt-1">
                        {new Date(race.race_date).getFullYear()}
                      </span>
                    </div>

                    {/* Detail Info Race */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-blue-500 shrink-0" />
                        <h3 className="text-base font-black text-white uppercase tracking-tight leading-tight italic">
                          {race.race_name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={13} className="shrink-0" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          {race.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bagian Bawah: Kategori & Status (Dipisah agar rapi) */}
                  <div className="mt-auto pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Kategori
                      </span>
                    </div>

                    <div className="px-5 py-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full text-[11px] font-black uppercase tracking-widest shadow-inner">
                      {race.category_selected || "N/A"}
                    </div>
                  </div>

                  {/* Dekorasi Garis Halus di Sudut */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-5 pointer-events-none">
                    <div className="absolute top-4 right-4 w-full h-full border-t-2 border-r-2 border-blue-500 rounded-tr-3xl"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 text-center py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-[2.5rem]">
              <History size={40} className="mx-auto text-slate-800 mb-4" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Belum ada riwayat race yang tercatat.
              </p>
              <p className="text-[9px] text-slate-700 mt-2">
                Race yang kamu ikuti akan muncul di sini.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
