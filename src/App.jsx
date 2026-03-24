import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RaceListPage from "./pages/RaceListPage";
import MembersPage from "./pages/MembersPage";
import AuthPage from "./pages/AuthPage";
import EditProfilePage from "./pages/EditProfilePage";
import RaceHistoryPage from "./pages/RaceHistoryPage";

// Admin Pages
import UserManagement from "./pages/admin/UserManagement";
import ResultManagement from "./pages/admin/ResultManagement";
import ActivityLog from "./pages/admin/ActivityLog";
import RaceManagement from "./pages/admin/RaceManagement";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  useEffect(() => {
    const syncSession = async () => {
      const savedSession = localStorage.getItem("user_session");
      console.log("Syncing session, found in localStorage:", savedSession);
      if (savedSession) {
        try {
          const { id, token } = JSON.parse(savedSession);

          const response = await fetch(
            `${API_URL}?resource=users&id=${id}&token=${token}`,
            {
              headers: {
                "X-TOKEN": SECRET_TOKEN,
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          if (result.status === "success" && result.data.length > 0) {
            setUser(result.data[0]);
          } else {
            localStorage.removeItem("user_session");
            setUser(null);
          }
        } catch (error) {
          console.error("Gagal sinkronisasi sesi:", error);
        }
      }
      setLoading(false);
    };

    syncSession();
  }, [API_URL, SECRET_TOKEN]);

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8 md:px-6 lg:px-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/races" element={<RaceListPage user={user} />} />
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

          <Route
            path="/admin/users"
            element={
              user?.role === "admin" ? <UserManagement /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/results"
            element={
              user?.role === "admin" ? (
                <ResultManagement />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/logs"
            element={
              user?.role === "admin" ? <ActivityLog /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/races"
            element={
              user?.role === "admin" ? <RaceManagement /> : <Navigate to="/" />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
