import React from "react";
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
} from "lucide-react";

const RaceModal = ({ race, onClose }) => {
  if (!race) return null;

  // Cek apakah race sudah selesai
  const isPastRace = new Date(race.date) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Kontainer Utama Modal */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Tombol Close (Sticky di pojok kanan atas modal agar selalu bisa diakses) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all z-50"
        >
          <X size={20} />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50 flex flex-col">
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
            {/* Finished Badge */}
            {isPastRace && (
              <div className="absolute top-6 left-6 px-3 py-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                Finished
              </div>
            )}
          </div>

          {/* 2. Content Area (Padded) */}
          <div className="px-8 pt-14 pb-8 flex-1">
            {/* Nama & Info Utama */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white mb-2 leading-tight">
                {race.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-500" />{" "}
                  {new Date(race.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500" /> {race.location}
                </span>
              </div>
            </div>

            {/* Action Icons Row (Gaya Compact) */}
            <div className="flex flex-wrap items-center gap-3 mb-10 bg-slate-800/30 p-4 rounded-2xl border border-slate-800/50">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mr-2">
                Links
              </span>

              <div className="flex gap-2">
                {/* Website Icon */}
                {race.website_url && (
                  <a
                    href={race.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/10"
                    title="Official Website"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}

                {/* Instagram Icon */}
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

                {/* Result Icon */}
                {race.result_url && (
                  <a
                    href={race.result_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
                    title="Race Results"
                  >
                    <Award size={18} />
                  </a>
                )}

                {/* Documentation Icon */}
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

            {/* Lineup Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-500" />
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    Lineup
                  </span>
                </div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full border border-blue-500/20">
                  {race.participants} Pelari Terdaftar
                </span>
              </div>

              {race.participants > 0 ? (
                <div className="space-y-6">
                  {race.categories?.map((category) => {
                    const membersInCat = race.members?.filter(
                      (m) => m.cat === category
                    );
                    if (!membersInCat || membersInCat.length === 0) return null;
                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {category}
                          </span>
                          <div className="h-[1px] flex-1 bg-slate-800/50"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {membersInCat.map((member, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/30 group"
                            >
                              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-900/40 uppercase">
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
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 mt-4">
                  <Info size={24} className="text-slate-700 mb-2" />
                  <p className="text-slate-500 text-xs font-medium italic text-center text-balance">
                    Belum ada member yang terdaftar di race ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER (Ini tetap STICKY di bawah)
          Tombol Close Detail di bagian bawah agar user tidak perlu scroll ke atas lagi.
        */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
          <button
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
