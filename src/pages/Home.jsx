// src/pages/Home.jsx
import React from "react";
import { MetricItem } from "../components/SharedComponents";

const Home = () => {
  return (
    <div className="text-white">
      <section
        id="hero"
        className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden bg-black -mt-[74px]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{
            backgroundImage:
              "url('https://via.placeholder.com/1800x1000?text=Runner+Hero+Shot')",
          }}
        ></div>

        <div className="relative z-10 p-4 pt-12 flex flex-col items-center gap-2">
          <h2 className="text-7xl font-extrabold tracking-tight md:text-8xl text-white drop-shadow-lg">
            ONE THREAD
          </h2>
          <h2>
            <span className="text-7xl font-extrabold tracking-tight md:text-8xl text-blue-900 bg-white drop-shadow-lg px-4 rounded-xl">
              ONE GOAL
            </span>
          </h2>
          <h2 className="text-7xl font-extrabold tracking-tight md:text-8xl text-white drop-shadow-lg">
            ONE FINISH LINE
          </h2>
          {/* <a
            href="#about-section"
            className="mt-8 inline-block px-8 py-3 bg-blue-900 text-white font-bold rounded-full shadow-lg hover:bg-blue-800 transition duration-300"
          >
            Pelajari Lebih Lanjut
          </a> */}
        </div>
      </section>

      {/* <section
        id="about-section"
        className="py-20 bg-white text-black text-center"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-wide mb-10 uppercase text-blue-900">
            SEMANGAT LARI
          </h2>
          <p className="text-lg mx-auto max-w-3xl leading-relaxed">
            Lebih dari sekadar olahraga, lari adalah gaya hidup. Kami
            berdedikasi untuk menyediakan lingkungan yang suportif, ramah, dan
            mendorong. Bersama-sama, kami meraih Personal Best (PB) baru dan
            membangun daya tahan yang tak terkalahkan.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <MetricItem
              icon="3x"
              title="Lari Mingguan"
              subtitle="Konsistensi Kunci"
            />
            <MetricItem
              icon="250+"
              title="Total Anggota"
              subtitle="Komunitas Besar"
            />
            <MetricItem
              icon="50+"
              title="Rute Eksplorasi"
              subtitle="Jelajahi Kota"
            />
            <MetricItem
              icon="4+"
              title="Acara Utama"
              subtitle="Tantang Diri Anda"
            />
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
