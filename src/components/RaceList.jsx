import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  ChevronRight,
  Trophy,
  Clock,
  CheckCircle2,
  Users,
  X,
} from "lucide-react";

const RaceList = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedRace, setSelectedRace] = useState(null); // State untuk Modal

  const dummyRaces = [
    // --- UPCOMING RACES (Masa Depan) ---
    {
      id: 1,
      name: "3One Internal Fun Run",
      date: "2026-03-25",
      location: "GBK, Jakarta",
      categories: ["5K", "10K"],
      participants: 4,
      members: [
        { name: "Rohmat", cat: "10K" },
        { name: "Adit", cat: "5K" },
        { name: "Siska", cat: "5K" },
        { name: "Dewi", cat: "10K" },
      ],
    },
    {
      id: 2,
      name: "Bali 10K Summer Run",
      date: "2026-05-10",
      location: "Kuta, Bali",
      categories: ["10K"],
      participants: 3,
      members: [
        { name: "Budi", cat: "10K" },
        { name: "Santi", cat: "10K" },
        { name: "Hendrik", cat: "10K" },
      ],
    },
    {
      id: 3,
      name: "Surabaya Heritage Run",
      date: "2026-07-05",
      location: "Tugu Pahlawan, Surabaya",
      categories: ["5K", "10K"],
      participants: 5,
      members: [
        { name: "Robby", cat: "10K" },
        { name: "Maya", cat: "5K" },
        { name: "Fajar", cat: "10K" },
        { name: "Anton", cat: "5K" },
        { name: "Sari", cat: "10K" },
      ],
    },
    {
      id: 4,
      name: "Bandung Ultra Marathon",
      date: "2026-06-15",
      location: "Lembang, Bandung",
      categories: ["Ultra", "50K", "100K"],
      participants: 2,
      members: [
        { name: "Gilang", cat: "50K" },
        { name: "Hendra", cat: "100K" },
      ],
    },
    {
      id: 5,
      name: "Mandalika Coast Run",
      date: "2026-09-20",
      location: "Lombok, NTB",
      categories: ["10K", "HM"],
      participants: 3,
      members: [
        { name: "Putu", cat: "HM" },
        { name: "Made", cat: "10K" },
        { name: "Nyoman", cat: "HM" },
      ],
    },

    // --- PAST RACES (DONE) ---
    {
      id: 6,
      name: "Borobudur Marathon 2024",
      date: "2024-12-01",
      location: "Magelang, Jawa Tengah",
      categories: ["10K", "HM", "FM"],
      participants: 6,
      members: [
        { name: "Rohmat", cat: "FM" },
        { name: "Adit", cat: "FM" },
        { name: "Budi", cat: "HM" },
        { name: "Siti", cat: "HM" },
        { name: "Eko", cat: "10K" },
        { name: "Agus", cat: "10K" },
      ],
    },
    {
      id: 7,
      name: "Jakarta Half Marathon",
      date: "2024-10-20",
      location: "Monas, Jakarta",
      categories: ["5K", "10K", "HM"],
      participants: 4,
      members: [
        { name: "Andi", cat: "HM" },
        { name: "Rina", cat: "10K" },
        { name: "Doni", cat: "HM" },
        { name: "Lia", cat: "5K" },
      ],
    },
    {
      id: 8,
      name: "Pocari Sweat Run 2024",
      date: "2024-07-21",
      location: "Gedung Sate, Bandung",
      categories: ["5K", "10K", "HM", "FM"],
      participants: 8,
      members: [
        { name: "Rohmat", cat: "HM" },
        { name: "Siska", cat: "10K" },
        { name: "Fifi", cat: "5K" },
        { name: "Gani", cat: "FM" },
        { name: "Hilda", cat: "HM" },
        { name: "Irfan", cat: "10K" },
        { name: "Joko", cat: "FM" },
        { name: "Kiki", cat: "5K" },
      ],
    },
    {
      id: 9,
      name: "Maybank Marathon Bali 2024",
      date: "2024-08-25",
      location: "Gianyar, Bali",
      categories: ["10K", "HM", "FM"],
      participants: 3,
      members: [
        { name: "Luthfi", cat: "FM" },
        { name: "Mona", cat: "HM" },
        { name: "Nanda", cat: "10K" },
      ],
    },
    {
      id: 10,
      name: "Semarang 10K",
      date: "2024-12-15",
      location: "Kota Lama, Semarang",
      categories: ["10K"],
      participants: 2,
      members: [
        { name: "Oky", cat: "10K" },
        { name: "Prita", cat: "10K" },
      ],
    },
    {
      id: 11,
      name: "BFI Run 2024",
      date: "2024-06-23",
      location: "BSD City, Tangerang",
      categories: ["5K", "10K", "HM"],
      participants: 3,
      members: [
        { name: "Qori", cat: "HM" },
        { name: "Rendy", cat: "10K" },
        { name: "Sari", cat: "5K" },
      ],
    },
    {
      id: 12,
      name: "LPS Monas Half Marathon",
      date: "2024-06-30",
      location: "Monas, Jakarta",
      categories: ["HM"],
      participants: 2,
      members: [
        { name: "Tono", cat: "HM" },
        { name: "Uli", cat: "HM" },
      ],
    },
    {
      id: 13,
      name: "Samosir Music International Run",
      date: "2024-08-10",
      location: "Pangururan, Samosir",
      categories: ["5K", "10K"],
      participants: 2,
      members: [
        { name: "Vino", cat: "10K" },
        { name: "Wanda", cat: "5K" },
      ],
    },
    {
      id: 14,
      name: "Solo Batik Marathon",
      date: "2024-05-12",
      location: "Manahan, Solo",
      categories: ["10K", "HM", "FM"],
      participants: 3,
      members: [
        { name: "Xena", cat: "FM" },
        { name: "Yanto", cat: "HM" },
        { name: "Zizi", cat: "10K" },
      ],
    },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredRaces = dummyRaces.filter((race) => {
    const raceDate = new Date(race.date);
    return activeTab === "upcoming" ? raceDate >= today : raceDate < today;
  });

  const groupedRaces = filteredRaces
    .sort((a, b) =>
      activeTab === "upcoming"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    )
    .reduce((groups, race) => {
      const date = new Date(race.date);
      const monthYear = date.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
      if (!groups[monthYear]) groups[monthYear] = [];
      groups[monthYear].push(race);
      return groups;
    }, {});

  return (
    <div className="space-y-8">
      {/* TABS */}
      <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "upcoming"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Clock size={16} /> Upcoming
        </button>
        <button
          onClick={() => setActiveTab("done")}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === "done"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <CheckCircle2 size={16} /> Done
        </button>
      </div>

      {/* GRID CONTAINER */}
      <div className="space-y-12">
        {Object.keys(groupedRaces).length > 0 ? (
          Object.keys(groupedRaces).map((monthYear) => (
            <div key={monthYear} className="space-y-5">
              <div className="flex items-center gap-4">
                <h2 className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em] whitespace-nowrap">
                  {monthYear}
                </h2>
                <div className="h-[1px] w-full bg-slate-800/50"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedRaces[monthYear].map((race) => (
                  <div
                    key={race.id}
                    onClick={() => setSelectedRace(race)} // Buka Modal
                    className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-800/50 bg-slate-900/40 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Trophy size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm md:text-base text-white group-hover:text-blue-400 transition-colors truncate">
                          {race.name}
                        </h3>

                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {race.categories.map((cat, index) => (
                            <span
                              key={index}
                              className={`text-[8px] px-1.5 py-0.5 rounded font-bold border ${
                                activeTab === "upcoming"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : "bg-slate-800 text-slate-500 border-slate-700"
                              }`}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between border-t border-slate-800/50 pt-4 mt-auto">
                      <div className="space-y-1.5">
                        <span className="flex items-center text-slate-400 text-[11px] md:text-xs">
                          <Calendar className="w-3 h-3 mr-2 text-blue-500" />
                          {new Date(race.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center text-slate-400 text-[11px] md:text-xs">
                          <MapPin className="w-3 h-3 mr-2 text-blue-500" />
                          {race.location}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-white font-bold text-sm leading-none">
                          {race.participants}
                        </span>
                        <span className="text-slate-500 text-[9px] uppercase font-bold tracking-tighter">
                          Runners
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} className="text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
            <p className="text-slate-500 italic">Belum ada jadwal lomba.</p>
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {selectedRace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedRace(null)}
          ></div>

          {/* Content */}
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {selectedRace.name}
                </h2>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <MapPin size={14} className="text-blue-500" />{" "}
                  {selectedRace.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedRace(null)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users size={18} className="text-blue-500" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Lineup Pelari ({selectedRace.members?.length || 0})
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedRace.members?.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-200">
                        {member.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                      {member.cat}
                    </span>
                  </div>
                ))}

                {!selectedRace.members?.length && (
                  <p className="text-slate-500 text-center py-4 italic">
                    Belum ada anggota yang terdaftar.
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <button
                onClick={() => setSelectedRace(null)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors uppercase text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceList;
