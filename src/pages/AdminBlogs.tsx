import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBlogsQuery, useDeleteBlogMutation, useToggleBlogStatusMutation } from '@/store/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';
import useDebounce from '@/hooks/useDebounce';
import {
  Pencil,
  Trash2,
  Plus,
  FileText,
  LayoutGrid,
  List,
  Search,
  Image as ImageIcon,
  Sparkles,
  X,
  Calendar,
  BookOpen,
  ArrowLeft,
  Loader2,
  Eye,
} from 'lucide-react';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const AdminBlogs = () => {
  const navigate = useNavigate();
  const { data: blogs = [], isLoading, refetch } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  const [toggleBlogStatus] = useToggleBlogStatusMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, boolean>>({});

  const [view, setView] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const debouncedSearch = useDebounce(searchQuery, 500);
  const isSearching = searchQuery !== debouncedSearch || (isLoading && Boolean(searchQuery));

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const getIsActive = (blog: any) => {
    const id = blog._id || blog.id;
    if (id && statusOverrides[id] !== undefined) {
      return statusOverrides[id];
    }
    return blog.isActive !== false;
  };

  const handleAdd = () => {
    navigate('/admin/blogs/create');
  };

  const handleEdit = (blog: any) => {
    navigate(`/admin/blogs/edit/${blog._id || blog.id}`);
  };

  const handleView = (blog: any) => {
    navigate(`/admin/blogs/edit/${blog._id || blog.id}`, {
      state: {
        mode: 'view',
      },
    });
  };

  const handleToggleStatus = async (blog: any) => {
    const id = blog._id || blog.id;
    if (!id) return;

    const currentStatus = getIsActive(blog);
    const targetStatus = !currentStatus;

    // 1. Instantly flip the switch button state on screen
    setStatusOverrides((prev) => ({ ...prev, [id]: targetStatus }));
    setTogglingId(id);

    try {
      // 2. Call backend to update
      const res = await toggleBlogStatus(id).unwrap();
      const confirmedStatus =
        res?.data?.isActive !== undefined ? res.data.isActive : targetStatus;

      setStatusOverrides((prev) => ({ ...prev, [id]: confirmedStatus }));

      // 3. Sync full data in background
      await refetch();

      // 4. Show toast notification AFTER status is toggled
      toast.success(`Blog is now ${confirmedStatus ? 'Active' : 'Inactive'}`);
    } catch (err: any) {
      // Revert if request failed
      setStatusOverrides((prev) => ({ ...prev, [id]: currentStatus }));
      toast.error(err?.data?.message || err?.message || 'Failed to update blog status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete blog post?',
      text: 'This blog post will be permanently removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0284C7',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteBlog(id).unwrap();
      await refetch();
      await Swal.fire({
        title: 'Deleted!',
        text: 'Blog post deleted successfully.',
        icon: 'success',
        confirmButtonColor: '#0284C7',
      });
    } catch (err: any) {
      await Swal.fire({
        title: 'Delete failed',
        text: err?.data?.message || err?.message || 'Failed to delete blog post.',
        icon: 'error',
        confirmButtonColor: '#0284C7',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const counts = useMemo(() => {
    const total = blogs.length;
    const active = blogs.filter((b: any) => getIsActive(b)).length;
    const inactive = blogs.filter((b: any) => !getIsActive(b)).length;
    return { total, active, inactive };
  }, [blogs, statusOverrides]);

  const filteredBlogs = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return blogs.filter((blog: any) => {
      const matchSearch =
        !q ||
        blog.title?.toLowerCase().includes(q) ||
        blog.author?.toLowerCase().includes(q) ||
        blog.excerpt?.toLowerCase().includes(q);

      const isActive = getIsActive(blog);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isActive) ||
        (statusFilter === 'inactive' && !isActive);

      return matchSearch && matchStatus;
    });
  }, [blogs, debouncedSearch, statusFilter, statusOverrides]);

  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(start, start + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* ── 1. Colorful Top Welcome Banner (Matching Dashboard Theme) ── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#051B30] via-[#08335C] to-[#0D508D] text-white p-6 sm:p-7 shadow-sm overflow-hidden">
        {/* Decorative Background Graphic */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-white/[0.05] pointer-events-none">
          <BookOpen size={200} strokeWidth={1.2} />
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
                Blog Posts &amp; Guides
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-normal">
                Manage, publish, and showcase HVAC engineering insights and articles.
              </p>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="self-start sm:self-auto group inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] to-cyan-500 hover:from-[#0369A1] hover:to-cyan-600 text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-sky-950/30 hover:shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus size={18} className="transition-transform duration-200 group-hover:rotate-90" />
            <span>New Blog Post</span>
          </button>
        </div>
      </div>

      {/* ── 2. Colorful Stat Cards (Rich Colors & Gradients) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Blue / Indigo Theme */}
        <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-indigo-50/60 rounded-2xl p-5 sm:p-6 border border-blue-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-blue-900 block">
                Total Articles
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
              <FileText size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight leading-none">
              {isLoading ? (
                <div className="h-8 w-16 bg-blue-200/60 rounded-md animate-pulse my-0.5" />
              ) : (
                counts.total
              )}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Total Posts
            </span>
          </div>
        </div>

        {/* Card 2: Emerald / Green Theme (Active) */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/30 to-green-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 block">
                Active Posts
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <Sparkles size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight leading-none">
              {isLoading ? (
                <div className="h-8 w-16 bg-emerald-200/60 rounded-md animate-pulse my-0.5" />
              ) : (
                counts.active
              )}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              Live &amp; Visible
            </span>
          </div>
        </div>

        {/* Card 3: Slate / Inactive Theme */}
        <div className="bg-gradient-to-br from-slate-50/90 via-gray-50/40 to-slate-100/60 rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                Inactive Posts
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-600 to-slate-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-500/25">
              <ImageIcon size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {isLoading ? (
                <div className="h-8 w-16 bg-slate-200/60 rounded-md animate-pulse my-0.5" />
              ) : (
                counts.inactive
              )}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 border border-slate-300">
              Hidden / Draft
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Status Filter Toolbar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#051B30] text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/80'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === 'active' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {counts.active}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/80'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Inactive</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                statusFilter === 'inactive' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {counts.inactive}
            </span>
          </button>
        </div>

        {/* Search input + View switch */}
        <div className="flex items-center gap-3 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or keyword..."
              className="w-full pl-9 pr-14 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {isSearching && (
                <Loader2 size={14} className="text-[#0284C7] animate-spin" />
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={() => setView('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                view === 'table'
                  ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                view === 'grid'
                  ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Main Content Container ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <Loader />
            <p className="text-xs sm:text-sm font-semibold text-slate-400 animate-pulse">
              Loading articles...
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 px-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-md shadow-sky-100">
              <FileText size={28} />
            </div>
            <h3 className="text-base font-extrabold text-[#051B30]">No blog posts found</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'No posts matched your current search filters.'
                : 'Start publishing HVAC insights, tips, and updates for your audience.'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-2 text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Write First Post</span>
              </button>
            )}
          </div>
        ) : view === 'table' ? (
          /* ── Colorful Table View ── */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border-b border-slate-200/90 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 w-20">Cover</th>
                  <th className="px-6 py-4">Title &amp; Meta</th>
                  <th className="px-6 py-4">Content Preview</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBlogs.map((blog: any) => {
                  const blogId = blog._id || blog.id;
                  const rawPreview = Array.isArray(blog.content) ? blog.content[0] : blog.content;
                  const preview = (rawPreview || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                  const isDeleting = deletingId === blogId;
                  const isToggling = togglingId === blogId;
                  const isActive = getIsActive(blog);

                  return (
                    <tr
                      key={blogId}
                      className="hover:bg-gradient-to-r hover:from-sky-50/40 hover:to-transparent transition-colors group"
                    >
                      {/* Cover Thumbnail */}
                      <td className="px-6 py-4 align-middle">
                        {blog.image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200/90 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                            <img
                              src={typeof blog.image === 'object' ? blog.image?.url : blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200/60 shrink-0">
                            <FileText size={18} />
                          </div>
                        )}
                      </td>

                      {/* Title & Meta */}
                      <td className="px-6 py-4 align-middle max-w-xs sm:max-w-sm">
                        <p className="font-extrabold text-[#051B30] text-sm leading-snug group-hover:text-[#0284C7] transition-colors line-clamp-2">
                          {blog.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-medium">
                          {blog.createdAt && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Calendar size={11} />
                              {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Preview Snippet */}
                      <td className="px-6 py-4 align-middle max-w-xs">
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {preview || 'No preview available.'}
                        </p>
                      </td>

                      {/* Actions Column: Active/Inactive Button BEFORE View */}
                      <td className="px-6 py-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                            {/* 1. Active / Inactive Toggle Switch (Before View) */}
                            <div
                              className="inline-flex items-center"
                              title={isActive ? 'Active (Click to mark Inactive)' : 'Inactive (Click to mark Active)'}
                            >
                              <ToggleSwitch
                                size="sm"
                                checked={isActive}
                                disabled={isToggling}
                                onChange={() => handleToggleStatus(blog)}
                                ariaLabel="Toggle blog active status"
                              />
                            </div>

                            {/* 2. View Button */}
                            <button
                              onClick={() => handleView(blog)}
                              title="View Article"
                              className="p-2.5 text-blue-600 bg-blue-50/80 hover:bg-blue-600 hover:text-white border border-blue-200/80 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm"
                            >
                              <Eye size={14} />
                            </button>

                            {/* 3. Edit Button */}
                            <button
                              onClick={() => handleEdit(blog)}
                              title="Edit Article"
                              className="p-2.5 text-blue-600 bg-blue-50/80 hover:bg-blue-600 hover:text-white border border-blue-200/80 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm"
                            >
                              <Pencil size={14} />
                            </button>

                            {/* 4. Delete Button */}
                            <button
                              onClick={() => handleDeleteConfirm(blogId)}
                              disabled={isDeleting}
                              title="Delete Article"
                              className="p-2.5 text-rose-600 bg-rose-50/80 hover:bg-rose-600 hover:text-white border border-rose-200/80 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm disabled:opacity-50"
                            >
                              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Colorful Grid View ── */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedBlogs.map((blog: any) => {
              const blogId = blog._id || blog.id;
              const rawPreview = Array.isArray(blog.content) ? blog.content[0] : blog.content;
              const preview = (rawPreview || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
              const isDeleting = deletingId === blogId;
              const isToggling = togglingId === blogId;
              const isActive = getIsActive(blog);

              return (
                <div
                  key={blogId}
                  className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Header */}
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      {blog.image ? (
                        <img
                          src={typeof blog.image === 'object' ? blog.image?.url : blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <FileText size={32} />
                        </div>
                      )}

                      {/* Status pill overlay on card */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs border ${
                            isActive
                              ? 'bg-emerald-50/95 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100/95 text-slate-600 border-slate-300'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-extrabold text-[#051B30] text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-[#0284C7] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {preview || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Article'}
                    </span>

                    <div className="flex items-center gap-1.5">
                        {/* 1. Active / Inactive Toggle Switch (Before View) */}
                        <div
                          className="inline-flex items-center"
                          title={isActive ? 'Active (Click to mark Inactive)' : 'Inactive (Click to mark Active)'}
                        >
                          <ToggleSwitch
                            size="sm"
                            checked={isActive}
                            disabled={isToggling}
                            onChange={() => handleToggleStatus(blog)}
                            ariaLabel="Toggle blog active status"
                          />
                        </div>

                        {/* 2. View Button */}
                        <button
                          onClick={() => handleView(blog)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Blog"
                        >
                          <Eye size={15} />
                        </button>

                        {/* 3. Edit Button */}
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Blog"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* 4. Delete Button */}
                        <button
                          onClick={() => handleDeleteConfirm(blogId)}
                          disabled={isDeleting}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Blog"
                        >
                          {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Ghost Card */}
            <button
              onClick={handleAdd}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-sky-200 hover:border-[#0284C7] bg-sky-50/30 hover:bg-sky-50/60 min-h-[260px] transition-all duration-200 cursor-pointer p-6"
            >
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-cyan-500 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-md shadow-sky-500/25">
                <Plus size={24} />
              </div>
              <div className="text-center">
                <span className="text-sm font-extrabold text-[#051B30] group-hover:text-[#0284C7] transition-colors block">
                  Write New Blog
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Publish a new HVAC guide or article
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40">
          <AdminPagination
            currentPage={currentPage}
            totalItems={filteredBlogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;