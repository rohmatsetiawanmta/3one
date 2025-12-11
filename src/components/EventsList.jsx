// src/components/EventsList.jsx
import React from "react";

const mockEvents = [
  // Tambahkan lebih banyak data agar terlihat seperti halaman penuh
  {
    id: 1,
    name: "Lari Pagi Santai (5K)",
    date: "Sabtu, 14 Des",
    time: "06:00 WIB",
    location: "Taman Kota",
    description: "Sesi ringan untuk pemanasan akhir pekan.",
  },
  {
    id: 2,
    name: "Latihan Interval",
    date: "Rabu, 18 Des",
    time: "19:00 WIB",
    location: "Stadion Utama",
    description: "Fokus pada kecepatan 400m/800m. Perlu stamina ekstra!",
  },
  {
    id: 3,
    name: "Long Run (15K)",
    date: "Minggu, 22 Des",
    time: "05:30 WIB",
    location: "Rute Pesisir",
    description: "Lari jarak jauh untuk persiapan maraton. Bawa hidrasi wajib.",
  },
  {
    id: 4,
    name: "Recovery Jog",
    date: "Senin, 23 Des",
    time: "18:30 WIB",
    location: "Taman Gelora",
    description: "Lari sangat santai untuk pemulihan otot.",
  },
  {
    id: 5,
    name: "Hill Repeats Challenge",
    date: "Kamis, 26 Des",
    time: "19:00 WIB",
    location: "Jalan Menanjak Cikidang",
    description: "Latihan daya tahan tanjakan yang intensif.",
  },
];

const EventCard = ({ event }) => (
  // Kartu Biru Gelap
  <div className="p-5 rounded-xl shadow-lg bg-blue-900 text-white flex justify-between items-center hover:bg-blue-800 transition duration-300">
    <div>
      <div className="text-sm font-light opacity-80">
        {event.date} | {event.time}
      </div>
      <h3 className="text-xl font-bold mt-1">{event.name}</h3>
      <p className="text-sm opacity-90 mt-2">{event.description}</p>
    </div>
    <div className="flex-shrink-0 ml-4">
      <button className="text-blue-900 bg-white px-4 py-1 rounded-full text-xs font-semibold">
        Detail
      </button>
    </div>
  </div>
);

const EventsList = ({ isFullPage = false }) => {
  const eventsToShow = isFullPage ? mockEvents : mockEvents.slice(0, 3); // Jika bukan halaman penuh, batasi

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {eventsToShow.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      <div className="md:col-span-2 lg:col-span-3 p-4 text-center text-gray-400 mt-4">
        <p>Hubungi admin untuk mendaftar acara lari eksklusif komunitas.</p>
      </div>
    </div>
  );
};

export default EventsList;
