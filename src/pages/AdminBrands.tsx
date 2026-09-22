import React, { useState, useMemo, useEffect } from 'react';
import { useGetBrandsQuery, useDeleteBrandMutation } from '@/store/api';
import { toast } from 'sonner';
import AdminBrandModal from './AdminBrandModal';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const AdminBrands = () => {
  const { data: brands = [], isLoading } = useGetBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand: any) => {
      const name = (brand.brandName || brand.name || '').toLowerCase();
      const tagline = (brand.tagline || brand.overview || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      return query === '' || name.includes(query) || tagline.includes(query);
    });
  }, [brands, searchQuery]);

  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBrands.slice(start, start + itemsPerPage);
  }, [filteredBrands, currentPage, itemsPerPage]);

  const handleAdd = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleEdit = (brand: any) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteBrand(id).unwrap();
      toast.success('Brand removed successfully');
    } catch {
      toast.error('Failed to delete brand');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* ── 1. Top Welcome Banner ── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#051B30] via-[#08335C] to-[#0D508D] text-white p-6 sm:p-7 shadow-sm overflow-hidden">
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-white/[0.05] pointer-events-none">
          <Tags size={200} strokeWidth={1.2} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
              <Tags size={26} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-300 mb-0.5">
                
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Authorized Partner Brands
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-normal">
                Manage certified HVAC manufacturing partners, official logos, and OEM partnerships.
              </p>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="self-start sm:self-auto group inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] to-cyan-500 hover:from-[#0369A1] hover:to-cyan-600 text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-sky-950/30 hover:shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={18} className="transition-transform duration-200 group-hover:rotate-90" />
            <span>Add New Brand</span>
          </button>
        </div>
      </div>

      {/* ── 2. Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Brands */}
        <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-indigo-50/60 rounded-2xl p-5 sm:p-6 border border-blue-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-blue-900 block">Total Brands</span>            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
              <Tags size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-blue-950">{brands.length}</div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Live Brands
            </span>
          </div>
        </div>

        {/* Card 2: Authorized OEM Partners */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 block">Partnership Tier</span>            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <ShieldCheck size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-emerald-950">
              {brands.filter((b: any) => b.badgeText?.toLowerCase().includes('partner') || b.badgeText?.toLowerCase().includes('dealer') || b.badgeText?.toLowerCase().includes('authorized')).length || brands.length}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              OEM Certified
            </span>
          </div>
        </div>

        {/* Card 3: Display Status */}
        <div className="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/30 to-violet-50/60 rounded-2xl p-5 sm:p-6 border border-purple-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-purple-900 block">Showcase Status</span>            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25">
              <CheckCircle2 size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-purple-950">100%</div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Active on Portal
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands by name or tagline..."
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

        <div className="text-xs font-bold text-slate-500 shrink-0 px-1">
          Showing <span className="text-slate-900 font-extrabold">{filteredBrands.length}</span> of {brands.length} Brands
        </div>
      </div>

      {/* ── 4. Brand Cards Grid ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-28 gap-3 bg-white rounded-2xl border border-slate-200/80">
          <Loader />
          <p className="text-xs font-bold text-slate-400 animate-pulse">Loading partner brands...</p>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200/80">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Tags size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No brands found</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-5">
            {searchQuery ? `No results matching "${searchQuery}".` : 'Get started by adding your first authorized partner brand.'}
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus size={15} /> Add First Brand
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
            {paginatedBrands.map((brand: any) => (
              <BrandCard
                key={brand._id}
                brand={brand}
                isDeleting={deletingId === brand._id}
                confirmingDelete={confirmDeleteId === brand._id}
                onEdit={() => handleEdit(brand)}
                onDeleteRequest={() => setConfirmDeleteId(brand._id)}
                onDeleteConfirm={() => handleDeleteConfirm(brand._id)}
                onDeleteCancel={() => setConfirmDeleteId(null)}
              />
            ))}

            {/* ── Add New Brand Ghost Card ── */}
            <button
              onClick={handleAdd}
              className="group min-h-[220px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0284C7] bg-slate-50/50 hover:bg-sky-50/30 transition-all duration-200 cursor-pointer p-4 shadow-2xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 group-hover:border-sky-300 group-hover:bg-[#0284C7] group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 shadow-2xs">
                <Plus size={22} className="transition-transform duration-200 group-hover:rotate-90" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-700 group-hover:text-[#0284C7] block transition-colors">
                  Add Brand
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  Upload OEM Partner
                </span>
              </div>
            </button>
          </div>

          {/* ── 5. Pagination (12 Items Per Page) ── */}
          {filteredBrands.length > itemsPerPage && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <AdminPagination
                currentPage={currentPage}
                totalItems={filteredBrands.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      <AdminBrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand={selectedBrand}
      />
    </div>
  );
};

/* ── Brand Card Sub-component ── */
interface BrandCardProps {
  brand: any;
  isDeleting: boolean;
  confirmingDelete: boolean;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  isDeleting,
  confirmingDelete,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  const brandTitle = brand.brandName || brand.name || 'Brand';
  const logoImage = brand.heroImage || brand.image;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5 sm:p-4 shadow-2xs">
      {/* Brand Logo Display Area */}
      <div className="w-full h-24 sm:h-28 flex items-center justify-center p-3 bg-slate-50/70 rounded-xl group-hover:bg-sky-50/40 transition-colors duration-300 overflow-hidden">
        {logoImage ? (
          <img
            src={logoImage}
            alt={brandTitle}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-400">
            <Tags size={24} />
          </div>
        )}
      </div>

      {/* Brand Details */}
      <div className="mt-3 text-center min-w-0">
        <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate group-hover:text-[#0284C7] transition-colors">
          {brandTitle}
        </h4>
        {brand.badgeText && (
          <span className="inline-block text-[10px] font-bold text-slate-500 truncate max-w-full px-2 py-0.5 rounded-full bg-slate-100 mt-1 border border-slate-200/60">
            {brand.badgeText}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5">
        <button
          onClick={onEdit}
          className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0284C7] border border-slate-200/80 hover:border-sky-300 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          title="Edit Brand"
        >
          <Pencil size={12} />
          <span>Edit</span>
        </button>
        <button
          onClick={onDeleteRequest}
          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0"
          title="Delete Brand"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Inline Delete Confirmation Overlay */}
      {confirmingDelete && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 p-3 z-10 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Trash2 size={16} />
          </div>
          <p className="text-[11px] font-bold text-slate-800 text-center leading-tight">
            Remove {brandTitle}?
          </p>
          <div className="flex gap-1.5 w-full mt-1">
            <button
              onClick={onDeleteCancel}
              className="flex-1 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isDeleting ? '...' : 'Remove'}
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay while deleting */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#0284C7] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AdminBrands;