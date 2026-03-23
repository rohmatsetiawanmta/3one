import React, { useState, useEffect } from "react";
import {
  Trophy,
  MapPin,
  Calendar,
  History,
  ArrowLeft,
  Loader2,
  Image,
  FileText,
  Instagram,
  Globe,
  Clock,
  CheckCircle,
  ShieldAlert,
  Target,
  Zap,
  Timer,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RaceHistoryPage = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [userRaces, setUserRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  const isMemberVerified = !!user?.member_id;

  // Helper: Format Tanggal (7 Feb 2026)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Helper: Waktu Sisa ke Race Terdekat (Hari)
  const calculateDaysLeft = (dateString) => {
    const today = new Date();
    const raceDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    const diffTime = raceDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isMemberVerified) {
      fetchHistoryData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}?resource=recap_race&id=${user.member_id}`,
        { headers: { "X-TOKEN": SECRET_TOKEN } }
      );
      const result = await response.json();
      if (result.status === "success") {
        setUserRaces(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter Data
  const upcomingRaces = userRaces
    .filter((race) => new Date(race.race_date) >= today)
    .sort((a, b) => new Date(a.race_date) - new Date(b.race_date));
  const finishedRaces = userRaces
    .filter((race) => new Date(race.race_date) < today)
    .sort((a, b) => new Date(b.race_date) - new Date(a.race_date));
  const filteredAndSortedRaces =
    activeTab === "upcoming" ? upcomingRaces : finishedRaces;

  // --- CALCULATE SUMMARY STATS ---
  const totalFinishedDistance = finishedRaces.reduce((sum, race) => {
    const cat = race.category_selected?.toUpperCase() || "";

    // 1. Cek istilah khusus
    if (cat.includes("FM") || cat.includes("FULL MARATHON")) return sum + 42;
    if (cat.includes("HM") || cat.includes("HALF MARATHON")) return sum + 21;

    // 2. Cek angka + K (misal: 10K, 5K, 10 K)
    const distanceMatch = cat.match(/(\d+)\s*K/);
    if (distanceMatch) return sum + parseInt(distanceMatch[1]);

    return sum;
  }, 0);

  const stats = [
    {
      title: "Total Races",
      value: finishedRaces.length,
      icon: Trophy,
      color: "text-emerald-500",
      suffix: "Finishes",
    },
    {
      title: "Total Distance",
      value: `${totalFinishedDistance} KM`,
      icon: Zap,
      color: "text-blue-500",
      suffix: "KM Accumulated",
    },
    {
      title: "Next Race",
      value:
        upcomingRaces.length > 0
          ? calculateDaysLeft(upcomingRaces[0].race_date)
          : 0,
      icon: Target,
      color: "text-orange-500",
      suffix: upcomingRaces.length > 0 ? "Days to go" : "No plan yet",
    },
  ];

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Back Button */}
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

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Race History
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
          Personal achievements & upcoming challenges
        </p>
      </div>

      {!isMemberVerified ? (
        <div className="relative group p-1 max-w-2xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-red-500/20 rounded-[2.5rem] blur opacity-50"></div>
          <div className="relative flex flex-col items-center justify-center py-32 bg-slate-950/50 border border-orange-500/20 rounded-[2.5rem] backdrop-blur-xl text-center px-6">
            <ShieldAlert
              size={48}
              className="text-orange-500 mb-6 animate-pulse"
            />
            <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] italic mb-2">
              MENUNGGU VERIFIKASI ADMIN
            </h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-loose">
              Hubungi admin komunitas untuk aktivasi profil member Anda.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="relative group overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-white/0 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-slate-950 border border-white/5 p-7 rounded-3xl flex items-center gap-6 shadow-xl">
                  <div
                    className={`p-4 rounded-2xl bg-slate-900 border border-white/5 ${stat.color}`}
                  >
                    <stat.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-black text-white leading-none mt-1.5 tracking-tighter italic">
                      {stat.value}
                    </p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase mt-1 tracking-wider">
                      {stat.suffix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* TABS MENU */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex gap-1 p-1 bg-slate-900/50 border border-white/5 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === "upcoming"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Clock size={14} /> Upcoming
              </button>
              <button
                onClick={() => setActiveTab("finished")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === "finished"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <CheckCircle size={14} /> Finished
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="relative overflow-x-auto bg-slate-950/50 border border-white/5 rounded-[2rem] backdrop-blur-xl">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Race Event
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Date & Location
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Category
                  </th>
                  {activeTab === "finished" && (
                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      Race Report
                    </th>
                  )}
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAndSortedRaces.length > 0 ? (
                  filteredAndSortedRaces.map((race) => (
                    <tr
                      key={race.race_id}
                      className="group/row hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                              activeTab === "upcoming"
                                ? "bg-blue-600/10 text-blue-500 border-blue-500/20"
                                : "bg-emerald-600/10 text-emerald-500 border-emerald-500/20"
                            }`}
                          >
                            <Trophy size={16} />
                          </div>
                          <span className="text-sm font-black text-white uppercase tracking-tight italic group-hover/row:text-blue-400 transition-colors">
                            {race.race_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-300 font-bold text-[11px]">
                            <Calendar
                              size={12}
                              className={
                                activeTab === "upcoming"
                                  ? "text-blue-500"
                                  : "text-emerald-500"
                              }
                            />
                            {formatDate(race.race_date)}
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase">
                            <MapPin size={12} /> {race.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="inline-flex px-3 py-1 bg-slate-900 text-blue-400 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          {race.category_selected}
                        </span>
                      </td>

                      {/* --- RACE REPORT COLUMN (Only in Finished Tab) --- */}
                      {activeTab === "finished" && (
                        <td className="px-6 py-6">
                          <div className="space-y-1.5">
                            {race.net_time ? (
                              <div className="flex items-center gap-2 text-emerald-400 font-black tracking-tight text-xs bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 w-fit">
                                <Timer size={12} /> {race.net_time}
                              </div>
                            ) : (
                              <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest italic opacity-50">
                                No result data
                              </div>
                            )}
                            {race.bib_number && (
                              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase ml-1">
                                <Award size={11} /> BIB: {race.bib_number}
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {race.website_url && (
                            <a
                              href={race.website_url}
                              target="_blank"
                              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                            >
                              <Globe size={16} />
                            </a>
                          )}
                          {race.social_url && (
                            <a
                              href={race.social_url}
                              target="_blank"
                              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:bg-pink-600 hover:text-white transition-all"
                            >
                              <Instagram size={16} />
                            </a>
                          )}
                          {race.result_url && (
                            <a
                              href={race.result_url}
                              target="_blank"
                              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                            >
                              <FileText size={16} />
                            </a>
                          )}
                          {race.doc_url && (
                            <a
                              href={race.doc_url}
                              target="_blank"
                              className="p-2.5 bg-white/5 rounded-xl text-slate-400 hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              <Image size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={activeTab === "finished" ? "5" : "4"}
                      className="px-6 py-28 text-center"
                    >
                      <History
                        size={48}
                        className="mx-auto mb-4 text-slate-800 opacity-20"
                      />
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                        No {activeTab} races found
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RaceHistoryPage;
