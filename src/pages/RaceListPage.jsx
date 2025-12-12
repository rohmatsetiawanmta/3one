// src/pages/RaceListPage.jsx
import React from "react";
import RaceList from "../components/RaceList";

const RaceListPage = ({ session }) => {
  return (
    <div className="py-12 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-yellow-400">
          DAFTAR RACE
        </h2>
        <p className="text-center text-gray-300 mt-4 mb-8 max-w-3xl mx-auto">
          Lihat lomba apa saja yang diikuti anggota komunitas 3One Runners.
          <br />
          Ayo kumpul bareng abis race!
        </p>
        <RaceList session={session} />
      </div>
    </div>
  );
};

export default RaceListPage;
