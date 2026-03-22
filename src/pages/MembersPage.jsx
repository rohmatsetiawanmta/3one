// src/pages/MembersPage.jsx
import React from "react";
import MembersList from "../components/MembersList";
import { Users } from "lucide-react";

const MembersPage = () => {
  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/20">
            <Users size={32} className="text-blue-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white uppercase">
            3One <span className="text-blue-600">Squad</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-xl font-medium tracking-wide">
            Kenali sesama pelari di komunitas. Temukan teman lari, bandingkan
            catatan waktu, dan tumbuh bersama.
          </p>
        </div>

        {/* List Section */}
        <MembersList isFullPage={true} />
      </div>
    </div>
  );
};

export default MembersPage;
