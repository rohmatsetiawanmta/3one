import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Users,
  Search,
  PlusCircle,
  Check,
  UserPlus,
  Loader2,
  Trash2,
} from "lucide-react";

const ManageRunnersModal = ({ race, onClose, onRefresh }) => {
  const [allMembers, setAllMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedCat, setSelectedCat] = useState(race?.categories?.[0] || "");
  const [submitting, setSubmitting] = useState(false);
  // State baru untuk mengontrol kapan dropdown pencarian harus muncul
  const [showDropdown, setShowDropdown] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;
  const adminUser = JSON.parse(localStorage.getItem("user_session"));

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}?resource=members`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await res.json();
      if (result.status === "success") setAllMembers(result.data);
    } catch (err) {
      console.error(err);
    }
  }, [API_URL, SECRET_TOKEN]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const columns = useMemo(() => {
    const groups = {};
    race?.categories?.forEach((cat) => (groups[cat] = []));
    race?.members?.forEach((member) => {
      const cat = member.category || member.cat;
      if (groups[cat]) groups[cat].push(member);
    });
    return groups;
  }, [race]);

  const handleAddMember = async () => {
    if (!selectedMember || submitting || !adminUser) return;
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}?resource=join_race_admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({
          race_id: race.id,
          user_id: adminUser.id,
          token: adminUser.token,
          category: selectedCat,
          target_member_id: selectedMember.id,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setSelectedMember(null);
        setSearch("");
        if (onRefresh) onRefresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMembers = allMembers.filter((m) => {
    const name = m?.full_name?.toLowerCase() || "";
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-7xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users size={18} className="text-blue-500" />
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1">
                Lineup Distribution
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase italic tracking-widest">
                {race.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Add */}
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex flex-col lg:flex-row gap-3 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                size={14}
              />
              <input
                type="text"
                placeholder="Find member..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 pr-4 pl-10 text-[11px] text-white outline-none focus:border-blue-500/50"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true); // Tampilkan dropdown saat mengetik
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {/* Dropdown Pencarian */}
              {showDropdown && search && (
                <div className="absolute top-full left-0 w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl z-50 max-h-40 overflow-y-auto p-1 shadow-2xl">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedMember(m);
                          setSearch(m.full_name); // Set input text ke nama yang dipilih
                          setShowDropdown(false); // Sembunyikan dropdown setelah pilih
                        }}
                        className="w-full p-2 hover:bg-white/5 rounded-lg text-left flex justify-between items-center group"
                      >
                        <span className="text-[11px] font-bold text-white">
                          {m.full_name}
                        </span>
                        <PlusCircle size={12} className="text-slate-700" />
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-[10px] text-slate-600 italic">
                      No members found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <select
                className="bg-slate-950 border border-slate-800 rounded-2xl px-3 text-[11px] text-white outline-none font-black uppercase"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
              >
                {race.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedMember || submitting}
                onClick={handleAddMember}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-900/20 whitespace-nowrap transition-all"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <UserPlus size={14} />
                )}{" "}
                Add
              </button>
            </div>
          </div>

          {/* Indikator Terpilih (Opsional tapi membantu visual) */}
          {selectedMember && (
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-blue-500 font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
              <Check size={12} /> Ready to add: {selectedMember.full_name}
            </div>
          )}
        </div>

        {/* COLUMNS GRID AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-900/50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {Object.entries(columns).map(([category, members]) => (
              <div
                key={category}
                className="flex flex-col bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden max-h-[500px]"
              >
                {/* Column Header */}
                <div className="p-3 bg-white/[0.03] border-b border-white/5 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] italic truncate pr-2">
                    {category}
                  </span>
                  <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[8px] font-black rounded-md">
                    {members.length}
                  </span>
                </div>

                {/* Column List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                  <div className="space-y-1">
                    {members.length > 0 ? (
                      members.map((m, idx) => (
                        <div
                          key={idx}
                          className="group flex items-center justify-between p-2 bg-slate-900/40 border border-white/[0.02] rounded-xl hover:border-blue-500/30 transition-all"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 shrink-0 rounded-md bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase">
                              {m.name?.charAt(0) || "?"}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 truncate group-hover:text-white transition-colors">
                              {m.name}
                            </span>
                          </div>
                          <button className="p-1 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center opacity-30">
                        <p className="text-[8px] text-slate-600 font-black uppercase italic">
                          No Data
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
            Race Participants: {race.participants}
          </span>
          <button
            onClick={onClose}
            className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRunnersModal;
