import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Link as LinkIcon,
  Unlink,
  CheckCircle,
  Loader2,
  UserPlus,
  Info,
} from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState({});

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resUsers, resMembers] = await Promise.all([
        fetch(`${API_URL}?resource=users`, {
          headers: { "X-TOKEN": SECRET_TOKEN },
        }),
        fetch(`${API_URL}?resource=members`, {
          headers: { "X-TOKEN": SECRET_TOKEN },
        }),
      ]);
      const dataUsers = await resUsers.json();
      const dataMembers = await resMembers.json();
      setUsers(dataUsers.data || []);
      setMembers(dataMembers.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLink = async (userId, memberId) => {
    if (!memberId) return;
    try {
      const res = await fetch(`${API_URL}?resource=members&id=${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      if ((await res.json()).status === "success") {
        setSelectedMemberIds((prev) => {
          const newState = { ...prev };
          delete newState[userId];
          return newState;
        });
        fetchAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlink = async (memberId) => {
    if (!window.confirm("Yakin ingin melepas kaitan akun ini?")) return;
    try {
      const res = await fetch(`${API_URL}?resource=members&id=${memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify({ user_id: null }),
      });
      if ((await res.json()).status === "success") {
        fetchAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          User Management
        </h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
          Database of Registered Web Accounts
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-blue-500/50 transition-all"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-slate-950 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Account Info
              </th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Role
              </th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Linked Member
              </th>
              <th className="px-8 py-5 text-right text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-white/[0.01] transition-colors group"
              >
                <td className="px-8 py-4">
                  <div className="text-sm font-black text-white uppercase italic tracking-tight">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 lowercase">
                    {user.email}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      user.role === "admin"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                {/* Ganti bagian kolom Linked Member di dalam .map users */}
                <td className="px-8 py-4">
                  {user.member_id ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <div className="text-sm font-black text-white uppercase italic">
                          {user.linked_member_name || "No Name Found"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-700 italic">
                      <Info size={14} />
                      <span className="text-[11px] font-bold uppercase tracking-tight">
                        Unlinked
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {user.member_id ? (
                      /* TOMBOL UNLINK */
                      <button
                        onClick={() => handleUnlink(user.member_id)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-red-950/30 text-slate-500 hover:text-red-500 px-4 py-2 rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <Unlink size={14} /> Unlink
                      </button>
                    ) : (
                      /* ALUR LINK DENGAN TOMBOL KONFIRMASI */
                      <div className="flex items-center gap-2">
                        <select
                          className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-[10px] font-black text-white outline-none focus:border-blue-500/50 w-44"
                          value={selectedMemberIds[user.id] || ""}
                          onChange={(e) =>
                            setSelectedMemberIds({
                              ...selectedMemberIds,
                              [user.id]: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Choose Member --</option>
                          {members
                            .filter(
                              (m) => !users.find((u) => u.member_id === m.id)
                            )
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.full_name}
                              </option>
                            ))}
                        </select>
                        {selectedMemberIds[user.id] && (
                          <button
                            onClick={() =>
                              handleLink(user.id, selectedMemberIds[user.id])
                            }
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 animate-in fade-in slide-in-from-right-2"
                          >
                            <LinkIcon size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
