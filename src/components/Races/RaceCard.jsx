import React from "react";
import { Calendar, MapPin, Trophy, Users, Edit2 } from "lucide-react";

const RaceCard = ({ race, onClick, onEdit }) => {
  // Fungsi helper untuk merender rentang tanggal (Multi-date)
  const formatDateRange = (start, end) => {
    const s = new Date(start);
    if (!end || start === end) {
      return s.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    const e = new Date(end);
    // Jika bulan dan tahun sama: "12 - 14 Mar 2026"
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return `${s.getDate()} - ${e.getDate()} ${s.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })}`;
    }
    // Jika beda bulan: "30 Mar - 1 Apr 2026"
    return `${s.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${e.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  return (
    <div
      onClick={() => onClick(race)}
      className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-800/50 bg-slate-900/40 hover:bg-blue-600/[0.02] hover:border-blue-500/30 transition-all duration-300 cursor-pointer shadow-sm overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition-all"></div>

      {/* Floating Edit Button */}
      <div className="absolute top-6 right-6 flex gap-2 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(race);
          }}
          className="p-2.5 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300 shadow-xl"
          title="Edit Race"
        >
          <Edit2 size={14} />
        </button>
      </div>

      <div className="flex items-start gap-5 mb-8 relative z-10">
        {/* Logo Event */}
        <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-800 border border-slate-700 group-hover:border-blue-500/50 transition-colors shadow-inner">
          {race.logo_url ? (
            <img
              src={race.logo_url}
              alt="logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <Trophy
              size={22}
              className="text-slate-600 group-hover:text-blue-500 transition-colors"
            />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-10">
          <h3 className="font-bold uppercase text-base md:text-lg text-white group-hover:text-blue-400 transition-colors tracking-tight">
            {race.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {race.categories?.map((cat, index) => (
              <span
                key={index}
                className="text-[9px] px-2.5 py-1 rounded-lg font-black border bg-blue-500/5 text-blue-500 border-blue-500/20 uppercase tracking-widest"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-slate-800/50 pt-6 mt-auto relative z-10">
        <div className="space-y-2.5">
          <div className="flex items-center text-slate-400 text-xs font-bold tracking-wide">
            <Calendar className="w-4 h-4 mr-2.5 text-blue-500" />
            {/* Menggunakan fungsi formatDateRange untuk menangani single & multi date */}
            {formatDateRange(race.date, race.end_date)}
          </div>
          <div className="flex items-center text-slate-400 text-xs font-bold tracking-wide">
            <MapPin className="w-4 h-4 mr-2.5 text-blue-500" />
            {race.location}
          </div>
        </div>

        {/* Participant Info & Avatar Stack */}
        <div className="flex flex-col items-end gap-3">
          {race.participants > 0 && (
            <div className="flex -space-x-2.5">
              {race.members?.slice(0, 3).map((m, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-slate-950 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-lg shadow-blue-900/40"
                  title={m.name}
                >
                  {m.name.charAt(0)}
                </div>
              ))}
              {race.participants > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-400 shadow-lg">
                  +{race.participants - 3}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/10">
            <Users size={12} className="text-blue-500" />
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
              {race.participants}{" "}
              {race.participants <= 1 ? "Runner" : "Runners"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
