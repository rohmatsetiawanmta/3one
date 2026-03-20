import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
// import { MetricItem } from "../components/SharedComponents";

const Home = () => {
  return (
    <div className="text-white">
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center justify-center text-center overflow-visible -mt-[74px] px-4"
      >
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center gap-3 md:gap-5 pt-28 pb-24">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
            ONE THREAD
          </h2>

          <div className="py-1">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-blue-950 bg-white drop-shadow-2xl px-3 md:px-6 py-1 rounded-lg md:rounded-2xl inline-block">
              ONE GOAL
            </h2>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-white drop-shadow-2xl">
            ONE FINISH LINE
          </h2>
          <Link
            to="/races"
            className="mt-8 md:mt-14 inline-flex items-center gap-2 md:gap-4 px-8 py-3.5 md:px-12 md:py-5 bg-blue-600 text-white font-bold text-base md:text-xl rounded-full shadow-2xl hover:bg-blue-500 hover:scale-105 transition-all duration-300 ease-out transform uppercase tracking-widest group"
          >
            Race List
            <ArrowRight
              className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-2 transition-transform duration-300"
              strokeWidth={3}
            />
          </Link>
        </div>
      </section>

      {/* Section About (Non-aktif sesuai kode asli Anda, namun sudah dibuat responsif) */}
      {/* <section id="about-section" className="py-16 md:py-24 bg-white text-black text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight mb-8 uppercase text-blue-900">
            SEMANGAT LARI
          </h2>
          <p className="text-base md:text-xl mx-auto max-w-3xl leading-relaxed text-slate-700">
            Lebih dari sekadar olahraga, lari adalah gaya hidup. Kami berdedikasi 
            untuk menyediakan lingkungan yang suportif, ramah, dan mendorong.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16">
            <MetricItem icon="3x" title="Lari Mingguan" subtitle="Konsistensi" />
            <MetricItem icon="250+" title="Total Anggota" subtitle="Komunitas" />
            <MetricItem icon="50+" title="Rute" subtitle="Eksplorasi" />
            <MetricItem icon="4+" title="Acara" subtitle="Tantangan" />
          </div>
        </div>
      </section> 
      */}
    </div>
  );
};

export default Home;
