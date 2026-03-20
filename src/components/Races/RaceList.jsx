import React, { useState, useEffect, useCallback } from "react";
import RaceTabs from "./RaceTabs";
import RaceCard from "./RaceCard";
import RaceModal from "./RaceModal";
import AddRaceForm from "./AddRaceForm";
import { Plus } from "lucide-react";

const RaceList = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedRace, setSelectedRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  // 1. FUNGSI FETCH DATA (Diletakkan di luar useEffect agar bisa di-passing)
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
      }
    } catch (error) {
      console.error("Gagal menarik data race:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, SECRET_TOKEN]);

  // 2. JALANKAN FETCH SAAT PERTAMA KALI LOAD
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. LOGIC: FILTERING & GROUPING
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredRaces = races.filter((race) => {
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

  // 4. RENDER LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold tracking-widest animate-pulse uppercase text-xs">
          Syncing with Circuit...
        </p>
      </div>
    );
  }

  // 5. MAIN RENDER
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <RaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white border border-blue-600/20 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 group shadow-lg shadow-blue-900/5"
        >
          <Plus
            size={16}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          Add Race
        </button>
      </div>

      {/* RACE LIST SECTION */}
      <div className="space-y-16">
        {Object.keys(groupedRaces).length > 0 ? (
          Object.keys(groupedRaces).map((monthYear) => (
            <div key={monthYear} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-blue-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] whitespace-nowrap">
                  {monthYear}
                </h2>
                <div className="h-[1px] w-full bg-slate-800/40"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {groupedRaces[monthYear].map((race) => (
                  <RaceCard
                    key={race.id}
                    race={race}
                    onClick={setSelectedRace}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
              <Trophy size={20} />
            </div>
            <p className="text-slate-500 italic font-medium max-w-xs mx-auto text-sm">
              Sepertinya sirkuit sedang sepi. Belum ada jadwal lomba yang
              terdaftar di kategori ini.
            </p>
          </div>
        )}
      </div>

      {/* MODAL COMPONENTS */}
      {selectedRace && (
        <RaceModal race={selectedRace} onClose={() => setSelectedRace(null)} />
      )}

      {showAddForm && (
        <AddRaceForm
          onClose={() => setShowAddForm(false)}
          onRaceAdded={fetchData} // Berhasil dikirim karena sudah di luar useEffect
        />
      )}
    </div>
  );
};

export default RaceList;
