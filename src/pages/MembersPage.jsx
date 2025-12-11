// src/pages/MembersPage.jsx
import React from "react";
import MembersList from "../components/MembersList";

const MembersPage = () => {
  return (
    <div className="py-12 bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold mb-10 text-center text-blue-400">
          👥 DAFTAR ANGGOTA KOMUNITAS
        </h2>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Kenali sesama pelari Anda. Filter berdasarkan PB, jarak, atau lokasi
          untuk mencari teman latihan yang cocok!
        </p>
        <MembersList isFullPage={true} />
      </div>
    </div>
  );
};

export default MembersPage;
