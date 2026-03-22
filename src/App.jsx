import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RaceListPage from "./pages/RaceListPage";
import MembersPage from "./pages/MembersPage";
import AuthPage from "./pages/AuthPage"; // Import halaman baru

const App = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Header />
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/races" element={<RaceListPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/auth" element={<AuthPage />} /> {/* Route Auth */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
