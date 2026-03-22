import React from "react";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Edit2,
  ChevronRight,
} from "lucide-react";

const RaceCard = ({ race, onClick, onEdit }) => {
  const formatDateRange = (start, end) => {
    const s = new Date(start);
    if (!end || start === end) {
      return s.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    }
    const e = new Date(end);
    if (s.getMonth() === e.getMonth()) {
      return `${s.getDate()}-${e.getDate()} ${s.toLocaleDateString("id-ID", {
        month: "short",
      })}`;
    }
    return `${s.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${e.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}`;
  };

  return (
    <div
      onClick={() => onClick(race)}
      className="group relative flex items-center p-4 rounded-2xl border border-slate-800/40 bg-slate-900/40 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Mini Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/5 blur-[40px] group-hover:bg-blue-600/10 transition-all"></div>

      {/* Logo Event - Diperkecil */}
      <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-slate-800 border border-slate-700 transition-colors shadow-inner">
        {race.logo_url ? (
          <img
            src={race.logo_url}
            alt="logo"
            className="w-full h-full object-cover"
          />
        ) : (
          <Trophy
            size={18}
            className="text-slate-600 group-hover:text-blue-500 transition-colors"
          />
        )}
      </div>

      {/* Info Utama - Tengah */}
      <div className="flex-1 min-w-0 ml-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm md:text-base text-white group-hover:text-blue-400 transition-colors tracking-tight uppercase">
            {race.name}
          </h3>
        </div>

        <div className="flex flex-col items-left gap-1 mt-1">
          <div className="flex items-center text-slate-500 text-[10px] font-bold">
            <Calendar className="w-3 h-3 mr-1.5 text-blue-500/70" />
            {formatDateRange(race.date, race.end_date)}
          </div>
          <div className="flex items-center text-slate-500 text-[10px] font-bold truncate">
            <MapPin className="w-3 h-3 mr-1.5 text-blue-500/70" />
            {race.location.split(",")[0]} {/* Ambil kota saja agar ringkas */}
          </div>
        </div>
      </div>

      {/* Action Area - Kanan */}
      <div className="flex flex-col gap-1 items-end ml-2">
        {/* Avatar Stack - Lebih Kecil */}{" "}
        <span className="shrink-0 text-[8px] px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black uppercase">
          {race.participants} {race.participants === 1 ? "Runner" : "Runners"}
        </span>
        <div className="flex items-center">
          {race.participants > 0 && (
            <div className="hidden sm:flex -space-x-2">
              {/* 1. Salin, 2. Acak (Sort Random), 3. Ambil 3 */}
              {[...race.members]
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((m, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-slate-900 bg-blue-600 flex items-center justify-center text-[8px] font-black text-white uppercase shadow-sm"
                  >
                    {m.name.charAt(0)}
                  </div>
                ))}

              {race.participants > 3 && (
                <div className="w-6 h-6 rounded-full border border-slate-900 bg-slate-600 flex items-center justify-center text-[8px] font-black text-white uppercase shadow-sm">
                  {race.participants - 3}+
                </div>
              )}
            </div>
          )}
          <div className="p-2 text-slate-600 group-hover:text-blue-500 transition-colors">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>

      {/* Tombol Edit - Muncul saat Hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(race);
        }}
        className="absolute right-10 top-1/2 -translate-y-1/2 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-all z-20 shadow-xl"
      >
        <Edit2 size={12} />
      </button>
    </div>
  );
};

export default RaceCard;
