import React, { useEffect, useState } from "react";
import { Clock, ShieldAlert, Database, Key, Info, Globe } from "lucide-react";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=logs`, {
        headers: { "X-TOKEN": SECRET_TOKEN },
      });
      const result = await response.json();
      if (result.status === "success") setLogs(result.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case "auth":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "data_change":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "access_denied":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "system_error":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "auth":
        return <Key size={14} />;
      case "data_change":
        return <Database size={14} />;
      case "access_denied":
        return <ShieldAlert size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
            <Clock className="text-blue-600" /> Activity Log
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Monitoring system activities & security events
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-slate-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Timestamp
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  User
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Type
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Description
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right text-nowrap">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs"
                  >
                    Loading logs...
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-[11px] font-mono text-slate-400">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white uppercase tracking-tight">
                          {log.full_name || "System/Guest"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {log.email || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getBadgeStyle(
                          log.action_type
                        )}`}
                      >
                        {getIcon(log.action_type)}
                        {log.action_type.replace("_", " ")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-300 max-w-md italic">
                        {log.description}
                        <span className="block text-[9px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">
                          On Resource: {log.resource_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-500 group-hover:text-blue-500 transition-colors">
                        <Globe size={12} />
                        <span className="text-[10px] font-mono font-bold">
                          {log.ip_address}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
