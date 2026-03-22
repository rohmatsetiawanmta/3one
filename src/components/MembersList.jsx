// src/components/MembersList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Search, ChevronRight, Trophy, Instagram } from "lucide-react";

const MemberCard = ({ member }) => (
  <div className="group relative bg-slate-900/40 border border-slate-800/50 p-5 rounded-[2rem] hover:border-blue-500/30 transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-4">
    {/* Glow Effect */}
    <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-600/5 blur-[30px] group-hover:bg-blue-600/10 transition-all"></div>

    {/* Avatar Inisial */}
    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-900/20 shrink-0 group-hover:scale-105 transition-transform">
      {member.full_name.charAt(0)}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <h3 className="text-white font-bold text-base truncate tracking-tight uppercase italic">
          {member.nick_name || member.full_name.split(" ")[0]}
        </h3>
      </div>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">
        {member.full_name}
      </p>
    </div>

    <div className="p-2 text-slate-700 group-hover:text-blue-500 transition-colors">
      <ChevronRight size={18} />
    </div>
  </div>
);

const MembersList = ({ isFullPage = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_URL}?resource=members`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-TOKEN": SECRET_TOKEN,
          },
        });
        const result = await response.json();
        if (result.status === "success") {
          setMembers(result.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [API_URL, SECRET_TOKEN]);

  // Logic Filtering
  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.nick_name &&
          m.nick_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [members, searchQuery]);

  const displayMembers = isFullPage
    ? filteredMembers
    : filteredMembers.slice(0, 4);

  if (loading)
    return (
      <div className="flex flex-col items-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
          Loading Squad...
        </p>
      </div>
    );

  return (
    <div className="space-y-10">
      {/* Search Bar khusus di Page Full */}
      {isFullPage && (
        <div className="max-w-md mx-auto relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search squad members..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-xs text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 font-bold uppercase tracking-wider"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {displayMembers.length > 0 ? (
          displayMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
            <p className="text-slate-600 italic text-sm">
              No members found with that name.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersList;
