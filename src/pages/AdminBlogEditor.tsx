import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetBlogsQuery, addBlogREST, updateBlogREST, buildBlogFormData } from '@/store/api';
import { toast } from 'sonner';
import {
  ArrowLeft,
  UploadCloud,
  X,
  FileText,
  Tag,
  ImageIcon,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

const POPULAR_CATEGORIES = [
  'Maintenance Tips',
  'HVAC Technology',
  'Installation Guide',
  'Commercial HVAC',
  'Energy Saving',
];

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { data: blogs = [], refetch } = useGetBlogsQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'write' | 'preview'>('write');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If editing, find blog and populate
  useEffect(() => {
    if (isEditing && id) {
      const existing = blogs.find((b: any) => (b._id || b.id) === id);
      if (existing) {
        setTitle(existing.title || '');
        setCategory(existing.category || '');
        setContent(
          Array.isArray(existing.content)
            ? existing.content.join('\n\n')
            : existing.content || ''
        );
        setPreviewUrl(existing.image || '');
      }
    }
  }, [id, isEditing, blogs]);

  // Handle image files
  const applyFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image (PNG, JPG, WEBP)');
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Content parsing
  const paragraphs = useMemo(() => {
    return content
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);
  }, [content]);

  const wordCount = useMemo(() => {
    const text = content.trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!category.trim()) {
      toast.error('Please specify a category');
      return;
    }

    if (paragraphs.length === 0) {
      toast.error('Please enter blog content');
      return;
    }

    if (!isEditing && !imageFile && !previewUrl) {
      toast.error('Featured image is required for a new blog post');
      return;
    }

    try {
      setIsLoading(true);
      const fd = buildBlogFormData(
        { title: title.trim(), category: category.trim(), content: paragraphs },
        imageFile
      );

      if (isEditing && id) {
        await updateBlogREST(id, fd);
        toast.success('Blog post updated successfully!');
      } else {
        await addBlogREST(fd);
        toast.success('Blog post published successfully!');
      }

      await refetch();
      navigate('/admin/blogs');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save blog post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-16 max-w-6xl mx-auto">
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/blogs')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-[#051B30] bg-slate-100 hover:bg-slate-200/80 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Blogs</span>
          </button>

          <span className="text-slate-300">/</span>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-[#051B30]">
              {isEditing ? 'Edit Blog Post' : 'Create New Post'}
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isEditing
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isEditing ? 'Editing' : 'Draft'}
            </span>
          </div>
        </div>

        {/* View mode toggle (Write / Preview) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveView('write')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'write'
                ? 'bg-white text-[#051B30] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={14} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeView === 'preview'
                ? 'bg-white text-[#051B30] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* ── Form Section ── */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left / Main Content (2 Cols) ── */}
          <div className="lg:col-span-2 space-y-6">
            {activeView === 'write' ? (
              <>
                {/* Title & Category Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                      Article Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Top 5 Signs Your AC Needs Gas Refilling & Servicing"
                      className="w-full text-base sm:text-lg font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 focus:border-[#0284C7] transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Maintenance Tips, HVAC Technology, How-To..."
                      className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 focus:border-[#0284C7] transition-all"
                    />

                    {/* Quick Category Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">Quick pick:</span>
                      {POPULAR_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            category === cat
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Article Body Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Article Content <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs font-semibold text-slate-400">
                      Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px]">Enter ↵</kbd> twice for new paragraph
                    </span>
                  </div>

                  <textarea
                    required
                    rows={14}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article content here...&#10;&#10;Separate paragraphs with a blank line (press Enter twice). Each paragraph will be formatted cleanly on the website."
                    className="w-full text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 focus:border-[#0284C7] transition-all resize-y min-h-[300px]"
                  />

                  {/* Word & Paragraph Counter Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-4">
                      <span>
                        <strong className="text-slate-700 font-bold">{paragraphs.length}</strong>{' '}
                        paragraph{paragraphs.length !== 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-slate-700 font-bold">{wordCount}</strong> words
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock size={13} />
                      <span>~{readTime} min read</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* ── Live Article Preview ── */
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
                <div className="space-y-3">
                  {category && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-sky-100 text-[#0284C7] border border-sky-200">
                      {category}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#051B30] tracking-tight leading-tight">
                    {title || 'Article Title Preview'}
                  </h1>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>~{readTime} min read</span>
                  </div>
                </div>

                {previewUrl && (
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50/80 shadow-xs flex items-center justify-center p-2 sm:p-3">
                    <img
                      src={previewUrl}
                      alt="Cover Preview"
                      className="w-full max-h-[500px] object-contain rounded-xl"
                    />
                  </div>
                )}

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                  ) : (
                    <p className="text-slate-400 italic">No content written yet. Switch to Editor to write.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Media & Actions (1 Col) ── */}
          <div className="space-y-6">
            {/* Featured Image Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Featured Image {!isEditing && <span className="text-rose-500">*</span>}
                </label>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 flex items-center justify-center p-2 min-h-[160px]">
                    <img
                      src={previewUrl}
                      alt="Featured"
                      className="max-h-56 max-w-full w-auto h-auto object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg bg-white/90 text-slate-800 text-xs font-bold shadow-md hover:bg-white transition-all cursor-pointer"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(0)} KB)` : 'Current image'}
                  </p>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#0284C7] bg-sky-50/50 scale-[1.01]'
                      : 'border-slate-200 hover:border-[#0284C7] bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-[#0284C7] flex items-center justify-center mb-2.5">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-xs font-extrabold text-slate-700">
                    {isDragging ? 'Drop image here' : 'Drop featured image here'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    or <span className="text-[#0284C7] font-bold underline">browse files</span>
                  </p>
                  <span className="text-[10px] text-slate-400 mt-3">PNG, JPG, WEBP up to 5MB</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Publish Actions Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Publish Status
              </h4>

              {/* Status summary list */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-slate-800">
                    {isEditing ? 'Live / Ready to Update' : 'New Article'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Paragraphs</span>
                  <span className="font-bold text-slate-800">{paragraphs.length} blocks</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Cover Image</span>
                  <span className={`font-bold ${previewUrl ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {previewUrl ? 'Ready' : 'None'}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0284C7] to-cyan-500 hover:from-[#0369A1] hover:to-cyan-600 text-white font-extrabold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-md shadow-sky-950/20 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Article...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{isEditing ? 'Update Post' : 'Publish Post'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/blogs')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 py-2 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel &amp; Discard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEditor;
