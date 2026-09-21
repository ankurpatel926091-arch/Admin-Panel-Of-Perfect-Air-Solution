import React, { useState, useMemo } from 'react';
import { useGetBrandsQuery, useDeleteBrandMutation } from '@/store/api';
import { toast } from 'sonner';
import AdminBrandModal from './AdminBrandModal';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';

const AdminBrands = () => {
  const { data: brands = [], isLoading } = useGetBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return brands.slice(start, start + itemsPerPage);
  }, [brands, currentPage, itemsPerPage]);

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
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-1">
            Brand Management
          </p>
          <h1 className="heading-1 text-neutral-900">
            Brands
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            {brands.length} {brands.length === 1 ? 'brand' : 'brands'} registered
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="group inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold px-5 py-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <span className="text-lg leading-none transition-transform duration-200 group-hover:rotate-90">+</span>
          Add New Brand
        </button>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader />
          <p className="text-sm text-neutral-400 animate-pulse">Loading brands...</p>
        </div>
      ) : brands.length === 0 ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-md bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-1">No brands yet</h3>
          <p className="text-sm text-neutral-400 mb-6 max-w-xs">
            Upload your first brand logo to get started. Brands appear as partner logos on your site.
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-neutral-700 transition-all active:scale-95 cursor-pointer"
          >
            <span className="text-base">+</span> Add First Brand
          </button>
        </div>
      ) : (
        /* ── Grid ── */
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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

            {/* ── Add New Card ── */}
            <button
              onClick={handleAdd}
              className="group aspect-square flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50 transition-all duration-200 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center transition-colors duration-200">
                <span className="text-2xl text-neutral-400 group-hover:text-neutral-600 leading-none transition-colors">+</span>
              </div>
              <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-600 transition-colors">Add Brand</span>
            </button>
          </div>

          {/* Pagination Controls */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs">
            <AdminPagination
              currentPage={currentPage}
              totalItems={brands.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
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
  return (
    <div className="group relative aspect-square bg-white rounded-md border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Image */}
      <div className="w-full h-full flex items-center justify-center p-4">
        {brand.heroImage ? (
          <img
            src={brand.heroImage}
            alt="Brand logo"
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-12 h-12 rounded-md bg-neutral-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Hover Action Bar */}
      {!confirmingDelete && (
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors duration-150 flex items-center justify-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
          <div className="w-px bg-neutral-700" />
          <button
            onClick={onDeleteRequest}
            className="flex-1 py-2.5 bg-neutral-900 hover:bg-red-600 text-white text-xs font-semibold transition-colors duration-150 flex items-center justify-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* Inline Delete Confirmation Overlay */}
      {confirmingDelete && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-neutral-700 text-center leading-snug">Remove this brand?</p>
          <div className="flex gap-2 w-full">
            <button
              onClick={onDeleteCancel}
              className="flex-1 py-1.5 rounded-md border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors disabled:opacity-60"
            >
              {isDeleting ? '...' : 'Remove'}
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay while deleting */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AdminBrands;