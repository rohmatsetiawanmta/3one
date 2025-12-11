// src/components/MembersList.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const mockMembers = [
  {
    id: 1,
    name: "Budi Setiawan",
    personal_best: "3:15:00 Marathon",
    avatar: "https://via.placeholder.com/150/0000FF/FFFFFF?text=BS",
  },
  {
    id: 2,
    name: "Citra Dewi",
    personal_best: "1:45:00 Half Marathon",
    avatar: "https://via.placeholder.com/150/FF0077/FFFFFF?text=CD",
  },
  {
    id: 3,
    name: "Doni Prakoso",
    personal_best: "0:42:30 10K",
    avatar: "https://via.placeholder.com/150/00FFFF/FFFFFF?text=DP",
  },
  {
    id: 4,
    name: "Eka Putri",
    personal_best: "New Runner",
    avatar: "https://via.placeholder.com/150/FF8800/FFFFFF?text=EP",
  },
  {
    id: 5,
    name: "Fajar Nugraha",
    personal_best: "1:35:00 Half Marathon",
    avatar: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=FN",
  },
  {
    id: 6,
    name: "Gina Amelia",
    personal_best: "4:05:00 Marathon",
    avatar: "https://via.placeholder.com/150/9C27B0/FFFFFF?text=GA",
  },
  {
    id: 7,
    name: "Hadi Susanto",
    personal_best: "0:50:00 10K",
    avatar: "https://via.placeholder.com/150/FFEB3B/000000?text=HS",
  },
  {
    id: 8,
    name: "Indah Permata",
    personal_best: "New Runner",
    avatar: "https://via.placeholder.com/150/03A9F4/FFFFFF?text=IP",
  },
];

const MemberCard = ({ member }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg text-black flex items-center space-x-4">
    <img
      src={member.avatar}
      alt={member.name}
      className="w-12 h-12 rounded-full object-cover border-2 border-blue-900"
    />
    <div className="flex-grow">
      <h3 className="text-lg font-bold">{member.name}</h3>
      <p className="text-sm text-gray-500">
        PB:{" "}
        <span className="text-blue-900 font-semibold">
          {member.personal_best}
        </span>
      </p>
    </div>
    <button className="text-xs text-blue-900 font-semibold hover:text-blue-700">
      Lihat Profil
    </button>
  </div>
);

const MembersList = ({ isFullPage = false }) => {
  const [members, setMembers] = useState(
    isFullPage ? mockMembers : mockMembers.slice(0, 4)
  );
  const [loading, setLoading] = useState(false);

  // LOGIKA FETCH SUPABASE (dapat disesuaikan)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {loading ? (
        <p className="text-center col-span-4 text-gray-400">
          Memuat anggota...
        </p>
      ) : (
        members.map((member) => <MemberCard key={member.id} member={member} />)
      )}

      {isFullPage && (
        <div className="col-span-4 text-center mt-8">
          <button className="px-6 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition duration-300">
            Load More Members
          </button>
        </div>
      )}
    </div>
  );
};

export default MembersList;
