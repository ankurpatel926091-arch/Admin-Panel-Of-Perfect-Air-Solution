import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBrands, deleteBrand } from "@/api/brand.api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminBrandModal from "./AdminBrandModal";
import Loader from "@/components/ui/Loader";
import AdminPagination from "@/components/AdminPagination";
import useDebounce from "@/hooks/useDebounce";

import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const AdminBrands = () => {
  const navigate = useNavigate();
  // ===============================
  // STATES
  // ===============================

  const [brands, setBrands] = useState<any[]>([]);
  const [totalBrands, setTotalBrands] = useState(0);
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const isSearching = searchQuery !== debouncedSearch || (isLoading && Boolean(searchQuery));
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 11;

  // ===============================
  // GET BRANDS API (BACKEND PARAMS)
  // ===============================

  const fetchBrands = async () => {
    try {
      setIsLoading(true);

      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (debouncedSearch) {
        params.name = debouncedSearch;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await getBrands(params);

      setBrands(response.data || []);
      setTotalBrands(response.total ?? 0);
      setCounts({
        total: response.totalCount ?? response.total ?? 0,
        active: response.activeCount ?? 0,
        inactive: response.inactiveCount ?? 0,
      });
    } catch (error: any) {
      console.error("Get Brands Error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch brands"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchBrands();
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  // Client safety filter so non-matching brands never render
  const displayBrands = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return brands;
    return brands.filter((b: any) => b.name?.toLowerCase().includes(q));
  }, [brands, debouncedSearch]);

  // ===============================
  // ADD BRAND
  // ===============================

  const handleAdd = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  // ===============================
  // EDIT BRAND
  // ===============================

  const handleEdit = (brand: any) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  // ===============================
  // DELETE BRAND
  // ===============================

  const handleDeleteConfirm = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete brand?",
      text: "This brand will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0284C7",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);

      await deleteBrand(id);
      await fetchBrands();

      await Swal.fire({
        title: "Deleted!",
        text: "Brand removed successfully.",
        icon: "success",
        confirmButtonColor: "#0284C7",
      });
    } catch (error: any) {
      console.error("Delete Brand Error:", error);

      await Swal.fire({
        title: "Delete failed",
        text: error?.response?.data?.message || "Failed to delete brand.",
        icon: "error",
        confirmButtonColor: "#0284C7",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // ===============================
  // MODAL CLOSE
  // ===============================

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  return (
    <div className="space-y-6 font-sans pb-10">

      {/* ===============================
          1. TOP BANNER
      =============================== */}

      <div className="relative rounded-2xl bg-gradient-to-r from-[#051B30] via-[#08335C] to-[#0D508D] text-white p-6 sm:p-7 shadow-sm overflow-hidden">

        <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-white/[0.05] pointer-events-none">
          <Tags size={200} strokeWidth={1.2} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate(-1)}
              type="button"
              title="Go Back"
              className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0284C7] to-cyan-400 hover:from-[#0369A1] hover:to-cyan-500 text-white flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95 group shrink-0"
            >
              <ArrowLeft size={22} className="transition-transform group-hover:-translate-x-0.5" />
            </button>

            <div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Authorized Partner Brands
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-normal">
                Manage certified HVAC manufacturing partners, official logos,
                and OEM partnerships.
              </p>

            </div>

          </div>

          <button
            onClick={handleAdd}
            className="self-start sm:self-auto group inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] to-cyan-500 hover:from-[#0369A1] hover:to-cyan-600 text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-sky-950/30 hover:shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus
              size={18}
              className="transition-transform duration-200 group-hover:rotate-90"
            />

            <span>Add New Brand</span>
          </button>

        </div>
      </div>

      {/* ===============================
          2. STAT CARDS
      =============================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

        {/* Total Brands */}

        <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-indigo-50/60 rounded-2xl p-5 sm:p-6 border border-blue-200/80 shadow-2xs flex flex-col justify-between">

          <div className="flex items-start justify-between gap-3">

            <div>
              <span className="text-xs sm:text-sm font-bold text-blue-900 block">
                Total Brands
              </span>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
              <Tags size={20} strokeWidth={2.2} />
            </div>

          </div>

          <div className="mt-4 flex items-baseline justify-between">

            <div className="text-3xl sm:text-4xl font-black text-blue-950">
              {counts.total}
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Live Brands
            </span>

          </div>

        </div>

        {/* Authorized Partners */}

        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-2xs flex flex-col justify-between">

          <div className="flex items-start justify-between gap-3">

            <div>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 block">
                Active Brands
              </span>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <ShieldCheck size={20} strokeWidth={2.2} />
            </div>

          </div>

          <div className="mt-4 flex items-baseline justify-between">

            <div className="text-3xl sm:text-4xl font-black text-emerald-950">
              {counts.active}
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Active
            </span>

          </div>

        </div>

        {/* Display Status */}

        <div className="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/30 to-violet-50/60 rounded-2xl p-5 sm:p-6 border border-purple-200/80 shadow-2xs flex flex-col justify-between">

          <div className="flex items-start justify-between gap-3">

            <div>
              <span className="text-xs sm:text-sm font-bold text-purple-900 block">
                Showcase Status
              </span>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25">
              <CheckCircle2 size={20} strokeWidth={2.2} />
            </div>

          </div>

          <div className="mt-4 flex items-baseline justify-between">

            <div className="text-3xl sm:text-4xl font-black text-purple-950">
              {counts.total
                ? Math.round(
                    (counts.active / counts.total) * 100
                  )
                : 0}
              %
            </div>

            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Active on Portal
            </span>

          </div>

        </div>

      </div>

      {/* ===============================
          3. SEARCH & STATUS FILTER
      =============================== */}

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#051B30] text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>All Brands</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === "all"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("active")}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/70"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === "active"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {counts.active}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("inactive")}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === "inactive"
                ? "bg-slate-700 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Inactive</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === "inactive"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {counts.inactive}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 flex-1 md:max-w-md">
          <div className="relative flex-1">
            {isSearching ? (
              <Loader2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0284C7] animate-spin"
              />
            ) : (
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            )}

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands by name..."
              className="w-full pl-9 pr-14 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isSearching && (
                <Loader2 size={15} className="text-[#0284C7] animate-spin" />
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500 shrink-0 hidden sm:block">
            Showing{" "}
            <span className="text-slate-900 font-extrabold">
              {displayBrands.length}
            </span>{" "}
            of {debouncedSearch ? displayBrands.length : totalBrands}
          </div>
        </div>

      </div>

      {/* ===============================
          4. BRAND GRID
      =============================== */}

      {isLoading ? (

        <div className="flex flex-col items-center justify-center py-28 gap-3 bg-white rounded-2xl border border-slate-200/80">
          <Loader />
          <p className="text-xs font-bold text-slate-400 animate-pulse">
            Loading partner brands...
          </p>
        </div>

      ) : displayBrands.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200/80">

          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Tags size={28} />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-1">
            {statusFilter === "all"
              ? "No brands found"
              : `No ${statusFilter} brands found`}
          </h3>

          <p className="text-xs text-slate-400 max-w-sm mb-5">
            {searchQuery
              ? `No results matching "${searchQuery}".`
              : statusFilter !== "all"
              ? `There are currently no ${statusFilter} partner brands.`
              : "Get started by adding your first authorized partner brand."}
          </p>

          {statusFilter !== "all" ? (
            <button
              onClick={() => setStatusFilter("all")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Show all brands
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
            >
              <Plus size={15} />
              Add First Brand
            </button>
          )}

        </div>

      ) : (

        <div className="space-y-6">

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">

            {displayBrands.map((brand: any) => (

              <BrandCard
                key={brand._id}
                brand={brand}
                isDeleting={deletingId === brand._id}
                onEdit={() => handleEdit(brand)}
                onDelete={() =>
                  handleDeleteConfirm(brand._id)
                }
              />

            ))}

            {/* Add Brand */}

            <button
              onClick={handleAdd}
              className="group min-h-[220px] flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#0284C7] bg-slate-50/50 hover:bg-sky-50/30 transition-all duration-200 cursor-pointer p-4 shadow-2xs hover:shadow-md"
            >

              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 group-hover:border-sky-300 group-hover:bg-[#0284C7] group-hover:text-white text-slate-400 flex items-center justify-center transition-all duration-200 shadow-2xs">

                <Plus
                  size={22}
                  className="transition-transform duration-200 group-hover:rotate-90"
                />

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

          {/* Pagination */}

          {totalBrands > itemsPerPage && (

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">

              <AdminPagination
                currentPage={currentPage}
                totalItems={debouncedSearch ? displayBrands.length : totalBrands}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />

            </div>

          )}

        </div>

      )}

      {/* ===============================
          BRAND MODAL
      =============================== */}

      <AdminBrandModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        brand={selectedBrand}
        onSuccess={fetchBrands}
      />

    </div>
  );
};


/* =========================================================
   BRAND CARD
========================================================= */

interface BrandCardProps {
  brand: any;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  isDeleting,
  onEdit,
  onDelete,
}) => {

  const brandTitle = brand.name || "Brand";

  // IMPORTANT:
  // Backend me logo.url hai
  const logoImage = brand.logo?.url;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5 sm:p-4 shadow-2xs">

      {/* Logo */}

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

      {/* Brand Name */}

      <div className="mt-3 text-center min-w-0">

        <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate group-hover:text-[#0284C7] transition-colors">
          {brandTitle}
        </h4>

        {/* Status */}

        <span
          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border ${
            brand.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {brand.isActive ? "Active" : "Inactive"}
        </span>

      </div>

      {/* Buttons */}

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1.5">

        <button
          onClick={onEdit}
          disabled={isDeleting}
          className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0284C7] border border-slate-200/80 hover:border-sky-300 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          title="Edit Brand"
        >
          <Pencil size={12} />
          <span>Edit</span>
        </button>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/80 hover:border-rose-200 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50"
          title="Delete Brand"
        >
          {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
        </button>

      </div>

      {/* Delete Loading */}

      {isDeleting && (

        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-20">

          <div className="w-5 h-5 border-2 border-slate-300 border-t-[#0284C7] rounded-full animate-spin" />

        </div>

      )}

    </div>
  );
};

export default AdminBrands;