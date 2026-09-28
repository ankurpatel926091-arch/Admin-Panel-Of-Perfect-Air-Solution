import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  createGalleryAPI,
  getGalleryAPI,
  deleteGalleryAPI,
  updateGalleryAPI,
  toggleGalleryStatusAPI,
} from '@/api/gallery.api';
import { getGalleryCategories } from '@/api/galleryCategory.api';
import { toast } from 'sonner';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';
import {
  Images,
  Plus,
  Trash2,
  Pencil,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  CheckCircle2,
  ExternalLink,
  Filter,
  ChevronDown,
  UploadCloud,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const CATEGORIES = [
  { id: 'all', label: 'All Projects' },
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
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<{ _id: string; title: string; slug?: string; isActive?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCategories = async () => {
    try {
      const catRes = await getGalleryCategories();
      const catList = catRes?.galleryCategories || catRes?.categories || [];
      if (Array.isArray(catList)) {
        setDbCategories(catList);
      }
    } catch (err) {
      console.error('Failed to refresh categories:', err);
    }
  };

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Status Counts
  const activeCount = useMemo(() => {
    return galleryList.filter((item: any) => item.isActive !== false).length;
  }, [galleryList]);

  const inactiveCount = useMemo(() => {
    return galleryList.filter((item: any) => item.isActive === false).length;
  }, [galleryList]);

  const activePercentage = useMemo(() => {
    if (galleryList.length === 0) return 0;
    return Math.round((activeCount / galleryList.length) * 100);
  }, [galleryList.length, activeCount]);

  // Local File Upload & Modal State
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalIsActive, setModalIsActive] = useState<boolean>(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [modalCategory, setModalCategory] = useState<string>('commercial');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (item: any): string => {
    if (!item) return '';
    if (typeof item.image === 'string') return item.image;
    if (item.image && typeof item.image === 'object' && item.image.url) {
      return item.image.url;
    }
    return '';
  };

  const getItemCategory = (item: any): string => {
    if (!item) return '';
    if (item.galleryCategory && typeof item.galleryCategory === 'object') {
      return item.galleryCategory.title || item.galleryCategory.name || '';
    }
    return item.galleryCategory || item.category || '';
  };

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [catRes, galRes] = await Promise.allSettled([
        getGalleryCategories(),
        getGalleryAPI(),
      ]);

      if (catRes.status === 'fulfilled') {
        const catList = catRes.value?.galleryCategories || catRes.value?.categories || [];
        if (Array.isArray(catList)) {
          setDbCategories(catList);
        }
      }

      if (galRes.status === 'fulfilled') {
        const galList = galRes.value?.gallery || [];
        if (Array.isArray(galList)) {
          setGalleryList(galList);
        }
      }
    } catch (err) {
      console.error('Failed to load gallery data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run ONCE on mount only (prevent StrictMode double call in dev)
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAllData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, statusFilter]);

  const applySelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      applySelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      applySelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenAdd = () => {
    refreshCategories();
    setEditingItem(null);
    removeSelectedFile();
    const firstActive = dbCategories.find((cat: any) => cat.isActive !== false);
    setModalCategory(firstActive?.title || '');
    setModalIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    refreshCategories();
    setEditingItem(item);
    setSelectedFile(null);
    setPreviewUrl(getImageUrl(item));
    const currentCat = getItemCategory(item);
    const firstActive = dbCategories.find((cat: any) => cat.isActive !== false);
    setModalCategory(currentCat || firstActive?.title || '');
    setModalIsActive(item.isActive !== false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    removeSelectedFile();
  };

  const handleToggleStatus = async (item: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const id = item._id || item.id;
    if (!id) return;
    const currentStatus = item.isActive !== false;
    const newStatus = !currentStatus;

    // Optimistic UI update
    setGalleryList((prev) =>
      prev.map((it) => ((it._id || it.id) === id ? { ...it, isActive: newStatus } : it))
    );

    try {
      await toggleGalleryStatusAPI(id);
      toast.success(`Photo marked as ${newStatus ? 'Active' : 'Inactive'}`);
    } catch (err: any) {
      // Revert on error
      setGalleryList((prev) =>
        prev.map((it) => ((it._id || it.id) === id ? { ...it, isActive: currentStatus } : it))
      );
      toast.error(err?.response?.data?.message || 'Failed to update photo status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryAPI(id);
      setGalleryList((prev) => prev.filter((item) => (item._id || item.id) !== id));
      toast.success('Gallery item deleted successfully');
    } catch {
      toast.error('Failed to delete gallery item');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem && !selectedFile) {
      toast.error('Please choose a photo from your computer');
      return;
    }

    if (!modalCategory) {
      toast.error('Please select an active category');
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append('galleryCategory', modalCategory);
      fd.append('isActive', String(modalIsActive));
      if (selectedFile) {
        fd.append('image', selectedFile);
      }

      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await updateGalleryAPI(id, fd);
        toast.success('Gallery photo updated successfully!');
      } else {
        await createGalleryAPI(fd);
        toast.success('New gallery photo uploaded successfully!');
      }

      handleCloseModal();

      // Refresh gallery list
      const galRes = await getGalleryAPI();
      if (galRes?.gallery && Array.isArray(galRes.gallery)) {
        setGalleryList(galRes.gallery);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to save photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only active categories for photo upload / edit modal
  const uploadCategoryOptions = useMemo(() => {
    const activeCats: { _id: string; title: string; isInactive?: boolean }[] = [];
    const seen = new Set<string>();

    dbCategories
      .filter((cat: any) => cat.isActive !== false)
      .forEach((cat: any) => {
        const cleanTitle = (cat.title || '').trim();
        if (cleanTitle && !seen.has(cleanTitle.toLowerCase())) {
          seen.add(cleanTitle.toLowerCase());
          activeCats.push({ _id: cat._id || cat.title, title: cleanTitle });
        }
      });

    // If editing an existing photo whose category was set to something that is now inactive,
    // show it with an indicator so it doesn't break
    if (editingItem) {
      const currentCatName = getItemCategory(editingItem).trim();
      if (currentCatName && !seen.has(currentCatName.toLowerCase())) {
        return [
          { _id: 'current_inactive', title: currentCatName, isInactive: true },
          ...activeCats,
        ];
      }
    }

    return activeCats;
  }, [dbCategories, editingItem]);

  // Keep modalCategory valid when active categories change
  useEffect(() => {
    if (isModalOpen && !editingItem && uploadCategoryOptions.length > 0) {
      const isSelectedValid = uploadCategoryOptions.some(
        (c) => c.title.toLowerCase() === modalCategory.toLowerCase()
      );
      if (!isSelectedValid) {
        setModalCategory(uploadCategoryOptions[0].title);
      }
    }
  }, [uploadCategoryOptions, isModalOpen, editingItem, modalCategory]);

  const categoryOptions = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: 'all', label: 'All Projects' }];
    const seen = new Set<string>();

    dbCategories.forEach((cat: any) => {
      const title = (cat.title || '').trim();
      if (title && !seen.has(title.toLowerCase())) {
        seen.add(title.toLowerCase());
        list.push({ id: title.toLowerCase(), label: title });
      }
    });

    galleryList.forEach((item: any) => {
      const catName = getItemCategory(item).trim();
      if (catName && !seen.has(catName.toLowerCase())) {
        seen.add(catName.toLowerCase());
        list.push({ id: catName.toLowerCase(), label: catName });
      }
    });

    return list;
  }, [dbCategories, galleryList]);

  const filteredItems = useMemo(() => {
    return galleryList.filter((item: any) => {
      const itemCat = getItemCategory(item).toLowerCase();
      const matchesCategory =
        selectedCategory === 'all' ||
        itemCat === selectedCategory.toLowerCase() ||
        itemCat.includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(itemCat);

      const isActive = item.isActive !== false;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);

      return matchesCategory && matchesStatus;
    });
  }, [galleryList, selectedCategory, statusFilter]);

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
              <span className="text-xs sm:text-sm font-bold text-blue-900 block">Total Projects</span>            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <Images size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-blue-950">{galleryList.length}</div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Live Photos
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/30 to-violet-50/60 rounded-2xl p-5 sm:p-6 border border-purple-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-purple-900 block">Categories</span>            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Tag size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-purple-950">
              {dbCategories.filter((c: any) => c.isActive !== false).length}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Active Categories
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 block">Display Status</span>            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <CheckCircle2 size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-emerald-950">{activePercentage}%</div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              {activeCount} Active &bull; {inactiveCount} Inactive
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Status Filter (Active / Inactive) & Category Dropdown ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        {/* Active & Inactive Status Filter */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#051B30] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All Projects</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {galleryList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/70'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusFilter === 'active' ? 'bg-white animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span>Active</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === 'active' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/70'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                statusFilter === 'inactive' ? 'bg-white' : 'bg-slate-400'
              }`}
            />
            <span>Inactive</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === 'inactive' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {inactiveCount}
            </span>
          </button>
        </div>

        {/* Category Dropdown (DDL) */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="relative min-w-[190px] sm:min-w-[230px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Filter size={15} />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all cursor-pointer appearance-none shadow-2xs"
            >
              {categoryOptions.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? galleryList.length
                    : galleryList.filter((item: any) => {
                        const itCat = getItemCategory(item).toLowerCase();
                        return (
                          itCat === cat.id.toLowerCase() ||
                          itCat === cat.label.toLowerCase() ||
                          itCat.includes(cat.id.toLowerCase())
                        );
                      }).length;

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
            {statusFilter !== 'all' || selectedCategory !== 'all'
              ? `No ${statusFilter !== 'all' ? statusFilter : ''} photos match your current filter. Try selecting 'All Projects' or switching status.`
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
          {/* ── Pure Photo Grid View (Full uncropped photos) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {paginatedItems.map((item: any, index: number) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              const itemId = item._id || item.id || `gallery-${index}`;
              const isConfirming = confirmDeleteId === itemId;
              const imgUrl = getImageUrl(item);
              const itemCat = getItemCategory(item);

              const isItemActive = item.isActive !== false;

              return (
                <div
                  key={itemId}
                  onClick={() => setPreviewIndex(globalIndex)}
                  title="Click to view photo"
                  className={`group relative aspect-[4/3] w-full rounded-2xl border shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden bg-slate-950 flex items-center justify-center cursor-pointer ${
                    !isItemActive
                      ? 'border-slate-500/40 opacity-80 hover:opacity-100 hover:border-slate-400'
                      : 'border-slate-200/90 hover:border-[#0284C7]/60'
                  }`}
                >
                  {/* Status Toggle Switch at Top Left */}
                  <div
                    className="absolute top-2.5 left-2.5 z-20 pointer-events-auto rounded-full shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ToggleSwitch
                      size="sm"
                      checked={isItemActive}
                      onChange={() => handleToggleStatus(item)}
                      ariaLabel="Toggle photo active status"
                    />
                  </div>

                  {/* Ambient Blurred Backdrop - Fills exact card frame so card size is always identical */}
                  <img
                    src={imgUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none select-none"
                  />

                  {/* 100% Full Uncropped Photo - No part is cut or cropped */}
                  <img
                    src={imgUrl}
                    alt="HVAC Installation"
                    className="relative z-10 max-w-full max-h-full w-auto h-auto object-contain p-2 transition-transform duration-300 group-hover:scale-105 drop-shadow-md select-none"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  {itemCat && (
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-20" />
                  )}

                  {/* Category Badge at Bottom Left */}
                  {itemCat && (
                    <div className="absolute bottom-2.5 left-2.5 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold pointer-events-none border border-white/20 truncate max-w-[85%] shadow-sm">
                      {itemCat}
                    </div>
                  )}

                  {/* Subtle Hover Action Overlay */}
                  <div className="absolute inset-0 z-30 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-start justify-end p-2.5 pointer-events-none">
                    {isConfirming ? (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg shrink-0 pointer-events-auto"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(itemId);
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
                        className="flex items-center gap-1.5 shrink-0 pointer-events-auto"
                      >
                        <button
                          onClick={(e) => handleOpenEdit(item, e)}
                          className="p-2 bg-white/90 hover:bg-white text-sky-600 hover:text-sky-700 rounded-xl shadow-md transition-all cursor-pointer hover:scale-105"
                          title="Edit Category or Photo"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(itemId);
                          }}
                          className="p-2 bg-white/90 hover:bg-white text-rose-600 hover:text-rose-700 rounded-xl shadow-md transition-all cursor-pointer hover:scale-105"
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

      {/* ── 5. Add / Upload Gallery Modal (Local Photo Upload) ── */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
          else setIsModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl p-6 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#051B30] flex items-center gap-2">
              {editingItem && <Pencil size={18} className="text-[#0284C7]" />}
              <span>{editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-2">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Category
              </label>
              {uploadCategoryOptions.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                  No active categories found. Please activate or create a category in{' '}
                  <span className="font-bold">Gallery Categories</span> before uploading.
                </div>
              ) : (
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] cursor-pointer"
                >
                  {uploadCategoryOptions.map((cat) => (
                    <option key={cat._id || cat.title} value={cat.title}>
                      {cat.title} {cat.isInactive ? '(Inactive)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Local Photo Upload Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                {editingItem ? 'Photo' : 'Upload Photo from Device'}
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {!previewUrl ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                    isDragging
                      ? 'border-[#0284C7] bg-sky-50/70 scale-[1.01]'
                      : 'border-slate-300 hover:border-[#0284C7] bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-500/10 to-[#0284C7]/20 text-[#0284C7] flex items-center justify-center shadow-inner">
                    <UploadCloud size={26} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Click to choose or drag &amp; drop photo
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group">
                  <div className="aspect-[16/10] w-full flex items-center justify-center bg-slate-950">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                    <div className="truncate mr-2">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {selectedFile ? selectedFile.name : (editingItem ? 'Current Photo' : 'Selected Photo')}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {selectedFile
                          ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                          : (editingItem ? 'Click Change to replace photo' : '')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0284C7] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Toggle Switch */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Photo Status ({modalIsActive ? 'Active' : 'Inactive'})
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Display this photo publicly on website gallery
                </p>
              </div>

              <ToggleSwitch
                size="md"
                checked={modalIsActive}
                onChange={setModalIsActive}
                ariaLabel="Toggle photo status"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!editingItem && !selectedFile)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white text-xs font-bold rounded-xl shadow-md transition-all ${
                  isSubmitting || (!editingItem && !selectedFile)
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-lg active:scale-95 cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{editingItem ? 'Updating...' : 'Uploading...'}</span>
                  </>
                ) : (
                  <>
                    {editingItem ? <CheckCircle2 size={14} /> : <UploadCloud size={14} />}
                    <span>{editingItem ? 'Update Photo' : 'Upload Photo'}</span>
                  </>
                )}
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
                key={filteredItems[previewIndex]._id || filteredItems[previewIndex].id || previewIndex}
                src={getImageUrl(filteredItems[previewIndex])}
                alt="Enlarged photo preview"
                className="max-w-full max-h-full object-contain select-none transition-all duration-300"
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
