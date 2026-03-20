import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RaceListPage from "./pages/RaceListPage";
import MembersPage from "./pages/MembersPage";
import EventsPage from "./pages/EventsPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/races" element={<RaceListPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
