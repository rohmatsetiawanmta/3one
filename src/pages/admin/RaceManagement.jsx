import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Users,
  Trophy,
  Search,
  MapPin,
  Calendar,
  Layers,
  Activity,
  ChevronRight,
} from "lucide-react";
import RaceForm from "../../components/Races/RaceForm";
import ManageRunnersModal from "../../components/Races/ManageRunnersModal";
import { formatDateRange } from "../../utils/formatDateRange";

const RaceManagement = ({ user }) => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRace, setEditingRace] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?resource=races`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await response.json();
      if (result.status === "success") {
        setRaces(result.data);
        setSelectedRace((prev) => {
          if (!prev) return null;
          const updated = result.data.find((r) => r.id === prev.id);
          return updated || prev;
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, SECRET_TOKEN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRaces = races.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-10 animate-in fade-in duration-500">
      {/* COMPACT HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-5 rounded-[2rem] border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">
              Race Management
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">
              Administrative Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64 group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors"
              size={12}
            />
            <input
              type="text"
              placeholder="Filter events..."
              className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white outline-none focus:border-blue-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={14} /> New Race
          </button>
        </div>
      </div>

      {/* TECHNICAL TABLE - BREAKDOWN KOLOM */}
      <div className="bg-slate-950/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <thead>
              <tr className="bg-white/[0.02] text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                <th className="px-8 py-4 w-[240px]">Event Name</th>
                <th className="px-4 py-4 w-[160px]">Location</th>
                <th className="px-4 py-4 w-[140px]">Schedule</th>
                <th className="px-4 py-4 w-[200px]">Available Categories</th>
                <th className="px-4 py-4 w-[100px] text-center">Runners</th>
                <th className="px-8 py-4 w-[100px] text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRaces.map((race) => (
                <tr
                  key={race.id}
                  className="hover:bg-white/[0.01] group transition-all"
                >
                  {/* Kolom 1: Nama & Logo */}
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-blue-500/30 transition-all shadow-inner">
                        {race.logo_url ? (
                          <img
                            src={race.logo_url}
                            className="w-full h-full object-cover opacity-70"
                          />
                        ) : (
                          <Trophy size={16} className="text-slate-800" />
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-white uppercase group-hover:text-blue-400 transition-colors">
                        {race.name}
                      </p>
                    </div>
                  </td>

                  {/* Kolom 2: Location Saja */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <MapPin size={12} className="text-blue-600 shrink-0" />
                      <span>{race.location}</span>
                    </div>
                  </td>

                  {/* Kolom 3: Schedule */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-tighter bg-slate-900/50 w-fit px-2 py-1 rounded-lg border border-white/5">
                      <Calendar size={12} className="text-blue-500" />
                      {formatDateRange(race.date, race.end_date)}
                    </div>
                  </td>

                  {/* Kolom 4: Categories */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {race.categories?.map((cat) => (
                        <span
                          key={cat}
                          className="text-[7px] font-black text-slate-500 uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-blue-500/20 group-hover:text-blue-400 transition-all"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Kolom 5: Stats */}
                  <td className="px-4 py-4 text-center">
                    <div className="inline-block">
                      <p className="text-xs font-black text-white leading-none tracking-tighter group-hover:text-blue-500 transition-colors">
                        {race.participants}
                      </p>
                      <p className="text-[7px] text-slate-600 font-black uppercase mt-1 tracking-widest">
                        Joined
                      </p>
                    </div>
                  </td>

                  {/* Kolom 6: Actions */}
                  <td className="px-8 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedRace(race)}
                        className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-500 hover:text-blue-500 hover:border-blue-500/30 transition-all shadow-sm"
                        title="Manage Runners"
                      >
                        <Users size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingRace(race);
                          setShowForm(true);
                        }}
                        className="p-2 bg-slate-900 border border-white/5 rounded-lg text-slate-500 hover:text-emerald-500 hover:border-emerald-500/30 transition-all shadow-sm"
                        title="Edit Info"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

      {selectedRace && (
        <ManageRunnersModal
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};

export default RaceManagement;
