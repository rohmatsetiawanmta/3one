import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Calendar,
  MapPin,
  Instagram,
  Link,
  Image as ImageIcon,
  Award,
  Plus,
  Tag,
} from "lucide-react";

const RaceForm = ({ onClose, onRaceSaved, initialData }) => {
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    end_date: "",
    location: "",
    categories: [],
    website_url: "",
    social_url: "",
    logo_url: "",
    result_url: "",
    doc_url: "",
    description: "",
  });

  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        logo_url: initialData.logo_url || "",
        website_url: initialData.website_url || "",
        social_url: initialData.social_url || "",
        result_url: initialData.result_url || "",
        doc_url: initialData.doc_url || "",
        description: initialData.description || "",
        categories: Array.isArray(initialData.categories)
          ? initialData.categories
          : [],
      });
      setIsMultiDay(!!initialData.end_date);
    }
  }, [initialData]);

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
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const SECRET_TOKEN = import.meta.env.VITE_SECRET_TOKEN;

    const dataToSend = {
      ...formData,
      end_date: isMultiDay ? formData.end_date : null,
    };

    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData
        ? `${API_URL}?resource=races&id=${initialData.id}`
        : `${API_URL}?resource=races`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-TOKEN": SECRET_TOKEN,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();
      if (result.status === "success") {
        onRaceSaved();
        onClose();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in">
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">
              {initialData ? "Edit Race" : "Create New Race"}
            </h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
              Identity & Logistics
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {/* Row 1: Event Name */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Event Name
            </label>
            <input
              required
              type="text"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-semibold"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Jakarta Marathon 2026"
            />
          </div>

          {/* Row 2: Date Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Date Schedule
              </label>
              <button
                type="button"
                onClick={() => setIsMultiDay(!isMultiDay)}
                className={`text-[9px] font-black px-3 py-1 rounded-lg border transition-all ${
                  isMultiDay
                    ? "bg-blue-600 border-blue-400 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-500"
                }`}
              >
                {isMultiDay ? "✓ MULTI-DAY ACTIVE" : "+ ADD END DATE"}
              </button>
            </div>
            <div
              className={`grid ${
                isMultiDay ? "grid-cols-2" : "grid-cols-1"
              } gap-4 animate-in fade-in duration-300`}
            >
              <div className="space-y-2">
                <input
                  required
                  type="date"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 transition-all"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                {isMultiDay && (
                  <p className="text-[9px] text-slate-600 font-bold uppercase ml-1">
                    Start Date
                  </p>
                )}
              </div>
              {isMultiDay && (
                <div className="space-y-2 animate-in slide-in-from-left-2">
                  <input
                    type="date"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 transition-all"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                  <p className="text-[9px] text-slate-600 font-bold uppercase ml-1">
                    End Date
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Location (Single Row) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <MapPin size={12} className="text-blue-500" /> Location
            </label>
            <input
              type="text"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 transition-all font-semibold"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Gelora Bung Karno, Jakarta"
            />
          </div>

          {/* Row 4: Categories (Single Row) */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Tag size={12} className="text-blue-500" /> Race Categories
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 transition-all font-semibold"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCategory())
                }
                placeholder="e.g. Full Marathon"
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </div>
            {/* Category Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {formData.categories.map((c, i) => (
                <span
                  key={i}
                  className="bg-blue-500/10 text-blue-400 border border-blue-600/20 px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-3 uppercase tracking-tighter"
                >
                  {c}{" "}
                  <X
                    size={14}
                    className="cursor-pointer hover:text-red-400 transition-colors"
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
              {formData.categories.length === 0 && (
                <p className="text-[10px] text-slate-600 italic font-medium ml-1">
                  No categories added yet.
                </p>
              )}
            </div>
          </div>

          {/* Row 5: Assets & Social Links */}
          <div className="space-y-5 pt-4 border-t border-slate-800/50">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Link size={14} /> Event Links
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase">
                  Logo URL
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase">
                  Official Website
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Instagram size={12} /> Instagram URL / Handle
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500"
                  value={formData.social_url}
                  onChange={(e) =>
                    setFormData({ ...formData, social_url: e.target.value })
                  }
                  placeholder="instagram.com/3onerunners"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Post-Race URLs (Hanya Edit) */}
          {initialData && (
            <div className="space-y-5 pt-4 border-t border-slate-800/50 animate-in fade-in">
              <label className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Award size={14} /> Race Results & Documentation
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">
                    Result URL
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500"
                    value={formData.result_url}
                    onChange={(e) =>
                      setFormData({ ...formData, result_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">
                    Documentation URL
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus:border-blue-500"
                    value={formData.doc_url}
                    onChange={(e) =>
                      setFormData({ ...formData, doc_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Submit */}
        <div className="p-8 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-10">
          <button
            disabled={loading}
            type="submit"
            onClick={handleSubmit}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-[2rem] transition-all uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={18} />{" "}
                {initialData ? "Update Changes" : "Create Race"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceForm;
