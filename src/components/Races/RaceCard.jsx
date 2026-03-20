import React from "react";
import { Calendar, MapPin, Trophy, Users, ChevronRight } from "lucide-react";

const RaceCard = ({ race, onClick }) => {
  return (
    <div
      onClick={() => onClick(race)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-800/50 bg-slate-900/40 hover:bg-blue-600/[0.02] hover:border-blue-500/30 transition-all duration-300 cursor-pointer shadow-sm overflow-hidden"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition-all"></div>

      <div className="flex items-start gap-4 mb-6 relative z-10">
        {/* Logo Event */}
        <div className="shrink-0 w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center bg-slate-800 border border-slate-700 group-hover:border-blue-500/50 transition-colors">
          {race.logo_url ? (
            <img
              src={race.logo_url}
              alt="logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <Trophy
              size={20}
              className="text-slate-500 group-hover:text-blue-400 transition-colors"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors truncate">
            {race.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {race.categories?.map((cat, index) => (
              <span
                key={index}
                className="text-[9px] px-2 py-0.5 rounded-full font-black border bg-slate-900/50 text-blue-400 border-blue-500/20 uppercase tracking-tighter"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between border-t border-slate-800/50 pt-5 mt-auto relative z-10">
        <div className="space-y-2">
          <div className="flex items-center text-slate-400 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 mr-2 text-blue-500" />
            {new Date(race.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="flex items-center text-slate-400 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 mr-2 text-blue-500" />
            {race.location}
          </div>
        </div>

        {/* Participant Stack */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex -space-x-2">
            {race.members?.slice(0, 3).map((m, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white uppercase"
              >
                {m.name.charAt(0)}
              </div>
            ))}
            {race.participants > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                +{race.participants - 3}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/10">
            <Users size={10} className="text-blue-500" />
            <span className="text-blue-400 text-[10px] font-black uppercase tracking-tighter">
              {race.participants} Joined
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
