import React from "react";
import RaceList from "../components/Races/RaceList";

const RaceListPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 pt-4 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-tight">
            RACE <span className="text-blue-500">LIST</span>
          </h1>
          <div className="mt-2 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <p className="text-slate-400 text-sm md:text-base">
              Lihat race apa saja yang diikuti anggota komunitas 3One Runners.
              <br />
              <span className="text-blue-400 text-sm md:text-base font-bold italic">
                Ayo kumpul bareng abis race!
              </span>
            </p>
          </div>
        </header>

        <RaceList />
      </div>
    </div>
  );
};

export default RaceListPage;
