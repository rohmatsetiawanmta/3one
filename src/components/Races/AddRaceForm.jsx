import React, { useState } from "react";
import { X, Save, Plus } from "lucide-react";

const AddRaceForm = ({ onRaceAdded, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    categories: [],
    website_url: "",
    social_url: "",
    logo_url: "",
    description: "",
  });
  const [newCat, setNewCat] = useState("");

  // Ambil config dari environment variables
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  const addCategory = () => {
    if (newCat && !formData.categories.includes(newCat)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCat],
      });
      setNewCat("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      alert("Nama Event dan Tanggal wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert("Race berhasil ditambahkan!");
        onRaceAdded(); // Memicu fetchData() di RaceList
        onClose(); // Menutup modal form
      } else {
        alert("Gagal: " + (result.message || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error adding race:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Tambah Race Baru
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Nama Event *
            </label>
            <input
              required
              type="text"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Contoh: Jakarta Marathon 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Tanggal *
              </label>
              <input
                required
                type="date"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Lokasi
              </label>
              <input
                type="text"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="GBK, Jakarta"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Kategori (5K, 10K, dll)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Tambah kategori..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCategory())
                }
              />
              <button
                type="button"
                onClick={addCategory}
                className="p-3 bg-slate-800 text-blue-500 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.categories.map((c, i) => (
                <span
                  key={i}
                  className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-tighter"
                >
                  {c}{" "}
                  <X
                    size={12}
                    className="cursor-pointer hover:text-red-400"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        categories: formData.categories.filter(
                          (cat) => cat !== c
                        ),
                      })
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Link Website
            </label>
            <input
              type="url"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
              value={formData.website_url}
              onChange={(e) =>
                setFormData({ ...formData, website_url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              URL Logo
            </label>
            <input
              type="text"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none"
              value={formData.logo_url}
              onChange={(e) =>
                setFormData({ ...formData, logo_url: e.target.value })
              }
              placeholder="https://link-gambar.com/logo.png"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900">
          <button
            disabled={loading}
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-sm shadow-lg shadow-blue-900/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} /> Simpan Race
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRaceForm;
