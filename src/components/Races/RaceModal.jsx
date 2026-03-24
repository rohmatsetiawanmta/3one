import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Instagram,
  Trophy,
  Award,
  Image as ImageIcon,
  Info,
  UserPlus,
  Check,
  Search,
  Loader2,
  Image,
  Globe,
} from "lucide-react";

const RaceModal = ({ race, onClose, onRefresh, user }) => {
  // --- STATE MANAGEMENT ---
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedCat, setSelectedCat] = useState(race?.categories?.[0] || "");
  const [submitting, setSubmitting] = useState(false);

  // API Config
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  if (!race) return null;

  const isPastRace = new Date(race.date) < new Date().setHours(0, 0, 0, 0);

  // Handler Join Race (Logika Baru: Otomatis sesuai user session)
  const handleJoinSubmit = async () => {
    if (!user || submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}?resource=join_race`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({
          race_id: race.id,
          user_id: user.id, // Ambil dari props user (App.jsx)
          token: user.session_token, // Validasi keamanan server
          category: selectedCat,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert(`Berhasil mendaftar ke kategori ${selectedCat}!`);
        setShowJoinForm(false);
        if (onRefresh) onRefresh();
      } else {
        alert(result.message || "Gagal bergabung");
      }
    } catch (error) {
      console.error("Error joining race:", error);
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all z-50"
        >
          <X size={20} />
        </button>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-slate-900/50">
          {/* Header Banner Area (UI AWAL) */}
          <div
            className={`h-36 shrink-0 bg-gradient-to-br ${
              isPastRace
                ? "from-slate-700 to-slate-900"
                : "from-blue-600 to-blue-900"
            } relative`}
          >
            <div className="absolute -bottom-10 left-8 w-20 h-20 rounded-3xl bg-slate-900 border-4 border-slate-900 overflow-hidden shadow-xl z-10">
              {race.logo_url ? (
                <img
                  src={race.logo_url}
                  className="w-full h-full object-cover"
                  alt="Logo"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <Trophy
                    className={isPastRace ? "text-slate-500" : "text-blue-500"}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="px-8 pt-14 pb-8 flex-1">
            {/* Race Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-2 leading-tight tracking-tight uppercase italic">
                {race.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500" /> {race.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500" /> {race.location}
                </span>
              </div>
            </div>

            {/* Action Icons Row */}
            <div className="flex flex-wrap items-center gap-3 mb-10 bg-slate-800/30 p-4 rounded-[2rem] border border-slate-800/50">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mr-2">
                Links
              </span>
              <div className="flex gap-2">
                {race.website_url && (
                  <a
                    href={race.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-slate-800 text-white border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all"
                  >
                    <Globe size={18} />
                  </a>
                )}
                {race.social_url && (
                  <a
                    href={race.social_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-slate-800 text-white border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {race.result_url && (
                  <a
                    href={race.result_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg"
                  >
                    <Award size={18} />
                  </a>
                )}
                {race.doc_url && (
                  <a
                    href={race.doc_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg"
                  >
                    <Image size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Lineup & Join Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-500" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    3One Lineup
                  </span>
                </div>
                {!showJoinForm && !isPastRace && user && (
                  <button
                    onClick={() => setShowJoinForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-blue-900/20"
                  >
                    <UserPlus size={14} /> Join Race
                  </button>
                )}
              </div>

              {/* Inline Join Form (LOGIKA BARU - HANYA PILIH KATEGORI) */}
              {showJoinForm ? (
                <div className="bg-slate-800/40 border border-blue-500/20 rounded-[2rem] p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                      Confirm Registration
                    </h3>
                    <button
                      onClick={() => setShowJoinForm(false)}
                      className="text-slate-500 hover:text-white text-[10px] font-black uppercase"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                      Registering as
                    </p>
                    <p className="text-xs font-bold text-white uppercase italic">
                      {user?.member_name}
                    </p>
                  </div>

                  {/* Select Category */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Choose Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {race.categories?.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCat(cat)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${
                            selectedCat === cat
                              ? "bg-white text-black border-white"
                              : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={submitting}
                    onClick={handleJoinSubmit}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Check size={14} />
                    )}
                    {submitting ? "Processing..." : "Confirm Join"}
                  </button>
                </div>
              ) : (
                /* Lineup List Grouped by Category (UI AWAL) */
                <div className="space-y-8">
                  {race.participants > 0 ? (
                    race.categories?.map((category) => {
                      const membersInCat = race.members?.filter(
                        (m) => (m.category || m.cat) === category
                      );
                      if (!membersInCat || membersInCat.length === 0)
                        return null;
                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              {category}
                            </span>
                            <div className="h-[1px] flex-1 bg-slate-800/50"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {membersInCat.map((member, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/30 group hover:bg-slate-800/60 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-lg shadow-blue-900/40">
                                  {member.name.charAt(0)}
                                </div>
                                <span className="font-bold text-slate-200 text-xs truncate">
                                  {member.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-[2.5rem] border border-dashed border-slate-800 bg-slate-900/50">
                      <Info size={24} className="text-slate-700 mb-2" />
                      <p className="text-slate-500 text-[11px] font-medium italic text-center uppercase tracking-widest">
                        Lineup is currently empty
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Static Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-colors uppercase text-[10px] tracking-[0.2em]"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceModal;
