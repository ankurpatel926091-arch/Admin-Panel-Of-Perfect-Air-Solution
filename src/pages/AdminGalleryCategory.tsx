import React, { useState, useEffect, useMemo } from "react";
import {
  getGalleryCategories,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
  toggleGalleryCategoryStatus,
  DEFAULT_GALLERY_CATEGORIES,
} from "@/api/galleryCategory.api";

interface GalleryCategoryItem {
  _id: string;
  id?: string;
  title: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import useDebounce from "@/hooks/useDebounce";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Swal from "sweetalert2";

const SUGGESTED_CATEGORIES = [
  "VRF / VRV Systems",
  "Commercial HVAC",
  "Residential AC",
  "Ductable & Cassette",
  "AHU & Maintenance",
];

const AdminGalleryCategory: React.FC = () => {
  const [categories, setCategories] = useState<GalleryCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<GalleryCategoryItem | null>(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryIsActive, setCategoryIsActive] = useState(true);

  // Delete Confirm State
  // const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Fetch from backend
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await getGalleryCategories();
      const list = res?.galleryCategories || res?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setCategories(list);
      } else {
        // Fallback to initial defaults if empty
        setCategories(DEFAULT_GALLERY_CATEGORIES);
      }
    } catch (err: any) {
      console.warn("Fetch categories fallback:", err?.message);
      setCategories(DEFAULT_GALLERY_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtered List
  const filteredCategories = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return categories.filter((c) => {
      const matchesSearch = !q || (c.title || "").toLowerCase().includes(q);
      const isActive = c.isActive !== false;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);
      return matchesSearch && matchesStatus;
    });
  }, [categories, debouncedSearch, statusFilter]);

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryTitle("");
    setCategoryIsActive(true);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: GalleryCategoryItem) => {
    setEditingCategory(item);
    setCategoryTitle(item.title);
    setCategoryIsActive(item.isActive !== false);
    setIsModalOpen(true);
  };

  // Submit Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = categoryTitle.trim();
    if (!cleanTitle) {
      toast.error("Please enter category title");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;
        await updateGalleryCategory(id!, { title: cleanTitle });
        toast.success("Category updated successfully");
      } else {
        await createGalleryCategory({
          title: cleanTitle,
          isActive: categoryIsActive,
        });
        toast.success("Category created successfully");
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save category",
      );
      // Optimistic update for fallback
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;
        setCategories((prev) =>
          prev.map((c) =>
            (c._id || c.id) === id ? { ...c, title: cleanTitle } : c,
          ),
        );
      } else {
        setCategories((prev) => [
          ...prev,
          {
            _id: `cat_${Date.now()}`,
            title: cleanTitle,
            isActive: categoryIsActive,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleStatus = async (item: GalleryCategoryItem) => {
    const id = item._id || item.id;
    if (!id) return;
    try {
      await toggleGalleryCategoryStatus(id);
      toast.success(
        `Category is now ${!item.isActive ? "Active" : "Inactive"}`,
      );
      setCategories((prev) =>
        prev.map((c) =>
          (c._id || c.id) === id ? { ...c, isActive: !c.isActive } : c,
        ),
      );
    } catch (err: any) {
      // Local toggle fallback
      setCategories((prev) =>
        prev.map((c) =>
          (c._id || c.id) === id ? { ...c, isActive: !c.isActive } : c,
        ),
      );
      toast.success(
        `Category is now ${!item.isActive ? "Active" : "Inactive"}`,
      );
    }
  };

  // Delete category
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This category will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0284C7",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteGalleryCategory(id);

      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));

      await Swal.fire({
        title: "Deleted!",
        text: "Category deleted successfully.",
        icon: "success",
        confirmButtonColor: "#0284C7",
      });
    } catch (err: any) {
      console.error("Delete Category Error:", err);

      Swal.fire({
        title: "Delete Failed",
        text: err?.response?.data?.message || "Failed to delete category.",
        icon: "error",
        confirmButtonColor: "#0284C7",
      });
    }
  };

  const activeCount = categories.filter((c) => c.isActive !== false).length;
  const inactiveCount = categories.filter((c) => c.isActive === false).length;

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Header */}
      <div className="bg-[#051B30] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0284C7] to-cyan-400 flex items-center justify-center">
            <Layers size={24} />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              Gallery Categories
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Manage project categories for the website installation showcase.
            </p>
          </div>
        </div>

        {/* Add button */}
        {/* <button
        type="button"
        onClick={() => {
          setEditingCategory(null);
          setCategoryTitle("");
          setCategoryIsActive(true);
        }}
        className="inline-flex items-center justify-center gap-2 bg-[#0284C7] hover:bg-sky-600 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all"
      >
        <Plus size={17} />
        Add Category
      </button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Categories
            </span>

            <span className="text-3xl font-extrabold text-[#051B30] mt-1 block">
              {categories.length}
            </span>
          </div>

          <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
            <Layers size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active on Website
            </span>

            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
              {activeCount}
            </span>
          </div>

          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5 items-start">
        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Search & Filter */}
          <div className="p-4 border-b border-slate-100 space-y-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category name..."
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Active & Inactive Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-[#051B30] text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>All</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      statusFilter === "all"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {categories.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "active"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Active</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      statusFilter === "active"
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {activeCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("inactive")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "inactive"
                      ? "bg-slate-700 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>Inactive</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      statusFilter === "inactive"
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {inactiveCount}
                  </span>
                </button>
              </div>

              <div className="text-xs font-bold text-slate-400">
                Showing {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}
              </div>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="p-16 flex justify-center">
              <Loader />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center">
              <Layers size={36} className="mx-auto text-slate-300 mb-3" />

              <h3 className="text-sm font-bold text-slate-700">
                {statusFilter === "all"
                  ? "No categories found"
                  : `No ${statusFilter} categories found`}
              </h3>
              {statusFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="mt-2 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  Show all categories
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3.5 w-12">#</th>

                    <th className="px-5 py-3.5">Category</th>

                    <th className="px-5 py-3.5">Status</th>

                    <th className="px-5 py-3.5">Date</th>

                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((cat, idx) => {
                    const id = cat._id || cat.id || `idx_${idx}`;

                    const isActive = cat.isActive !== false;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-4 text-xs font-bold text-slate-400">
                          {idx + 1}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />

                            <span className="font-bold text-[#051B30]">
                              {cat.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <ToggleSwitch
                            size="sm"
                            checked={isActive}
                            onChange={() => handleToggleStatus(cat)}
                            ariaLabel={`Toggle status for ${cat.title}`}
                          />
                        </td>

                        <td className="px-5 py-4 text-xs text-slate-400">
                          {cat.createdAt
                            ? new Date(cat.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {/* EDIT */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(cat);
                                setCategoryTitle(cat.title);
                                setCategoryIsActive(cat.isActive !== false);
                              }}
                              title="Edit Category"
                              className="p-2 text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 rounded-lg"
                            >
                              <Pencil size={15} />
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() => handleDelete(id)}
                              title="Delete Category"
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================= RIGHT FORM ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-5">
          {/* Form Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
                {editingCategory ? <Pencil size={18} /> : <Plus size={18} />}
              </div>

              <div>
                <h2 className="text-base font-extrabold text-[#051B30]">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h2>

                <p className="text-xs text-slate-400">
                  {editingCategory
                    ? "Update category details"
                    : "Create a new gallery category"}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Category Name
              </label>

              <input
                type="text"
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
                placeholder="e.g. Commercial HVAC"
                className="w-full px-3.5 py-3 text-sm font-semibold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
              />
            </div>

            {/* Active */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Category Status
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Show this category on the website
                  </p>
                </div>

                <ToggleSwitch
                  size="md"
                  checked={categoryIsActive}
                  onChange={setCategoryIsActive}
                  ariaLabel="Toggle category status"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryTitle("");
                    setCategoryIsActive(true);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0284C7] hover:bg-sky-600 disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingCategory
                    ? "Save Changes"
                    : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryCategory;
