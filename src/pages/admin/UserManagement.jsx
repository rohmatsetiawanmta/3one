import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Shield,
  Mail,
  Smartphone,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Link,
  Loader2,
  CheckCircle2,
  X,
  Save,
  ChevronRight,
  UserCheck,
  AlertCircle,
  Fingerprint,
  MoreHorizontal,
  Link2Off,
} from "lucide-react";

const UserManagement = () => {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState("members"); // "members" | "users"
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [unlinkedUsers, setUnlinkedUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    gender: "Male",
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Resource sesuai router: 'members' atau 'users'
      const response = await fetch(`${API_URL}?resource=${activeTab}`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await response.json();
      if (result.status === "success") setData(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, API_URL, SECRET_TOKEN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchUnlinkedUsers = async () => {
    try {
      const res = await fetch(`${API_URL}?resource=users&filter=unlinked`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await res.json();
      if (result.status === "success") setUnlinkedUsers(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // --- HANDLERS ---
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const isEdit = !!selectedMember;
    const url = isEdit
      ? `${API_URL}?resource=members&id=${selectedMember.id}`
      : `${API_URL}?resource=members`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.status === "success") {
        closeModals();
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConnectAccount = async (userId) => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `${API_URL}?resource=members&id=${selectedMember.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-TOKEN": SECRET_TOKEN,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        closeModals();
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModals = () => {
    setShowMemberModal(false);
    setShowConnectModal(false);
    setSelectedMember(null);
    setFormData({ full_name: "", phone: "", gender: "Male" });
  };

  const filteredData = data.filter((item) => {
    const term = search.toLowerCase();
    return (
      (item.full_name || "").toLowerCase().includes(term) ||
      (item.email || "").toLowerCase().includes(term)
    );
  });

  const handleUnconnect = async (member) => {
    // Tambahkan konfirmasi agar tidak sengaja terklik
    if (!window.confirm(`Unlink account from ${member.full_name}?`)) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `${API_URL}?resource=members&id=${member.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-TOKEN": SECRET_TOKEN,
          },
          body: JSON.stringify({ user_id: null }), // Set user_id ke null
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        fetchData(); // Refresh table
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-4 animate-in fade-in duration-500">
      {/* 1. COMPACT HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-[1.5rem] border border-white/5 backdrop-blur-md shadow-xl">
        <div className="flex gap-1 p-1 bg-slate-950/50 border border-white/5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === "members"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === "users"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Accounts
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 md:flex-none">
          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              size={12}
            />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white outline-none focus:border-blue-500/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {activeTab === "members" && (
            <button
              onClick={() => {
                setSelectedMember(null);
                setShowMemberModal(true);
              }}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 shadow-lg active:scale-95 transition-all"
            >
              <UserPlus size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. ULTRA-COMPACT TABLE */}
      <div className="relative overflow-hidden bg-slate-950/50 border border-white/5 rounded-[1.5rem] backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  Profile Identity
                </th>
                <th className="px-6 py-3 text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Contact / Access
                </th>
                <th className="px-6 py-3 text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-6 py-3 text-[8px] font-black text-slate-500 uppercase tracking-widest text-right">
                  Opt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-500"
                      size={24}
                    />
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] font-black ${
                            activeTab === "members"
                              ? "bg-blue-600/10 text-blue-500 border-blue-500/20"
                              : "bg-emerald-600/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {activeTab === "members" ? (
                            item.full_name?.charAt(0)
                          ) : (
                            <Fingerprint size={14} />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-[11px] font-black text-white italic truncate group-hover:text-blue-400 transition-colors">
                            {activeTab === "members" ? (
                              <span className="uppercase">
                                {item.full_name}
                              </span>
                            ) : (
                              item.email
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {activeTab === "members" ? (
                        <div className="inline-flex items-center gap-3 text-[9px] font-bold text-slate-400 italic">
                          <div className="flex items-center gap-1">
                            <Mail size={10} className="text-blue-500/50" />{" "}
                            {item.email || "—"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Smartphone
                              size={10}
                              className="text-emerald-500/50"
                            />{" "}
                            {item.phone || "—"}
                          </div>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest italic">
                          {item.role || "MEMBER"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {activeTab === "members" ? (
                        item.user_id ? (
                          <div className="relative group/status flex items-center justify-center">
                            {/* Status Verified (Default) */}
                            <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase italic group-hover/status:opacity-0 transition-opacity">
                              <UserCheck size={14} className="opacity-60" />{" "}
                              Verified
                            </div>

                            {/* Tombol Unconnect (Muncul saat hover status) */}
                            <button
                              onClick={() => handleUnconnect(item)}
                              className="absolute inset-0 hidden group-hover/status:flex items-center justify-center gap-1.5 text-rose-500 text-[8px] font-black uppercase bg-rose-500/10 border border-rose-500/20 rounded-lg transition-all"
                            >
                              <Link2Off size={10} /> Unconnect
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedMember(item);
                              fetchUnlinkedUsers();
                              setShowConnectModal(true);
                            }}
                            className="text-[8px] font-black uppercase text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded hover:bg-amber-500 hover:text-white transition-all"
                          >
                            Connect
                          </button>
                        )
                      ) : // Status untuk Tab Users (tetap sama)
                      item.has_profile ? (
                        <CheckCircle2
                          size={14}
                          className="text-blue-500 mx-auto opacity-60"
                        />
                      ) : (
                        <AlertCircle
                          size={14}
                          className="text-rose-500 mx-auto animate-pulse"
                        />
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        {activeTab === "members" && (
                          <button
                            onClick={() => {
                              setSelectedMember(item);
                              setFormData({
                                full_name: item.full_name,
                                phone: item.phone || "",
                                gender: item.gender || "Male",
                              });
                              setShowMemberModal(true);
                            }}
                            className="p-1.5 bg-white/5 rounded-lg text-slate-400 hover:text-blue-500 transition-all"
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                        <button className="p-1.5 bg-white/5 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]"
                  >
                    No data records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MODAL: MEMBER PROFILE */}
      {showMemberModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={closeModals}
          />
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-in zoom-in duration-200">
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black text-white uppercase tracking-widest italic">
                  {selectedMember ? "Update Profile" : "New Runner"}
                </h2>
                <button
                  type="button"
                  onClick={closeModals}
                  className="text-slate-600 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-4 text-[10px] text-white outline-none focus:border-blue-500/50"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Phone
                    </label>
                    <input
                      className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-4 text-[10px] text-white outline-none focus:border-blue-500/50"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Gender
                    </label>
                    <select
                      className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-4 text-[10px] text-white outline-none cursor-pointer"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              <button
                disabled={submitting}
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                {submitting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}{" "}
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: CONNECT ACCOUNT */}
      {showConnectModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={closeModals}
          />
          <div className="relative w-full max-w-xs bg-slate-900 border border-white/10 rounded-[2rem] p-5 shadow-2xl animate-in zoom-in duration-200">
            <div className="text-center space-y-1 mb-4">
              <h3 className="text-[10px] font-black text-white uppercase italic tracking-widest">
                Link Identity
              </h3>
              <p className="text-[8px] text-slate-500 font-bold uppercase truncate px-4">
                {selectedMember?.full_name}
              </p>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {unlinkedUsers.length > 0 ? (
                unlinkedUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleConnectAccount(u.id)}
                    className="w-full p-3 bg-slate-950/50 border border-white/5 rounded-xl text-left hover:border-blue-500/50 group flex justify-between items-center transition-all"
                  >
                    <span className="text-[9px] text-slate-500 group-hover:text-white truncate">
                      {u.email}
                    </span>
                    <ChevronRight
                      size={10}
                      className="text-slate-800 group-hover:text-blue-500"
                    />
                  </button>
                ))
              ) : (
                <div className="py-6 text-center opacity-30 text-[8px] font-black uppercase">
                  Empty Pool
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
