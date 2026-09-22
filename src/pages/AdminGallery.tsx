import React, { useState, useMemo, useEffect } from 'react';
import { useGetGalleryQuery, useDeleteGalleryMutation } from '@/store/api';
import { toast } from 'sonner';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';
import {
  Images,
  Plus,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Sparkles,
  Tag,
  CheckCircle2,
  ExternalLink,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'vrf', label: 'VRF / VRV System' },
  { id: 'ductable', label: 'Ductable System' },
  { id: 'maintenance', label: 'AHU & Maintenance' },
  { id: 'residential', label: 'Residential' },
];

const getCategoryBadge = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('vrf')) {
    return {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
    };
  }
  if (cat.includes('commercial')) {
    return {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    };
  }
  if (cat.includes('ductable')) {
    return {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    };
  }
  if (cat.includes('maintenance')) {
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    };
  }
  return {
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
  };
};

const AdminGallery: React.FC = () => {
  const { data: gallery = [], isLoading } = useGetGalleryQuery();
  const [deleteGallery] = useDeleteGalleryMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Modal State
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form State - Only Category & Image needed for pure photo gallery
  const [formData, setFormData] = useState({
    category: 'commercial',
    image: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      category: 'commercial',
      image: '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGallery(id).unwrap();
      toast.success('Gallery item deleted successfully');
    } catch {
      toast.error('Failed to delete gallery item');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      toast.error('Image URL is required');
      return;
    }
    toast.success('New gallery photo added');
    setIsModalOpen(false);
  };

  const filteredItems = useMemo(() => {
    return gallery.filter((item: any) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [gallery, selectedCategory, searchQuery]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Lightbox Navigation (Next / Prev / Keyboard Left & Right arrow keys)
  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (previewIndex === null || filteredItems.length === 0) return;
    setPreviewIndex((prev) => (prev === null || prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (previewIndex === null || filteredItems.length === 0) return;
    setPreviewIndex((prev) => (prev === null || prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (previewIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPreviewIndex((prev) => (prev === null || prev === 0 ? filteredItems.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPreviewIndex((prev) => (prev === null || prev === filteredItems.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setPreviewIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewIndex, filteredItems.length]);

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* ── 1. Header Banner ── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#051B30] via-[#08335C] to-[#0D508D] text-white p-6 sm:p-7 shadow-sm overflow-hidden">
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-white/[0.04] pointer-events-none">
          <Images size={200} strokeWidth={1.2} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
              <Images size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Installation Gallery
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-normal">
                Manage completed commercial, VRF, ductable, and residential HVAC projects.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <a
              href="/gallery"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all"
            >
              <span>View Frontend</span>
              <ExternalLink size={13} />
            </a>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] to-cyan-500 hover:from-[#0369A1] hover:to-cyan-600 text-white text-xs sm:text-sm font-extrabold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
            >
              <Plus size={18} />
              <span>Add Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-indigo-50/60 rounded-2xl p-5 sm:p-6 border border-blue-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-blue-900 block">Total Projects</span>
              <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Showcased on portal</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Images size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-blue-950">{gallery.length}</div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Live Photos
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/30 to-violet-50/60 rounded-2xl p-5 sm:p-6 border border-purple-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-purple-900 block">Categories</span>
              <span className="text-[11px] text-purple-600 font-semibold mt-0.5 block">Project classifications</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Tag size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-purple-950">5 </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              VRF &bull; Chiller &bull; AHU
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 block">Display Status</span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Portfolio Photos</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <CheckCircle2 size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-emerald-950">100%</div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Active &amp; Live
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos by category..."
            className="w-full pl-9 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Dropdown (DDL) & View Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {/* Category Dropdown List (DDL) */}
          <div className="relative min-w-[190px] sm:min-w-[230px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Filter size={15} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all cursor-pointer appearance-none shadow-2xs"
            >
              {CATEGORIES.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? gallery.length
                    : gallery.filter((item: any) => item.category === cat.id).length;

                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ({count})
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown size={15} />
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-200" />

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 shrink-0 border border-slate-200/80">
            <button
              onClick={() => setView('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                view === 'grid' ? 'bg-[#0284C7] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                view === 'table' ? 'bg-[#0284C7] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Main Gallery Content ── */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-20 flex flex-col items-center justify-center gap-3">
          <Loader />
          <p className="text-xs sm:text-sm font-semibold text-slate-400 animate-pulse">Loading gallery images...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 py-20 px-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-md">
            <Images size={28} />
          </div>
          <h3 className="text-base font-extrabold text-[#051B30]">No gallery items found</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search terms or category filter.'
              : 'Add photo installations to populate the frontend gallery.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus size={14} />
            <span>Add First Photo</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {view === 'grid' ? (
            /* ── Pure Photo Grid View (No text, pure photos) ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {paginatedItems.map((item: any, index: number) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                const isConfirming = confirmDeleteId === item._id;

                return (
                  <div
                    key={item._id}
                    onClick={() => setPreviewIndex(globalIndex)}
                    title="Click to view photo"
                    className="group relative aspect-[4/3] rounded-2xl border border-slate-200/90 hover:border-[#0284C7]/60 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    {/* 100% Pure Photo */}
                    <img
                      src={item.image}
                      alt="HVAC Installation"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Subtle Hover Action Overlay */}
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-start justify-end p-3 pointer-events-none">
                      {isConfirming ? (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg shrink-0 pointer-events-auto"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item._id);
                            }}
                            className="px-2 py-0.5 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-rose-700"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer hover:text-slate-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center shrink-0 pointer-events-auto"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(item._id);
                            }}
                            className="p-2 bg-white/90 hover:bg-white text-rose-600 hover:text-rose-700 rounded-xl shadow-md transition-all cursor-pointer"
                            title="Delete Photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Table View ── */
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border-b border-slate-200/90 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4 w-28">Photo</th>
                      <th className="px-6 py-4">System Category</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedItems.map((item: any, index: number) => {
                      const globalIndex = (currentPage - 1) * itemsPerPage + index;
                      const badge = getCategoryBadge(item.category);
                      const isConfirming = confirmDeleteId === item._id;

                      return (
                        <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-4 align-middle">
                            <div 
                              onClick={() => setPreviewIndex(globalIndex)}
                              title="Click to view photo"
                              className="w-16 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0 cursor-pointer hover:opacity-80 transition-opacity hover:ring-2 hover:ring-[#0284C7]"
                            >
                              <img src={item.image} alt="Gallery Photo" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="px-6 py-4 align-middle">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                              <span className="capitalize">{item.category}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 align-middle text-right">
                            {isConfirming ? (
                              <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-xl px-2.5 py-1">
                                <span className="text-xs text-rose-600 font-bold">Delete?</span>
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="px-2 py-0.5 bg-rose-600 text-white text-xs font-bold rounded"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-0.5 text-slate-500 text-xs font-semibold"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={() => setConfirmDeleteId(item._id)}
                                  className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-200 transition-colors cursor-pointer"
                                  title="Delete Photo"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <AdminPagination
              currentPage={currentPage}
              totalItems={filteredItems.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

      {/* ── 5. Add / Edit Gallery Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-6 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#051B30]">
              Add New Gallery Photo
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Image URL / Link
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://... or paste image URL"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
              >
                <option value="commercial">Commercial HVAC</option>
                <option value="vrf">VRF / VRV System</option>
                <option value="ductable">Ductable System</option>
                <option value="maintenance">AHU &amp; Maintenance</option>
                <option value="residential">Residential AC</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Add to Gallery
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 6. Pure Image Lightbox Modal with Left/Right Navigation & Laptop Keyboard Arrow keys ── */}
      <Dialog open={previewIndex !== null} onOpenChange={(open) => !open && setPreviewIndex(null)}>
        <DialogContent
          hideCloseButton
          className="w-[95vw] sm:w-[90vw] max-w-4xl h-[60vh] sm:h-[75vh] max-h-[640px] p-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center justify-center overflow-hidden select-none"
        >
          <DialogTitle className="sr-only">Image Preview</DialogTitle>

          {/* Sleek Close Button */}
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg border border-white/20 hover:scale-105 active:scale-95"
            title="Close Preview (Esc)"
          >
            <X size={18} />
          </button>

          {/* Left / Previous Arrow Button */}
          {filteredItems.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-xl border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 group"
              title="Previous Photo (Left Arrow Key)"
            >
              <ChevronLeft size={24} className="transition-transform group-hover:-translate-x-0.5" />
            </button>
          )}

          {/* Right / Next Arrow Button */}
          {filteredItems.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-xl border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 group"
              title="Next Photo (Right Arrow Key)"
            >
              <ChevronRight size={24} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )}

          {/* Image Display - Uniform Fixed Height and Width */}
          {previewIndex !== null && filteredItems[previewIndex] && (
            <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                key={filteredItems[previewIndex]._id || filteredItems[previewIndex].image}
                src={filteredItems[previewIndex].image}
                alt="Enlarged photo preview"
                className="w-full h-full object-cover select-none transition-all duration-300"
              />

              {/* Photo Counter Badge */}
              {filteredItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/15 pointer-events-none shadow-md">
                  {previewIndex + 1} / {filteredItems.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
