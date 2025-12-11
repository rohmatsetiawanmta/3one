// src/pages/RaceListPage.jsx
import React from "react";
import RaceList from "../components/RaceList";

const RaceListPage = () => {
  return (
    <div className="py-12 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold mb-10 text-center text-yellow-400">
          🏁 DAFTAR LOMBA MEMBER
        </h2>
        <p className="text-center text-gray-300 mb-2 max-w-3xl mx-auto">
          Lihat lomba apa saja yang diikuti anggota komunitas 3One Runners.
          Rencanakan kumpul bersama atau jadikan inspirasi lomba Anda
          berikutnya!
        </p>
        <RaceList />
      </div>
    </div>
  );
};

export default RaceListPage;
