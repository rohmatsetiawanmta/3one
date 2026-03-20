import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";

const RaceTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "upcoming", label: "Upcoming", icon: <Clock size={16} /> },
    { id: "done", label: "Done", icon: <CheckCircle2 size={16} /> },
  ];

  return (
    <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === tab.id
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
};

export default RaceTabs;
