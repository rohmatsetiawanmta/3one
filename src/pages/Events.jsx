// src/pages/Events.jsx (Setelah Perubahan Warna)
import React from "react";
// import { supabase } from '../utils/supabaseClient'; // Jika ingin fetch

const mockEvents = [
  {
    id: 1,
    name: "Lari Pagi Santai (5K)",
    date: "Sabtu, 14 Des 2025",
    time: "06:00 WIB",
    location: "Taman Kota",
    description:
      "Sesi lari ringan untuk pemanasan akhir pekan. Cocok untuk semua level.",
    // Menggunakan warna netral/kontras yang aman
    color: "bg-gray-700",
  },
  {
    id: 2,
    name: "Latihan Interval (Track)",
    date: "Rabu, 18 Des 2025",
    time: "19:00 WIB",
    location: "Stadion Utama",
    description:
      "Fokus pada kecepatan dengan sesi 400m repetisi. Perlu stamina ekstra!",
    // Menggunakan warna Aksen Biru Gelap
    color: "bg-blue-900",
  },
  {
    id: 3,
    name: "Long Run (15K)",
    date: "Minggu, 22 Des 2025",
    time: "05:30 WIB",
    location: "Rute Pesisir",
    description:
      "Lari jarak jauh untuk persiapan maraton. Bawa hidrasi yang cukup.",
    // Menggunakan warna netral/kontras yang aman
    color: "bg-gray-700",
  },
  {
    id: 4,
    name: "Recovery Jog (3K)",
    date: "Senin, 23 Des 2025",
    time: "18:30 WIB",
    location: "Komplek Perumahan",
    description: "Lari santai pemulihan setelah Long Run. Sangat pelan!",
    // Menggunakan warna Aksen Biru Gelap
    color: "bg-blue-900",
  },
];

const EventCard = ({ event }) => (
  // Teks putih karena background gelap
  <div className={`p-6 rounded-lg shadow-xl ${event.color} text-white`}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-2xl font-bold">{event.name}</h3>
      <span className="text-sm font-semibold opacity-80">{event.date}</span>
    </div>
    <p className="text-xl font-semibold mb-3">
      {event.time} @ {event.location}
    </p>
    <p className="opacity-90">{event.description}</p>
  </div>
);

const Events = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-white text-center">
        📅 Jadwal Lari Komunitas
      </h2>
      <p className="text-center text-gray-300">
        Jangan lewatkan sesi lari mingguan kami! Semua sesi dimulai tepat waktu.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className="p-6 bg-blue-900 border-l-4 border-yellow-400 text-white rounded-md">
        <p className="font-semibold">Tips Integrasi Supabase:</p>
        <p>
          Gunakan `useEffect` untuk mengambil jadwal lari dari database Supabase
          Anda.
        </p>
      </div>
    </div>
  );
};

export default Events;
