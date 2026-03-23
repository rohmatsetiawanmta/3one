import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RaceListPage from "./pages/RaceListPage";
import MembersPage from "./pages/MembersPage";
import AuthPage from "./pages/AuthPage";
import EditProfilePage from "./pages/EditProfilePage";
import RaceHistoryPage from "./pages/RaceHistoryPage";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user_session");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/races" element={<RaceListPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/edit-profile"
            element={<EditProfilePage user={user} />}
          />
          <Route
            path="/race-history"
            element={<RaceHistoryPage user={user} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
