import React, { useState, useEffect, useCallback, useMemo } from "react";
import RaceTabs from "./RaceTabs";
import RaceCard from "./RaceCard";
import RaceModal from "./RaceModal";
import RaceForm from "./RaceForm";
import {
  Plus,
  Trophy,
  Search,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";

const RaceList = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedRace, setSelectedRace] = useState(null);
  const [editingRace, setEditingRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  // 1. Fetch data
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

  // 2. AUTO RESET: Setiap kali activeTab berubah, reset selectedMonth ke "all"
  useEffect(() => {
    setSelectedMonth("all");
  }, [activeTab]);

  const handleCloseModal = (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedRace(null);
  };

  // 3. Logika Available Months: Dinamis berdasarkan tab aktif
  const availableMonths = useMemo(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const months = races
      .filter((race) => {
        const raceDate = new Date(race.date);
        if (activeTab === "upcoming") {
          return raceDate >= currentMonthStart;
        } else {
          // Untuk Done: Bulan sekarang dan masa lalu
          const nextMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
          );
          return raceDate < nextMonthStart;
        }
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

    // Sort: Upcoming (Kronologis), Done (Terbaru ke Terlama)
    return uniqueMonths.sort((a, b) =>
      activeTab === "upcoming" ? a.sortKey - b.sortKey : b.sortKey - a.sortKey
    );
  }, [races, activeTab]);

  // 4. Filtering Logic
  const filteredRaces = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return races.filter((race) => {
      const raceDate = new Date(race.end_date || race.date);
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

  const groupedRaces = useMemo(() => {
    return filteredRaces
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
  }, [filteredRaces, activeTab]);

  if (loading)
    return (
      <div className="py-40 text-center text-slate-500 uppercase text-[10px] font-black tracking-widest">
        Syncing Data...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <RaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* SEARCH */}
          <div className="relative group flex-1 sm:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search race..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-10 text-xs text-white outline-none focus:border-blue-500/50 transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* DYNAMIC MONTH FILTER */}
          <div className="relative sm:w-56">
            <CalendarIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
              size={16}
            />
            <select
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-[10px] text-white outline-none focus:border-blue-500/50 appearance-none cursor-pointer uppercase font-black tracking-widest"
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

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            <Plus size={16} /> Add Race
          </button>
        </div>
      </div>

      <div className="space-y-16 pt-4">
        {Object.keys(groupedRaces).length > 0 ? (
          Object.keys(groupedRaces).map((monthYear) => (
            <div key={monthYear} className="space-y-8">
              <div className="flex items-center gap-6">
                <h2 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] whitespace-nowrap">
                  {monthYear}
                </h2>
                <div className="h-[1px] w-full bg-slate-800/40"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groupedRaces[monthYear].map((race) => (
                  <RaceCard
                    key={race.id}
                    race={race}
                    onClick={setSelectedRace}
                    onEdit={(r) => {
                      setEditingRace(r);
                      setShowForm(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center gap-4">
            <Trophy size={24} className="text-slate-800" />
            <p className="text-slate-500 italic text-sm">
              No matches found for your filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedMonth("all");
              }}
              className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selectedRace && (
        <RaceModal
          race={selectedRace}
          onClose={handleCloseModal}
          onRefresh={fetchData}
        />
      )}

      {showForm && (
        <RaceForm
          onClose={() => {
            setShowForm(false);
            setEditingRace(null);
          }}
          onRaceSaved={fetchData}
          initialData={editingRace}
        />
      )}
    </div>
  );
};

export default RaceList;
