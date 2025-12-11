// src/pages/Home.jsx (Setelah Perubahan Warna)
import React from "react";

const Home = ({ setCurrentView }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section: Latar Biru Gelap, Teks Putih */}
      <header className="bg-blue-900 text-white rounded-lg shadow-xl p-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Selamat Datang di 3One Runners!
        </h1>
        <p className="text-xl">
          Komunitas lari paling bersemangat di kota! Mari berlari bersama, raih
          PB baru, dan bangun koneksi yang kuat.
        </p>
        <button
          onClick={() => setCurrentView("events")}
          // Tombol Aksi: Teks Hitam, Background Putih
          className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-200 transition duration-300"
        >
          Lihat Jadwal Lari
        </button>
      </header>

      {/* About Section: Latar Putih, Teks Dominan Hitam, Aksen Biru Gelap */}
      <section className="bg-white p-8 rounded-lg shadow-lg text-black">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Tentang Kami</h2>
        <p className="text-gray-700 leading-relaxed">
          Kami didirikan pada tahun 2024 oleh sekelompok penggemar lari. Misi
          kami sederhana: mendorong setiap anggota untuk mencapai potensi
          terbaik mereka, terlepas dari tingkat keahlian. Kami mengadakan sesi
          lari rutin 3 kali seminggu, mulai dari lari santai hingga latihan
          interval intensif.
        </p>
      </section>

      {/* Mission/Values Section: Teks Dominan Hitam, Aksen Biru Gelap */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            🤝 Kebersamaan
          </h3>
          <p className="text-gray-600">
            Lari sebagai tim, merayakan setiap pencapaian bersama.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            🚀 Progres
          </h3>
          <p className="text-gray-600">
            Berusaha lebih baik setiap hari, baik dalam kecepatan maupun jarak.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            🌲 Kesehatan
          </h3>
          <p className="text-gray-600">
            Menjaga tubuh dan pikiran yang sehat melalui lari.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
