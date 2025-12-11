// src/pages/Members.jsx (Setelah Perubahan Warna)
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const mockMembers = [
  {
    id: 1,
    name: "Budi Setiawan",
    city: "Jakarta",
    personal_best: "Marathon 3:15:00",
  },
  {
    id: 2,
    name: "Citra Dewi",
    city: "Bandung",
    personal_best: "Half Marathon 1:45:00",
  },
  {
    id: 3,
    name: "Doni Prakoso",
    city: "Surabaya",
    personal_best: "10K 0:42:30",
  },
];

const MemberCard = ({ member }) => (
  // Kartu Anggota: Background Putih, Teks Hitam, Border Aksen Biru Gelap
  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-900 text-black">
    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
    <p className="text-sm text-gray-500 mb-3">{member.city}</p>
    <p className="text-md font-semibold text-blue-900">
      PB: {member.personal_best}
    </p>
  </div>
);

const Members = () => {
  const [members, setMembers] = useState(mockMembers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching members:", error);
        setError(
          "Gagal memuat data anggota dari server. Menampilkan data contoh."
        );
        setMembers(mockMembers);
      } else {
        setMembers(data);
        setError(null);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Judul Teks Putih karena background App.jsx adalah dark */}
      <h2 className="text-4xl font-extrabold text-white text-center">
        👥 Profil Anggota Komunitas
      </h2>
      {error && (
        <div className="p-4 bg-red-800 border-l-4 border-red-500 text-white rounded-md">
          {error}
        </div>
      )}

      {loading && (
        <p className="text-center text-gray-400">Memuat data anggota...</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default Members;
