import React, { useState, useEffect } from "react";
import {
  Trophy,
  ChevronRight,
  ArrowLeft,
  Timer,
  Award,
  Save,
  Loader2,
  Search,
  Calendar,
  CheckCircle,
  Filter,
  Hash,
  ExternalLink,
} from "lucide-react";

const ResultManagement = () => {
  const [pastRaces, setPastRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnfilledOnly, setShowUnfilledOnly] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  useEffect(() => {
    fetchPastRaces();
  }, []);

  // STEP 1: Ambil semua race (Filter race yang sudah lewat dilakukan di UI atau bisa di API)
  const fetchPastRaces = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?resource=races`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await res.json();
      // Filter hanya race yang tanggalnya sudah lewat (CURDATE)
      const today = new Date().toISOString().split("T")[0];
      const past = (result.data || []).filter((r) => r.date < today);
      setPastRaces(past);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  // STEP 2: Ambil Detail Race + Peserta (Satu kali panggil ke resource=races&id=X)
  const fetchRaceDetail = async (race) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?resource=races&id=${race.id}`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await res.json();

      if (result.status === "success") {
        const raceData = result.data;
        setSelectedRace(raceData);
        // participants_list datang dari SQL JOIN yang kita buat di api.php
        setRegistrations(raceData.participants_list || []);
      }
    } catch (err) {
      console.error("Detail fetch error:", err);
    }
    setLoading(false);
  };

  const handleUpdateParticipant = async (regId, netTime, bib) => {
    try {
      const res = await fetch(`${API_URL}?resource=registrations&id=${regId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({ net_time: netTime, bib_number: bib }),
      });
      const result = await res.json();
      if (result.status === "success") {
        // Update state lokal agar progress bar & UI langsung berubah
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === regId ? { ...r, net_time: netTime, bib_number: bib } : r
          )
        );
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Statistik Real-time berdasarkan state registrations
  const total = registrations.length;
  const filled = registrations.filter(
    (r) => r.net_time && r.net_time !== ""
  ).length;
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0;

  // Filter Search & Unfilled
  const filtered = registrations.filter((r) => {
    const matchSearch = r.member_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchFilter = showUnfilledOnly
      ? !r.net_time || r.net_time === ""
      : true;
    return matchSearch && matchFilter;
  });

  if (loading && !selectedRace)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* HEADER SECTION */}
      <div className="mb-10">
        {selectedRace && (
          <button
            onClick={() => {
              setSelectedRace(null);
              setSearchQuery("");
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-white mb-4 transition-colors text-[10px] font-black uppercase tracking-widest group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Race List
          </button>
        )}
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
          Result Management{selectedRace ? `: ${selectedRace.name}` : ""}
        </h1>
      </div>

      {!selectedRace ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastRaces.map((race) => (
            <button
              key={race.id}
              onClick={() => fetchRaceDetail(race)}
              className="bg-slate-950 border border-white/5 p-6 rounded-[2.5rem] hover:border-blue-500/40 transition-all text-left group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Trophy size={20} />
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    race.completion_rate === 100
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-blue-600/10 text-blue-400"
                  }`}
                >
                  {race.completion_rate || 0}% Done
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">
                {race.date}
              </div>
              <div className="text-xl font-black text-white uppercase italic leading-tight mb-4 group-hover:text-blue-400 transition-colors">
                {race.name}
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ${
                    race.completion_rate === 100
                      ? "bg-emerald-500"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${race.completion_rate || 0}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* SINGLE UNIFIED HEADER CARD */}
          <div className="bg-slate-950 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            {/* Subtle Background Glow */}
            <div
              className={`absolute -right-20 -top-20 w-64 h-64 blur-[100px] opacity-10 transition-colors duration-1000 ${
                percent === 100 ? "bg-emerald-500" : "bg-blue-600"
              }`}
            ></div>

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              {/* 1. PERSENTASE */}
              <div className="shrink-0 text-center md:text-left">
                <div
                  className={`text-5xl font-black italic tracking-tighter leading-none ${
                    percent === 100 ? "text-emerald-500" : "text-white"
                  }`}
                >
                  {percent}%
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2 ml-1">
                  Status
                </div>
              </div>

              {/* 2. COMPLETION BAR (PANJANG) */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-3 px-1">
                  <div className="flex items-center gap-3">
                    <Trophy
                      size={16}
                      className={
                        percent === 100 ? "text-emerald-500" : "text-blue-500"
                      }
                    />
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">
                      Official Race Results
                    </h3>
                  </div>
                  <div className="text-[11px] font-black text-white">
                    {filled}{" "}
                    <span className="text-slate-600">/ {total} Runners</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      percent === 100
                        ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                        : "bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    }`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>

              {/* 3. ACTION BUTTON */}
              <div className="shrink-0 w-full md:w-auto">
                {selectedRace.result_url ? (
                  <a
                    href={selectedRace.result_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-blue-600/40 active:scale-95 group/btn"
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      View Results
                    </span>
                    <ExternalLink
                      size={16}
                      className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                    />
                  </a>
                ) : (
                  <div className="text-[10px] font-black text-slate-700 uppercase italic border border-white/5 px-6 py-4 rounded-2xl text-center">
                    No URL
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Find runner name..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowUnfilledOnly(!showUnfilledOnly)}
              className={`px-6 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${
                showUnfilledOnly
                  ? "bg-orange-500/20 border-orange-500/50 text-orange-500"
                  : "bg-slate-950 border-white/5 text-slate-500 hover:text-white"
              }`}
            >
              {showUnfilledOnly ? "Showing Unfilled" : "Show All Runners"}
            </button>
          </div>

          {/* COMPACT TABLE */}
          <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-6 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Runner Name
                    </th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Cat
                    </th>
                    <th className="px-6 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest w-40">
                      Net Time
                    </th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-widest w-32">
                      BIB
                    </th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover:bg-white/[0.01] transition-colors group"
                    >
                      <td className="px-6 py-4 font-black text-white uppercase italic tracking-tight text-sm">
                        {reg.member_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {reg.category_selected}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative">
                          <Timer
                            size={12}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                          />
                          <input
                            type="text"
                            defaultValue={reg.net_time}
                            placeholder="00:00:00"
                            className="bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-8 pr-2 text-[11px] font-black text-emerald-400 w-full outline-none focus:border-emerald-500/50"
                            onBlur={(e) => (reg.newTime = e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative">
                          <Hash
                            size={12}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                          />
                          <input
                            type="text"
                            defaultValue={reg.bib_number}
                            placeholder="BIB"
                            className="bg-slate-900/50 border border-white/5 rounded-xl py-2 pl-8 pr-2 text-[11px] font-black text-white w-full outline-none focus:border-blue-500/50"
                            onBlur={(e) => (reg.newBib = e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handleUpdateParticipant(
                              reg.id,
                              reg.newTime || reg.net_time,
                              reg.newBib || reg.bib_number
                            )
                          }
                          className="p-2.5 bg-slate-900 text-slate-500 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-lg active:scale-90"
                        >
                          <Save size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultManagement;
