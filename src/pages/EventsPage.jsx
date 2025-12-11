// src/pages/EventsPage.jsx
import React from "react";
import EventsList from "../components/EventsList";

const EventsPage = () => {
  return (
    <div className="py-12 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold mb-10 text-center text-blue-400">
          Events
        </h2>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          Temukan sesi latihan mingguan kami. Dari lari santai (recovery jog)
          hingga latihan interval intensif, kami punya jadwal untuk semua level.
        </p>
        <EventsList isFullPage={true} />
      </div>
    </div>
  );
};

export default EventsPage;
