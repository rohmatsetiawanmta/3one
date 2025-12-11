import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import MembersPage from "./pages/MembersPage";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header TIDAK LAGI menerima props routing */}
      <Header />

      <main>
        {/* Menggunakan Routes untuk mendefinisikan rute */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/members" element={<MembersPage />} />

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
