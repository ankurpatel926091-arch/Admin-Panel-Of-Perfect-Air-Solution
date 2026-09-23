import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetBlogsQuery, useDeleteBlogMutation } from '@/store/api';
import { toast } from 'sonner';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';
import {
  Pencil,
  Trash2,
  Plus,
  FileText,
  LayoutGrid,
  List,
  Search,
  Image as ImageIcon,
  Layers,
  Sparkles,
  X,
  Calendar,
  BookOpen,
  ArrowUpRight,
  Filter,
  ChevronDown,
} from 'lucide-react';

/* ── Category Color Mapping ── */
const getCategoryTheme = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('tech')) {
    return {
      pillBg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
      activeBg: 'bg-blue-600 text-white',
      hover: 'hover:bg-blue-100',
    };
  }
  if (cat.includes('maint')) {
    return {
      pillBg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      activeBg: 'bg-amber-600 text-white',
      hover: 'hover:bg-amber-100',
    };
  }
  if (cat.includes('guide')) {
    return {
      pillBg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      activeBg: 'bg-emerald-600 text-white',
      hover: 'hover:bg-emerald-100',
    };
  }
  if (cat.includes('eng')) {
    return {
      pillBg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      dot: 'bg-purple-500',
      activeBg: 'bg-purple-600 text-white',
      hover: 'hover:bg-purple-100',
    };
  }
  if (cat.includes('health')) {
    return {
      pillBg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      activeBg: 'bg-rose-600 text-white',
      hover: 'hover:bg-rose-100',
    };
  }
  return {
    pillBg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
    activeBg: 'bg-cyan-600 text-white',
    hover: 'hover:bg-cyan-100',
  };
};

const AdminBlogs = () => {
  const navigate = useNavigate();
  const { data: blogs = [], isLoading } = useGetBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleAdd = () => {
    navigate('/admin/blogs/create');
  };

  const handleEdit = (blog: any) => {
    navigate(`/admin/blogs/edit/${blog._id || blog.id}`);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteBlog(id).unwrap();
      toast.success('Blog deleted successfully');
    } catch {
      toast.error('Failed to delete blog');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const categories = useMemo(() => {
    return Array.from(new Set(blogs.map((b: any) => b.category).filter(Boolean)));
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: any) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

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
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
              <FileText size={26} />
            </div>
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
              {blogs.length}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              Live Articles
            </span>
          </div>
        </div>

        {/* Card 2: Purple / Violet Theme */}
        <div className="bg-gradient-to-br from-purple-50/90 via-fuchsia-50/30 to-violet-50/60 rounded-2xl p-5 sm:p-6 border border-purple-200/80 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-purple-900 block">
                Categories
              </span>
             
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25">
              <Layers size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight leading-none">
              {categories.length}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
              Categories
            </span>
          </div>
        </div>

        {/* Card 3: Emerald / Teal Theme */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/60 rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs sm:text-sm font-bold text-emerald-900 block">
                Visual Covers
              </span>
            
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
              <ImageIcon size={20} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight leading-none">
              {blogs.filter((b: any) => b.image).length}
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
              HD Media
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Colorful Search & Category Filter Toolbar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, category, or keyword..."
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

        {/* Category Dropdown (DDL) & View Switcher */}
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
              <option value="all">All Posts ({blogs.length})</option>
              {categories.map((cat: any) => {
                const count = blogs.filter((b: any) => b.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
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
              onClick={() => setView('table')}
              title="Table View"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                view === 'table'
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView('grid')}
              title="Grid View"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                view === 'grid'
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
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
              {searchQuery || selectedCategory !== 'all'
                ? 'No posts matched your current search filters.'
                : 'Start publishing HVAC insights, tips, and updates for your audience.'}
            </p>
            {searchQuery || selectedCategory !== 'all' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
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
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Content Preview</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBlogs.map((blog: any) => {
                  const preview = Array.isArray(blog.content) ? blog.content[0] : blog.content;
                  const isConfirming = confirmDeleteId === blog._id;
                  const isDeleting = deletingId === blog._id;
                  const catTheme = getCategoryTheme(blog.category);

                  return (
                    <tr
                      key={blog._id}
                      className="hover:bg-gradient-to-r hover:from-sky-50/40 hover:to-transparent transition-colors group"
                    >
                      {/* Cover Thumbnail */}
                      <td className="px-6 py-4 align-middle">
                        {blog.image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200/90 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                            <img
                              src={blog.image}
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
                          <span className="text-slate-500 font-semibold">
                            {Array.isArray(blog.content) ? blog.content.length : 1} paragraphs
                          </span>
                          {blog.createdAt && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-slate-400">
                                <Calendar size={11} />
                                {new Date(blog.createdAt).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Colorful Category Tag */}
                      <td className="px-6 py-4 align-middle">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${catTheme.pillBg} ${catTheme.text} ${catTheme.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${catTheme.dot}`} />
                          <span>{blog.category || 'General'}</span>
                        </span>
                      </td>

                      {/* Preview Snippet */}
                      <td className="px-6 py-4 align-middle max-w-xs">
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {preview || 'No preview available.'}
                        </p>
                      </td>

                      {/* Colorful Action Buttons */}
                      <td className="px-6 py-4 align-middle text-right">
                        {isConfirming ? (
                          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5 shadow-sm">
                            <span className="text-xs text-rose-600 font-bold">Delete?</span>
                            <button
                              onClick={() => handleDeleteConfirm(blog._id)}
                              disabled={isDeleting}
                              className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isDeleting ? '...' : 'Yes'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(blog)}
                              title="Edit Article"
                              className="p-2.5 text-blue-600 bg-blue-50/80 hover:bg-blue-600 hover:text-white border border-blue-200/80 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(blog._id)}
                              title="Delete Article"
                              className="p-2.5 text-rose-600 bg-rose-50/80 hover:bg-rose-600 hover:text-white border border-rose-200/80 rounded-xl transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-sm"
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
        ) : (
          /* ── Colorful Grid View ── */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedBlogs.map((blog: any) => {
              const preview = Array.isArray(blog.content) ? blog.content[0] : blog.content;
              const isConfirming = confirmDeleteId === blog._id;
              const isDeleting = deletingId === blog._id;
              const catTheme = getCategoryTheme(blog.category);

              return (
                <div
                  key={blog._id}
                  className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Header */}
                    <div className="h-44 bg-slate-100 overflow-hidden relative">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <FileText size={32} />
                        </div>
                      )}
                      <span
                        className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-extrabold border shadow-md flex items-center gap-1.5 backdrop-blur-md ${catTheme.pillBg}/90 ${catTheme.text} ${catTheme.border}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${catTheme.dot}`} />
                        <span>{blog.category || 'General'}</span>
                      </span>
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
                      {Array.isArray(blog.content) ? blog.content.length : 1} paragraphs
                    </span>

                    {isConfirming ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDeleteConfirm(blog._id)}
                          disabled={isDeleting}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          {isDeleting ? '...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Blog"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(blog._id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Blog"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
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