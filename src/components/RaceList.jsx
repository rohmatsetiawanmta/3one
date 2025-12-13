// src/components/RaceList.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  MapPin,
  Calendar,
  ExternalLink,
  Instagram,
  Plus,
  X,
  Search,
  Pencil, // Icon untuk Edit
} from "lucide-react";

// --- Komponen Modal Pendaftaran Baru: RegistrationModal ---
const RegistrationModal = ({
  isOpen,
  onClose,
  race,
  members,
  onRegisterSuccess,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    if (isOpen && race && race.categories.length > 0) {
      setSelectedCategory(race.categories[0]);
    }
    if (isOpen && members.length > 0) {
      setSelectedMemberId(members[0].id);
    } else if (isOpen && members.length === 0) {
      setRegisterError(
        "Tidak dapat mendaftar: Data Anggota (Profiles) kosong."
      );
    }
  }, [isOpen, race, members]);

  if (!isOpen || !race) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisterError(null);

    if (!selectedMemberId) {
      setRegisterError("Nama member wajib dipilih.");
      setLoading(false);
      return;
    }

    if (!selectedCategory) {
      setRegisterError("Kategori wajib dipilih.");
      setLoading(false);
      return;
    }

    const insertData = {
      race_id: race.id,
      member_id: selectedMemberId,
      category_joined: selectedCategory,
    };

    const { error } = await supabase
      .from("race_registrations")
      .insert([insertData])
      .select()
      .maybeSingle();

    if (error && error.code !== "23505") {
      console.error("Error registering:", error);
      setRegisterError(`Gagal mendaftar: ${error.message}`);
    } else if (error && error.code === "23505") {
      const memberNick =
        members.find((m) => m.id === selectedMemberId)?.nick_name ||
        "Anggota ini";
      setRegisterError(
        `${memberNick} sudah terdaftar untuk kategori ${selectedCategory} di lomba ini.`
      );
    } else {
      setRegisterError(null);
      onRegisterSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-sm w-full border border-yellow-400">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-yellow-400">
            Daftar: {race.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Pilih nama Anda dan kategori lari yang diikuti.
        </p>

        {registerError && (
          <div className="p-3 mb-4 bg-red-900 text-red-300 rounded text-sm">
            {registerError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Input Member/Nama */}
          <div className="mb-4">
            <label
              htmlFor="member"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Nama Member (Nick Name)
            </label>
            <select
              id="member"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
              disabled={members.length === 0}
            >
              {members.length === 0 ? (
                <option value="">Memuat Anggota...</option>
              ) : (
                members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.nick_name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Input Kategori */}
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Pilih Kategori
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
            >
              {race.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition disabled:bg-gray-500"
              disabled={loading || members.length === 0}
            >
              {loading ? "Mendaftar..." : "Konfirmasi Daftar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Komponen Modal Tambah/Edit Lomba: RaceModal (FIXED SCROLL) ---
const RaceModal = ({ isOpen, onClose, onSaveOrUpdate, initialRaceData }) => {
  const isEditing = !!initialRaceData;
  const [raceData, setRaceData] = useState({
    name: "",
    location: "",
    date: "",
    categories: "",
    organizer_url: "",
    instagram_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (initialRaceData) {
      setRaceData({
        name: initialRaceData.name,
        location: initialRaceData.location,
        date: initialRaceData.date,
        categories: initialRaceData.categories
          ? initialRaceData.categories.join(", ")
          : "",
        organizer_url: initialRaceData.organizer_url || "",
        instagram_url: initialRaceData.instagram_url || "",
      });
    } else {
      setRaceData({
        name: "",
        location: "",
        date: "",
        categories: "",
        organizer_url: "",
        instagram_url: "",
      });
    }
  }, [initialRaceData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setRaceData({ ...raceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveError(null);

    const categoriesArray = raceData.categories
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");

    if (categoriesArray.length === 0) {
      setSaveError("Kategori Lomba wajib diisi. Pisahkan dengan koma.");
      setLoading(false);
      return;
    }

    const payload = {
      name: raceData.name,
      location: raceData.location,
      date: raceData.date,
      categories: categoriesArray,
      organizer_url: raceData.organizer_url || null,
      instagram_url: raceData.instagram_url || null,
    };

    let error;

    if (isEditing) {
      // OPERASI UPDATE
      const response = await supabase
        .from("races")
        .update(payload)
        .eq("id", initialRaceData.id);
      error = response.error;
    } else {
      // OPERASI INSERT (Tambah Baru)
      const response = await supabase.from("races").insert([payload]);
      error = response.error;
    }

    if (error) {
      console.error("Error saving race:", error);
      setSaveError(`Gagal menyimpan lomba: ${error.message}`);
    } else {
      setSaveError(null);
      onSaveOrUpdate();
      onClose(); // Menutup dan mereset melalui close handler di parent
    }
    setLoading(false);
  };

  return (
    // Wrapper Modal: Memungkinkan scroll pada modal itu sendiri
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Konten Modal: Batasi tinggi dan tambahkan overflow-y-auto */}
      {/* NOTE: scrollbar-hide harus didefinisikan di src/index.css */}
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-lg w-full border border-blue-400 max-h-[90vh] my-auto overflow-y-auto scrollbar-hide">
        <h3 className="text-2xl font-bold text-blue-400 mb-4">
          {isEditing ? `${initialRaceData.name}` : "Tambah Race Baru"}
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Masukkan detail lomba. Kategori harus dipisahkan dengan koma (Contoh:
          5K, 10K, HM, FM).
        </p>

        {saveError && (
          <div className="p-3 mb-4 bg-red-900 text-red-300 rounded text-sm">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nama Lomba */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Nama Lomba
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={raceData.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Lokasi */}
            <div>
              <label
                htmlFor="location"
                className="block text-gray-300 text-sm font-semibold mb-2"
              >
                Lokasi
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={raceData.location}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* Tanggal */}
            <div>
              <label
                htmlFor="date"
                className="block text-gray-300 text-sm font-semibold mb-2"
              >
                Tanggal
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={raceData.date}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="mb-4">
            <label
              htmlFor="categories"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Kategori (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={raceData.categories}
              onChange={handleChange}
              placeholder="Contoh: 5K, 10K, HM, FM"
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Organizer URL (NEW FIELD) */}
          <div className="mb-4">
            <label
              htmlFor="organizer_url"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Link Situs Resmi (URL)
            </label>
            <input
              type="url"
              id="organizer_url"
              name="organizer_url"
              value={raceData.organizer_url}
              onChange={handleChange}
              placeholder="https://www.lomba.com"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Instagram URL (NEW FIELD) */}
          <div className="mb-6">
            <label
              htmlFor="instagram_url"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Instagram (URL)
            </label>
            <input
              type="url"
              id="instagram_url"
              name="instagram_url"
              value={raceData.instagram_url}
              onChange={handleChange}
              placeholder="https://instagram.com/nama_lomba"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            {/* Menambahkan margin top pada tombol */}
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition disabled:bg-gray-500"
              disabled={loading}
            >
              {loading
                ? "Menyimpan..."
                : isEditing
                ? "Update Lomba"
                : "Simpan Lomba"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Komponen Modal Daftar Peserta Baru: ParticipantsModal (UPDATED SCROLLBAR HIDE) ---
const ParticipantsModal = ({ isOpen, onClose, race }) => {
  if (!isOpen || !race) return null;

  const participants = race.registrations || [];

  // 1. Group participants by category_joined
  const groupedParticipants = participants.reduce((acc, registration) => {
    const category = registration.category_joined;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(registration);
    return acc;
  }, {});

  // 2. Get sorted categories (Custom sort: FM, HM, lalu alphabetical)
  const categories = Object.keys(groupedParticipants).sort((a, b) => {
    // Priority 1: Full Marathon (FM)
    if (
      a.toLowerCase().includes("marathon") &&
      !a.toLowerCase().includes("half")
    )
      return -1;
    if (
      b.toLowerCase().includes("marathon") &&
      !b.toLowerCase().includes("half")
    )
      return 1;

    // Priority 2: Half Marathon (HM)
    if (a.toLowerCase().includes("half marathon")) return -1;
    if (b.toLowerCase().includes("half marathon")) return 1;

    // Priority 3: Alphabetical sort for others
    return a.localeCompare(b);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Konten Modal: Tambahkan 'scrollbar-hide' */}
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-lg w-full border border-yellow-400 max-h-[90vh] my-auto overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-yellow-400">{race.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {participants.length === 0 ? (
          <p className="text-gray-400">
            Belum ada anggota yang mendaftar untuk lomba ini.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-300 mb-4">
              Total {participants.length} anggota terdaftar.
            </p>
            {/* Konten yang bisa di scroll: Tambahkan 'scrollbar-hide' */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-hide">
              {categories.map((category) => (
                <div key={category}>
                  {/* Kategori Badge (Ukuran Lebih Besar) */}
                  <span className="inline-block px-3 py-1 bg-blue-900 text-lg font-extrabold text-blue-300 rounded-lg mb-2">
                    {category} ({groupedParticipants[category].length})
                  </span>

                  {/* Daftar Anggota (Flex Layout dengan Badge Nama) */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {groupedParticipants[category].map((p, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-700 text-white text-sm rounded-full shadow-sm hover:bg-gray-600 transition"
                      >
                        {p.member.nick_name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Utama: RaceList (UPDATED: Vertical Action Column) ---
const RaceList = ({ session }) => {
  const [races, setRaces] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRace, setEditingRace] = useState(null);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedRace, setSelectedRace] = useState(null);

  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantsRace, setParticipantsRace] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateString) => {
    try {
      const options = { day: "numeric", month: "short", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", options);
    } catch {
      return dateString;
    }
  };

  const closeRaceModal = () => {
    setIsModalOpen(false);
    setEditingRace(null);
  };

  const openAddModal = () => {
    setEditingRace(null);
    setIsModalOpen(true);
  };

  const openEditModal = (race) => {
    setEditingRace(race);
    setIsModalOpen(true);
  };

  const openRegistrationModal = (race) => {
    if (members.length > 0) {
      setSelectedRace(race);
      setIsRegisterModalOpen(true);
    } else {
      alert("Gagal memuat data member. Tidak dapat melanjutkan pendaftaran.");
    }
  };

  const openParticipantsModal = (race) => {
    setParticipantsRace(race);
    setIsParticipantsModalOpen(true);
  };

  // --- Fungsi Fetch Members (Tidak Berubah) ---
  const fetchMembers = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, nick_name")
      .order("nick_name", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error.message);
      setMembers([]);
    } else {
      setMembers(data);
    }
  }, []);

  // --- Fungsi Fetch Races (Tidak Berubah) ---
  const fetchRaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from("races").select(`
          id,
          name,
          date,
          location,
          categories,
          organizer_url,   
          instagram_url,   
          registrations:race_registrations (
            category_joined,
            member:profiles ( nick_name )
          )
        `);

    if (searchQuery) {
      const queryTerm = `%${searchQuery}%`;
      query = query.or(`name.ilike.${queryTerm},location.ilike.${queryTerm}`);
    }

    const { data, error } = await query.order("date", { ascending: true });

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
  }, [searchQuery]);

  useEffect(() => {
    fetchMembers();
    fetchRaces();
  }, [fetchRaces, fetchMembers]);

  // Cek apakah user sudah login (sebagai admin sementara)
  const isAdmin = !!session;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tombol Add Race dan Search Bar */}
      <div className="flex flex-wrap gap-4 mb-8 justify-between items-end">
        {/* Kontrol Search Bar */}
        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Cari lomba berdasarkan nama atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-blue-900 bg-gray-800 text-white rounded-lg focus:ring-blue-400 focus:border-blue-400"
          />
        </div>

        {/* Tombol Add Race (CONDITIONAL) */}
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Race Baru</span>
          </button>
        )}
      </div>

      {/* Daftar Lomba (Table Layout) */}
      <div className="w-full overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
        {loading && (
          <p className="text-center p-8 text-blue-400 animate-pulse">
            Memuat daftar lomba dari database...
          </p>
        )}

        {!loading && error && (
          <p className="text-center p-8 text-red-500">{error}</p>
        )}

        {/* PESAN JIKA TIDAK DITEMUKAN SETELAH SEARCH */}
        {!loading && races.length === 0 && !error && (
          <p className="text-center p-8 text-gray-400">
            Race tidak ditemukan. Silakan tambah race baru.
          </p>
        )}

        {!loading && races.length > 0 && (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Lomba
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Peserta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {races.map((race) => (
                <tr
                  key={race.id}
                  className="hover:bg-gray-700 transition duration-150"
                >
                  {/* Kolom Lomba */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-400">
                      {race.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span>{race.location}</span>
                      <Calendar className="w-3 h-3 text-gray-500 ml-2" />
                      <span>{formatDate(race.date)}</span>
                    </div>
                  </td>

                  {/* Kolom Kategori */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {race.categories.map((category, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-green-900 text-green-300 rounded-md text-xs font-bold"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Kolom Peserta */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white mb-1">
                      {race.registrations ? race.registrations.length : 0}{" "}
                      Anggota
                    </div>
                    {race.registrations && race.registrations.length > 0 && (
                      <button
                        onClick={() => openParticipantsModal(race)}
                        className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                      >
                        Lihat Anggota
                      </button>
                    )}
                  </td>

                  {/* Kolom Aksi (VERTICALLY STACKED) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2 items-start">
                      {/* Tombol Edit (Hanya tampil jika Admin Login) */}
                      {isAdmin && (
                        <button
                          onClick={() => openEditModal(race)}
                          className="text-blue-500 hover:text-blue-300 text-xs font-semibold flex items-center space-x-1"
                          title="Edit Detail Lomba"
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      )}

                      {/* Tombol Daftar */}
                      <button
                        onClick={() => openRegistrationModal(race)}
                        className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Daftar</span>
                      </button>

                      {/* Tautan Tambahan */}
                      {(race.organizer_url || race.instagram_url) && (
                        <div className="flex space-x-2 mt-1">
                          {race.organizer_url && (
                            <a
                              href={race.organizer_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-300 text-xs flex items-center"
                              title="Situs Resmi"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {race.instagram_url && (
                            <a
                              href={race.instagram_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-300 text-xs flex items-center"
                              title="Instagram"
                            >
                              <Instagram className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Tambah/Edit Lomba */}
      <RaceModal
        isOpen={isModalOpen}
        onClose={closeRaceModal}
        onSaveOrUpdate={fetchRaces}
        initialRaceData={editingRace}
      />

      {/* Modal Pendaftaran Lomba */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        race={selectedRace}
        members={members}
        onRegisterSuccess={fetchRaces}
      />

      {/* Modal Daftar Peserta */}
      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        race={participantsRace}
      />
    </div>
  );
};

export default RaceList;
