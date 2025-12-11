// src/components/RaceList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../utils/supabaseClient";

// Komponen kartu untuk menampilkan satu lomba (Tidak Berubah)
const RaceCard = ({ race }) => {
  // Menggunakan race.registrations (hasil join Supabase)
  const participants = race.registrations || [];
  const visibleParticipants = participants.slice(0, 3);
  const remainingCount = participants.length - visibleParticipants.length;

  // Fungsi utilitas untuk memformat tanggal
  const formatDate = (dateString) => {
    try {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", options);
    } catch {
      return dateString; // Fallback jika format tanggal tidak valid
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-lg bg-gray-800 text-white flex flex-col justify-between h-full border border-yellow-400">
      <div>
        {/* === BADGE LOKASI DAN TANGGAL === */}
        <div className="flex flex-wrap gap-2 mb-3 text-sm font-semibold">
          {/* Badge Lokasi */}
          <span className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full">
            📍 {race.location}
          </span>
          {/* Badge Tanggal */}
          <span className="px-3 py-1 bg-blue-900 text-yellow-300 rounded-full">
            📅 {formatDate(race.date)}
          </span>
        </div>
        {/* === END BADGE LOKASI DAN TANGGAL === */}

        <h3 className="text-3xl font-extrabold text-blue-400 leading-tight">
          {race.name}
        </h3>

        <p className="text-sm mt-4 text-gray-300 font-semibold mb-2">
          Kategori Tersedia:
        </p>

        {/* === BADGE KATEGORI === */}
        <div className="flex flex-wrap gap-2 mb-4">
          {race.categories &&
            race.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-green-900 text-green-300 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                {category}
              </span>
            ))}
        </div>
        {/* === END BADGE KATEGORI === */}

        <p className="text-sm mt-4 text-gray-400">
          {participants.length} Anggota Terdaftar:
          <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
            {participants.length === 0 ? (
              <li className="text-gray-400 text-sm italic list-none ml-0">
                Belum ada yang mendaftar. Jadilah yang pertama!
              </li>
            ) : (
              visibleParticipants.map((p, index) => (
                <li key={index} className="text-white text-sm">
                  {/* Mengakses nick_name dari relasi member:profiles */}
                  <span className="font-semibold">{p.member.nick_name}</span> (
                  {p.category_joined})
                </li>
              ))
            )}

            {remainingCount > 0 && (
              <li className="text-gray-400 text-sm italic">
                ...dan {remainingCount} lainnya.
              </li>
            )}
          </ul>
        </p>
      </div>
      <div className="mt-6">
        <button className="w-full py-3 bg-blue-900 text-white rounded-lg text-md font-bold hover:bg-blue-700 transition duration-300 shadow-md">
          Daftar Race Ini
        </button>
      </div>
    </div>
  );
};

const RaceList = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STATE FILTER BARU ---
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(""); // Kosong untuk semua bulan

  const monthNames = useMemo(
    () => [
      { value: "", label: "Semua Bulan" },
      { value: "01", label: "Januari" },
      { value: "02", label: "Februari" },
      { value: "03", label: "Maret" },
      { value: "04", label: "April" },
      { value: "05", label: "Mei" },
      { value: "06", label: "Juni" },
      { value: "07", label: "Juli" },
      { value: "08", label: "Agustus" },
      { value: "09", label: "September" },
      { value: "10", label: "Oktober" },
      { value: "11", label: "November" },
      { value: "12", label: "Desember" },
    ],
    []
  );

  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear - 1; i <= currentYear + 3; i++) {
      years.push(i.toString());
    }
    return years;
  }, [currentYear]);

  useEffect(() => {
    async function fetchRaces() {
      setLoading(true);
      setError(null);

      let query = supabase.from("races").select(`
          id,
          name,
          date,
          location,
          categories,
          registrations:race_registrations (
            category_joined,
            member:profiles ( nick_name )
          )
        `);

      // --- LOGIKA FILTER SUPABASE BERDASARKAN BULAN & TAHUN ---
      if (selectedYear) {
        let startDate, endDate;

        if (selectedMonth) {
          // Filter Spesifik Bulan dan Tahun
          const monthIndex = parseInt(selectedMonth, 10);
          const year = parseInt(selectedYear, 10);

          // Mendapatkan hari pertama bulan yang dipilih
          startDate = `${selectedYear}-${selectedMonth}-01`;

          // Mendapatkan hari terakhir bulan yang dipilih
          const nextMonth = monthIndex === 12 ? 1 : monthIndex + 1;
          const nextYear = monthIndex === 12 ? year + 1 : year;
          endDate = new Date(nextYear, nextMonth - 1, 0)
            .toISOString()
            .split("T")[0];
        } else {
          // Filter Hanya Berdasarkan Tahun
          startDate = `${selectedYear}-01-01`;
          endDate = `${selectedYear}-12-31`;
        }

        // Terapkan filter range date: date >= startDate AND date <= endDate
        query = query.gte("date", startDate).lte("date", endDate);
      }
      // -----------------------------------------------------------

      const { data, error } = await query.order("date", { ascending: true }); // Urutkan berdasarkan tanggal lomba

      if (error) {
        console.error("Error fetching races:", error.message);
        setError(
          `Gagal memuat data lomba: ${error.message}. Pastikan RLS dikonfigurasi.`
        );
        setRaces([]);
      } else {
        setRaces(
          data.filter((race) => race.categories && race.categories.length > 0)
        );
      }
      setLoading(false);
    }

    // Panggil fungsi fetch data
    fetchRaces();
  }, [selectedYear, selectedMonth]); // Re-fetch saat filter berubah

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <div className="flex flex-col">
          <label
            htmlFor="year-filter"
            className="text-sm font-medium text-gray-400 mb-1"
          >
            Tahun
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-2 border border-blue-900 bg-gray-800 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="month-filter"
            className="text-sm font-medium text-gray-400 mb-1"
          >
            Bulan
          </label>
          <select
            id="month-filter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border border-blue-900 bg-gray-800 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400"
          >
            {monthNames.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* ---------------------- */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && (
          <p className="text-center col-span-full text-blue-400 animate-pulse">
            Memuat daftar lomba dari database...
          </p>
        )}

        {!loading && error && (
          <p className="text-center col-span-full text-red-500">{error}</p>
        )}

        {!loading && races.length === 0 && !error && (
          <p className="text-center col-span-full text-gray-400">
            Tidak ada lomba lari yang ditemukan untuk periode ini.
          </p>
        )}

        {races.map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </div>
    </div>
  );
};

export default RaceList;
