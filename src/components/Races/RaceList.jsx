import React, { useState, useEffect, useCallback } from "react";
import RaceTabs from "./RaceTabs";
import RaceCard from "./RaceCard";
import RaceModal from "./RaceModal";
import RaceForm from "./RaceForm";
import { Plus, Trophy } from "lucide-react";

const RaceList = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedRace, setSelectedRace] = useState(null);
  const [editingRace, setEditingRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

        setSelectedRace((prev) => {
          if (!prev) return null;
          return result.data.find((r) => r.id === prev.id) || prev;
        });
      }
    } catch (error) {
      console.error("Refresh Error:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, SECRET_TOKEN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers untuk Modal & Form
  const handleOpenModal = (race) => {
    setSelectedRace(race);
  };

  const handleCloseModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedRace(null);
  };

  const handleOpenForm = (e) => {
    if (e) e.preventDefault();
    setShowForm(true);
  };

  const handleEditRace = (race) => {
    setEditingRace(race);
    setShowForm(true);
  };

  // Logic Filtering & Grouping
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black tracking-[0.3em] uppercase text-[10px]">
          Syncing Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <RaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <button
          type="button"
          onClick={handleOpenForm}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-blue-900/20 group"
        >
          <Plus
            size={16}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          Add New Race
        </button>
      </div>

      <div className="space-y-16">
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
                    onClick={handleOpenModal}
                    onEdit={handleEditRace}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center gap-4">
            <Trophy size={24} className="text-slate-700" />
            <p className="text-slate-500 italic text-sm">
              No races found in this category.
            </p>
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
