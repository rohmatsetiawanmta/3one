// src/App.jsx (Setelah Perubahan Warna)
import React, { useState } from "react";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Members from "./pages/Members";
import { supabase } from "./utils/supabaseClient";

const App = () => {
  const [currentView, setCurrentView] = useState("home");

  const renderContent = () => {
    switch (currentView) {
      case "events":
        return <Events />;
      case "members":
        return <Members />;
      case "home":
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  };

  const Nav = () => (
    // Navigasi: Latar putih, bayangan, Teks Aksen Biru Gelap
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-black">3One Runners</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentView("home")}
          className={`hover:text-blue-900 ${
            currentView === "home" ? "font-bold text-blue-900" : "text-gray-700"
          }`}
        >
          Beranda
        </button>
        <button
          onClick={() => setCurrentView("events")}
          className={`hover:text-blue-900 ${
            currentView === "events"
              ? "font-bold text-blue-900"
              : "text-gray-700"
          }`}
        >
          Acara Lari
        </button>
        <button
          onClick={() => setCurrentView("members")}
          className={`hover:text-blue-900 ${
            currentView === "members"
              ? "font-bold text-blue-900"
              : "text-gray-700"
          }`}
        >
          Anggota
        </button>
      </div>
    </nav>
  );

  return (
    // Background utama menjadi lebih gelap atau netral
    <div className="min-h-screen bg-gray-900 text-white">
      <Nav />
      <main className="container mx-auto p-4">{renderContent()}</main>
    </div>
  );
};

export default App;
