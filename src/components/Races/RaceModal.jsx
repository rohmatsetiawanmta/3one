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
  PlusCircle,
} from "lucide-react";

const RaceModal = ({ race, onClose, onRefresh }) => {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCat, setSelectedCat] = useState(race?.categories?.[0] || "");
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_URL}?resource=members`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await res.json();
      if (result.status === "success") setAllMembers(result.data);
    } catch (err) {
      console.error("Gagal mengambil daftar member:", err);
    }
  };

  useEffect(() => {
    if (showJoinForm) fetchMembers();
  }, [showJoinForm]);

  if (!race) return null;

  const isPastRace =
    new Date(race.end_date || race.date) < new Date().setHours(0, 0, 0, 0);

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    if (!end || start === end)
      return s.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    const e = new Date(end);
    if (s.getMonth() === e.getMonth())
      return `${s.getDate()} - ${e.getDate()} ${s.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      })}`;
    return `${s.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${e.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  };

  const handleAddNewMember = async () => {
    if (!search) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}?resource=members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({ full_name: search }),
      });
      const result = await res.json();
      if (result.status === "success") {
        await fetchMembers();
        setSelectedMember(result.data);
        setSearch("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedMember || !selectedCat) return;
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}?resource=registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({
          race_id: race.id,
          member_id: selectedMember.id,
          category: selectedCat,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setShowJoinForm(false);
        setSelectedMember(null);
        if (onRefresh) onRefresh();
      } else {
        alert(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseTrigger = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  const filteredMembers = allMembers.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in"
        onClick={handleCloseTrigger}
      ></div>

      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in">
        <button
          type="button"
          onClick={handleCloseTrigger}
          className="absolute top-6 right-6 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white z-50"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-slate-900/50">
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
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-2 leading-tight tracking-tight">
                {race.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500" />{" "}
                  {formatDateRange(race.date, race.end_date)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500" /> {race.location}
                </span>
              </div>
            </div>

            {/* --- ACTION ICONS ROW (INI YANG SEMPAT ILANG) --- */}
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
                    className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-xl hover:bg-blue-400 transition-all shadow-lg"
                    title="Website"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                {race.social_url && (
                  <a
                    href={`https://${race.social_url.replace("https://", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-slate-800 text-white border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all"
                    title="Instagram"
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
                    title="Results"
                  >
                    <Award size={18} />
                  </a>
                )}
                {race.doc_url && (
                  <a
                    href={race.doc_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-slate-800 text-white border border-slate-700 rounded-xl hover:border-blue-500/50 transition-all"
                    title="Documentation"
                  >
                    <ImageIcon size={18} />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-500" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    3One Lineup
                  </span>
                </div>
                {!showJoinForm && (
                  <button
                    type="button"
                    onClick={() => setShowJoinForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-xl uppercase tracking-widest transition-all shadow-lg"
                  >
                    <UserPlus size={14} /> Join Race
                  </button>
                )}
              </div>

              {showJoinForm ? (
                <div className="bg-slate-800/40 border border-blue-500/20 rounded-[2rem] p-6 space-y-6 animate-in slide-in-from-top-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                      Select Runner
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowJoinForm(false)}
                      className="text-slate-500 text-[10px] font-black uppercase"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        size={14}
                      />
                      <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {filteredMembers.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 pb-1">
                          {filteredMembers.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => setSelectedMember(m)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                selectedMember?.id === m.id
                                  ? "bg-blue-600 border-blue-400"
                                  : "bg-slate-900 border-slate-700 hover:border-slate-500"
                              }`}
                            >
                              <span className="text-[10px] font-bold text-white truncate pr-1">
                                {m.full_name}
                              </span>
                              {selectedMember?.id === m.id && (
                                <Check
                                  size={12}
                                  className="text-white shrink-0"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        search && (
                          <button
                            type="button"
                            onClick={handleAddNewMember}
                            className="w-full p-4 rounded-xl border border-dashed border-blue-500/50 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 transition-all flex flex-col items-center gap-2"
                          >
                            <PlusCircle size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-center">
                              Add "{search}" as New Member
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {race.categories?.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCat(cat)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${
                            selectedCat === cat
                              ? "bg-white text-black border-white"
                              : "bg-slate-900 text-slate-400 border-slate-700"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!selectedMember || submitting}
                    type="button"
                    onClick={handleJoinSubmit}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
                  >
                    {submitting ? "Processing..." : "Confirm Join"}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {race.participants > 0 ? (
                    race.categories?.map((category) => {
                      const membersInCat = race.members?.filter(
                        (m) => m.cat === category
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
                                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/30"
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
                    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-[2.5rem] border border-dashed border-slate-800 bg-slate-900/50 text-center">
                      <Info size={24} className="text-slate-700 mb-2" />
                      <p className="text-slate-500 text-[11px] font-medium italic">
                        Belum ada lineup untuk race ini.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={handleCloseTrigger}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-[0.2em]"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceModal;
