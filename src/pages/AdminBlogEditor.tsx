import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useGetBlogsQuery, addBlogREST, updateBlogREST, buildBlogFormData } from '@/store/api';
import CKEditorComponent from '@/components/CKEditorComponent';
import { toast } from 'react-toastify';
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

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const location = useLocation();
  console.log(location.state?.mode)

  const { data: blogs = [], refetch } = useGetBlogsQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'write' | 'preview'>('write');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const SUGGESTED_TAGS = [
    'VRF / VRV',
    'Commercial HVAC',
    'Residential AC',
    'Split AC',
    'Ductable & Cassette',
    'Energy Efficiency',
    'Maintenance Tips',
    'HVAC Installation',
  ];

  // If editing, find blog and populate
  useEffect(() => {
    if (isEditing && id) {
      const existing = blogs.find((b: any) => (b._id || b.id) === id);
      if (existing) {
        setTitle(existing.title || '');
        setTags(Array.isArray(existing.tags) ? existing.tags : []);
        if (Array.isArray(existing.content)) {
          setContent(
            existing.content
              .map((p: string) => (p.startsWith('<') ? p : `<p>${p}</p>`))
              .join('')
          );
        } else {
          setContent(existing.content || '');
        }
        setPreviewUrl(existing.image || '');
      }
    }
  }, [id, isEditing, blogs]);

  // Tag helper handlers
  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd || tagInput).trim();
    if (!val) return;
    if (tags.some((t) => t.toLowerCase() === val.toLowerCase())) {
      toast.info('Tag already added');
      setTagInput('');
      return;
    }
    setTags([...tags, val]);
    setTagInput('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(()=>{
    if(location.state?.mode){
      setActiveView('preview')
    }
  },[])

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

  // Plain text extraction from rich HTML for counting
  const plainText = useMemo(() => {
    if (!content) return '';
    return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }, [content]);

  const wordCount = useMemo(() => {
    return plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  }, [plainText]);

  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!content.trim() || !plainText) {
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
        {
          title: title.trim(),
          content: content,
          tags: tags,
          readTime: `${readTime} min read`,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          author: 'Perfect Air Solution',
        },
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
    <div className="space-y-6 font-sans pb-16 max-w-full mx-auto">
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

                  {/* Topics / Tags */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        Topics / Tags (Badges on Website)
                      </label>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {tags.length} added
                      </span>
                    </div>

                    {/* Active Tags list */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200 shadow-2xs"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(idx)}
                              className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full p-0.5 transition-colors cursor-pointer"
                              title="Remove tag"
                            >
                              <X size={13} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tag input row */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Type a tag and press Enter (e.g. Split AC, Maintenance Tips)..."
                        className="flex-1 text-sm font-semibold text-slate-800 placeholder:text-slate-400 placeholder:font-normal border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 focus:border-[#0284C7] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTag()}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0284C7] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      >
                        + Add Tag
                      </button>
                    </div>

                    {/* Suggested Quick Tags */}
                    <div className="mt-3.5">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Quick Suggested Tags (Click to Toggle):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_TAGS.map((st) => {
                          const isSelected = tags.some((t) => t.toLowerCase() === st.toLowerCase());
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setTags(tags.filter((t) => t.toLowerCase() !== st.toLowerCase()));
                                } else {
                                  handleAddTag(st);
                                }
                              }}
                              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {isSelected ? `✓ ${st}` : `+ ${st}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Article Body Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Article Content <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#0284C7]" />
                      <span>Rich Text CKEditor</span>
                    </span>
                  </div>

                  <CKEditorComponent
                    value={content}
                    onChange={(val) => setContent(val)}
                    placeholder="Write your article content here with formatting, headings, lists, tables, and links..."
                  />

                  {/* Word & Reading Time Counter Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-4">
                      <span>
                        <strong className="text-slate-700 font-bold">{wordCount}</strong> words
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-slate-700 font-bold">
                          {plainText ? plainText.length : 0}
                        </strong> characters
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
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
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

                <div
                  className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed custom-ckeditor-preview"
                  dangerouslySetInnerHTML={{
                    __html:
                      content && plainText
                        ? content
                        : '<p class="text-slate-400 italic">No content written yet. Switch to Editor to write.</p>',
                  }}
                />
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
                  <span className="text-slate-500">Words</span>
                  <span className="font-bold text-slate-800">{wordCount} words</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Read Time</span>
                  <span className="font-bold text-slate-800">~{readTime} min</span>
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
