// src/components/MembersList.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

// DATA MOCK DIREVISI sesuai skema tabel 'profiles'
const mockMembers = [
  { id: 1, full_name: "Budi Setiawan", nick_name: "BudiS" },
  { id: 2, full_name: "Citra Dewi", nick_name: "CitraD" },
  { id: 3, full_name: "Doni Prakoso", nick_name: "DoniP" },
  { id: 4, full_name: "Eka Putri", nick_name: "EkaP" },
  { id: 5, full_name: "Fajar Nugraha", nick_name: "FajarN" },
  { id: 6, full_name: "Gina Amelia", nick_name: "GinaA" },
  { id: 7, full_name: "Hadi Susanto", nick_name: "HadiS" },
  { id: 8, full_name: "Indah Permata", nick_name: "IndahP" },
];

const MemberCard = ({ member }) => (
  // Disesuaikan: Menghapus avatar dan personal_best
  <div className="bg-white p-4 rounded-xl shadow-lg text-black flex items-center space-x-4">
    {/* Mengganti Avatar dengan inisial atau ikon default */}
    <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
      {member.nick_name.charAt(0)}
    </div>

    <div className="flex-grow">
      {/* Menggunakan nick_name dan full_name */}
      <h3 className="text-lg font-bold">{member.nick_name}</h3>
      <p className="text-sm text-gray-500">
        <span className="text-blue-900 font-semibold">{member.full_name}</span>
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
  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      // Fetch dari tabel 'profiles' dengan kolom baru
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, nick_name")
        .limit(isFullPage ? 100 : 4)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching members:", error.message);
        setMembers(isFullPage ? mockMembers : mockMembers.slice(0, 4));
      } else {
        // setMembers(data); // Uncomment ini setelah Supabase siap
      }
      setLoading(false);
    }

    // fetchMembers(); // Komentar dipertahankan karena tidak ada akses ke Supabase
  }, [isFullPage]);

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
