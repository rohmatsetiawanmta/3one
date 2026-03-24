import React, { useState, useEffect, useCallback, useMemo } from "react";
import RaceTabs from "./RaceTabs";
import RaceCard from "./RaceCard";
import RaceModal from "./RaceModal";
import { Search, Trophy, Calendar as CalendarIcon } from "lucide-react";

const RaceList = ({ user }) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedRace, setSelectedRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?resource=races`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        setRaces(result.data);
        // Sinkronisasi modal jika sedang terbuka
        setSelectedRace((prev) => {
          if (!prev) return null;
          return result.data.find((r) => r.id === prev.id) || prev;
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, SECRET_TOKEN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset filter bulan saat ganti tab
  useEffect(() => {
    setSelectedMonth("all");
  }, [activeTab]);

  // Logika Daftar Bulan yang Tersedia (Dynamic)
  const availableMonths = useMemo(() => {
    const months = races
      .filter((race) => {
        const raceDate = new Date(race.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return activeTab === "upcoming" ? raceDate >= today : raceDate < today;
      })
      .map((race) => {
        const date = new Date(race.date);
        return {
          value: `${date.getFullYear()}-${date.getMonth()}`,
          label: date.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          }),
          sortKey: date.getTime(),
        };
      });

    const uniqueMonths = Array.from(
      new Map(months.map((m) => [m.value, m])).values()
    );
    return uniqueMonths.sort((a, b) =>
      activeTab === "upcoming" ? a.sortKey - b.sortKey : b.sortKey - a.sortKey
    );
  }, [races, activeTab]);

  // Filter Utama
  const filteredRaces = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return races.filter((race) => {
      const raceDate = new Date(race.date);
      const isCorrectTab =
        activeTab === "upcoming" ? raceDate >= today : raceDate < today;
      const matchesSearch =
        race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        race.location.toLowerCase().includes(searchQuery.toLowerCase());

      const dateObj = new Date(race.date);
      const raceMonthValue = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;
      const matchesMonth =
        selectedMonth === "all" || raceMonthValue === selectedMonth;

      return isCorrectTab && matchesSearch && matchesMonth;
    });
  }, [races, activeTab, searchQuery, selectedMonth]);

  // Grouping Berdasarkan Bulan
  const groupedRaces = useMemo(() => {
    return filteredRaces
      .sort((a, b) =>
        activeTab === "upcoming"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      )
      .reduce((groups, race) => {
        const monthYear = new Date(race.date).toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric",
        });
        if (!groups[monthYear]) groups[monthYear] = [];
        groups[monthYear].push(race);
        return groups;
      }, {});
  }, [filteredRaces, activeTab]);

  if (loading)
    return (
      <div className="py-40 text-center text-slate-500 uppercase text-[10px] font-black tracking-widest italic animate-pulse">
        Syncing Lineup...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER CONTROLS - SEBARIS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <RaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-wrap items-center w-full xl:w-auto gap-3">
          {/* SEARCH BAR */}
          <div className="relative group flex-1 min-w-[200px] sm:max-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search race..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* DYNAMIC MONTH FILTER */}
          <div className="relative flex-1 min-w-[160px] sm:max-w-[220px]">
            <CalendarIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              size={16}
            />
            <select
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-[10px] text-white outline-none focus:border-blue-500/50 appearance-none cursor-pointer uppercase font-black tracking-widest"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">All Months</option>
              {availableMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* RACE GROUPS */}
      <div className="space-y-16">
        {Object.keys(groupedRaces).length > 0 ? (
          Object.entries(groupedRaces).map(([monthYear, monthRaces]) => (
            <div key={monthYear} className="space-y-8">
              <div className="flex items-center gap-6">
                <h2 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] whitespace-nowrap italic">
                  {monthYear}
                </h2>
                <div className="h-[1px] w-full bg-slate-800/40"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {monthRaces.map((race) => (
                  <RaceCard
                    key={race.id}
                    race={race}
                    onClick={setSelectedRace}
                    // onEdit dihapus karena Admin mengelola dari halaman khusus
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center gap-4 animate-in zoom-in">
            <Trophy size={24} className="text-slate-800" />
            <p className="text-slate-500 italic text-sm">
              No matches found for your filter.
            </p>
          </div>
        )}
      </div>

      {/* MODAL DETAIL (Tetap ada untuk Join) */}
      {selectedRace && (
        <RaceModal
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
          onRefresh={fetchData}
          user={user}
        />
      )}
    </div>
  );
};

export default RaceList;
