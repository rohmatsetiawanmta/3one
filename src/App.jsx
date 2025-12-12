// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import MembersPage from "./pages/MembersPage";
import RaceListPage from "./pages/RaceListPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import { supabase } from "./utils/supabaseClient"; // Import Supabase

const App = () => {
  const [session, setSession] = useState(null); // State untuk menampung sesi pengguna

  useEffect(() => {
    // 1. Dapatkan sesi awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Siapkan listener untuk perubahan status autentikasi
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Fungsi cleanup untuk menghentikan subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Meneruskan session ke Header */}
      <Header session={session} />

      <main>
        {/* Menggunakan Routes untuk mendefinisikan rute */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/members" element={<MembersPage />} />
          {/* Meneruskan session ke RaceListPage */}
          <Route path="/races" element={<RaceListPage session={session} />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Tambahkan rute fallback jika halaman tidak ditemukan */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer dapat ditempatkan di sini atau di Home */}
      <footer className="py-8 text-center bg-black text-gray-400">
        &copy; 2025 3One Runners.
      </footer>
    </div>
  );
};

// Komponen sederhana untuk Not Found
const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-6xl font-extrabold text-blue-400">404</h1>
    <p className="text-xl mt-4">Halaman tidak ditemukan.</p>
  </div>
);

export default App;
