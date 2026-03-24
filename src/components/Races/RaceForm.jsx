import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Calendar,
  MapPin,
  Trophy,
  Plus,
  Layers,
  Globe,
  Instagram,
  FileText,
  ExternalLink,
  Loader2,
  Edit3,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

const RaceForm = ({ onClose, onRaceSaved, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    end_date: "",
    location: "",
    website_url: "",
    social_url: "",
    result_url: "",
    doc_url: "",
    description: "",
    categories: [],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

  // Sync initialData saat mode Edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        date: initialData.date || "",
        end_date: initialData.end_date || "",
        location: initialData.location || "",
        website_url: initialData.website_url || "",
        social_url: initialData.social_url || initialData.ig_url || "",
        result_url: initialData.result_url || "",
        doc_url: initialData.doc_url || "",
        description: initialData.description || "",
        categories: Array.isArray(initialData.categories)
          ? initialData.categories
          : [],
      });
      setLogoPreview(initialData.logo_url || "");
    }
  }, [initialData]);

  // Handle Preview Gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar!");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !formData.categories.includes(newCategory.trim())
    ) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory.trim()],
      });
      setNewCategory("");
    }
  };

  const removeCategory = (cat) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== cat),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const adminUser = JSON.parse(localStorage.getItem("user_session"));

    // Gunakan FormData untuk mengirim File + Text
    const data = new FormData();
    data.append("name", formData.name);
    data.append("date", formData.date);
    data.append("end_date", formData.end_date);
    data.append("location", formData.location);
    data.append("website_url", formData.website_url);
    data.append("social_url", formData.social_url);
    data.append("result_url", formData.result_url);
    data.append("doc_url", formData.doc_url);
    data.append("description", formData.description);
    data.append("categories", JSON.stringify(formData.categories));
    data.append("user_id", adminUser?.id);

    if (initialData?.id) data.append("id", initialData.id);
    if (logoFile) data.append("logo_file", logoFile);

    try {
      const response = await fetch(`${API_URL}?resource=races`, {
        method: "POST",
        headers: {
          "X-TOKEN": SECRET_TOKEN,
        },
        body: data,
      });

      const result = await response.json();
      if (result.status === "success") {
        onRaceSaved();
        onClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      {/* Backdrop with Heavy Blur */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl transition-all"
        onClick={onClose}
      />

      {/* Compact Central Modal */}
      <div className="relative w-full max-w-5xl bg-slate-900/80 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
                {initialData ? <Edit3 size={14} /> : <Plus size={14} />}
              </div>
              <div>
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic leading-none">
                  {initialData
                    ? "Modify Race Specification"
                    : "Register New Event Entry"}
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-white/5 rounded-full text-slate-500 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* LEFT: LOGO UPLOAD (3 COLS) */}
            <div className="md:col-span-3 flex flex-col items-center justify-center space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group">
              <div
                onClick={() => fileInputRef.current.click()}
                className="relative w-36 h-36 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 group-hover:border-blue-500/50 flex items-center justify-center overflow-hidden cursor-pointer transition-all shadow-inner"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    alt="Logo Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-700 group-hover:text-blue-500 transition-colors">
                    <Upload size={24} />
                    <span className="text-[8px] font-black uppercase mt-2">
                      Upload Square
                    </span>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-[7px] text-slate-600 font-bold uppercase italic text-center leading-relaxed">
                Format: JPG, PNG, WEBP
                <br />
                Max 2MB
              </p>
            </div>

            {/* RIGHT: MAIN DATA (9 COLS) */}
            <div className="md:col-span-9 space-y-5">
              {/* Row 1: Name & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Trophy size={10} className="text-blue-500" /> Event Name
                  </label>
                  <input
                    required
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white outline-none focus:border-blue-500/50 transition-all"
                    placeholder="e.g. UI ULTRA 2026"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <MapPin size={10} className="text-blue-500" /> Venue
                  </label>
                  <input
                    required
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white outline-none focus:border-blue-500/50 transition-all"
                    placeholder="e.g. Kampus UI Depok"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 2: Range Schedule */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-blue-500 uppercase tracking-widest ml-1">
                    Start Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-[11px] text-white outline-none focus:border-blue-500/50 [color-scheme:dark]"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-2 px-3 text-[11px] text-white outline-none focus:border-blue-500/50 [color-scheme:dark]"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 3: Technical URLs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-emerald-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Globe size={10} /> Web
                  </label>
                  <input
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2 px-3 text-[11px] text-white outline-none focus:border-emerald-500/50"
                    placeholder="https://..."
                    value={formData.website_url}
                    onChange={(e) =>
                      setFormData({ ...formData, website_url: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-pink-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Instagram size={10} /> Social
                  </label>
                  <input
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2 px-3 text-[11px] text-white outline-none focus:border-pink-500/50"
                    placeholder="Instagram URL"
                    value={formData.social_url}
                    onChange={(e) =>
                      setFormData({ ...formData, social_url: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-blue-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <ExternalLink size={10} /> Result
                  </label>
                  <input
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2 px-3 text-[11px] text-white outline-none focus:border-blue-400/50"
                    placeholder="Result Link"
                    value={formData.result_url}
                    onChange={(e) =>
                      setFormData({ ...formData, result_url: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-orange-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <FileText size={10} /> Doc
                  </label>
                  <input
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl py-2 px-3 text-[11px] text-white outline-none focus:border-orange-400/50"
                    placeholder="Gdrive Link"
                    value={formData.doc_url}
                    onChange={(e) =>
                      setFormData({ ...formData, doc_url: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Row 4: Categories Selection */}
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Race Categories (Tags)
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-slate-950/50 border border-white/5 rounded-xl py-2.5 px-4 text-[11px] text-white outline-none focus:border-blue-500/50"
                    placeholder="e.g. 5K, 10K, Half Marathon"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addCategory())
                    }
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2 min-h-[30px] items-center">
                  {formData.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 animate-in zoom-in group"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="text-blue-500/50 hover:text-white transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  {formData.categories.length === 0 && (
                    <span className="text-[9px] text-slate-700 font-black uppercase italic tracking-widest">
                      No categories defined
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-900 border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-800 transition-all"
            >
              Cancel Process
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="flex-[3] py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {initialData ? "Apply Specifications" : "Finalize Event Registry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaceForm;
