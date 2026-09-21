import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetBlogsQuery, addBlogREST, updateBlogREST, buildBlogFormData } from '@/store/api';
import { toast } from 'sonner';

interface AdminBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: any;
}

const inputClass = "w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all";
const labelClass = "block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5";

const AdminBlogModal: React.FC<AdminBlogModalProps> = ({ isOpen, onClose, blog }) => {
  const { refetch } = useGetBlogsQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'content'>('info');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('info');
      setImageFile(null);
      setIsDragging(false);
      if (blog) {
        setTitle(blog.title || '');
        setCategory(blog.category || '');
        setContent(Array.isArray(blog.content) ? blog.content.join('\n\n') : (blog.content || ''));
        setPreviewUrl(blog.image || '');
      } else {
        setTitle('');
        setCategory('');
        setContent('');
        setPreviewUrl('');
      }
    }
  }, [blog, isOpen]);

  const applyFile = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) applyFile(file);
    else toast.error('Please drop a valid image file');
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Parse content string into paragraphs array
  const parseContent = () =>
    content.split('\n\n').map(p => p.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedContent = parseContent();
    if (parsedContent.length === 0) {
      toast.error('Content cannot be empty');
      setActiveTab('content');
      return;
    }
    if (!blog && !imageFile) {
      toast.error('Featured image is required for new posts');
      setActiveTab('info');
      return;
    }

    try {
      setIsLoading(true);
      const fd = buildBlogFormData({ title, category, content: parsedContent }, imageFile);

      if (blog) {
        await updateBlogREST(blog._id || blog.id, fd);
        toast.success('Blog updated successfully');
      } else {
        await addBlogREST(fd);
        toast.success('Blog created successfully');
      }
      await refetch();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Error saving blog');
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!blog;
  const paragraphCount = parseContent().length;

  const tabs = [
    { key: 'info', label: 'Post Info' },
    { key: 'content', label: `Content${paragraphCount > 0 ? ` (${paragraphCount}p)` : ''}` },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white rounded-md overflow-hidden border border-neutral-200 shadow-md">

        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-neutral-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-neutral-900 leading-tight">
                {isEditing ? 'Edit Blog Post' : 'New Blog Post'}
              </DialogTitle>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isEditing ? `Editing: ${blog.title}` : 'Fill in the details to publish a new post'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 bg-neutral-100 rounded-md p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 overflow-y-auto max-h-[55vh]">

            {/* ── Tab: Post Info ── */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Title *</label>
                    <input
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Top 5 Tips for AC Maintenance"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Category *</label>
                    <input
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Tips & Guides, News, How-to"
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className={labelClass}>
                    Featured Image {!isEditing && '*'}
                  </label>

                  {previewUrl ? (
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden">
                      <div className="flex items-center justify-center p-4 min-h-[140px]">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-32 max-w-full object-contain drop-shadow-sm rounded-md"
                        />
                      </div>
                      <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-200 bg-white">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-xs text-neutral-500 truncate">
                            {imageFile ? `${imageFile.name} (${(imageFile.size / 1024).toFixed(0)} KB)` : 'Current image'}
                          </span>
                        </div>
                        <div className="flex gap-1 ml-2 flex-shrink-0">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-neutral-600 hover:text-neutral-900 font-medium px-2 py-1 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer">Replace</button>
                          <button type="button" onClick={removeImage} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-md transition-colors cursor-pointer">Remove</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center min-h-[130px] rounded-md border-2 border-dashed cursor-pointer transition-all duration-200 ${
                        isDragging ? 'border-neutral-900 bg-neutral-50 scale-[1.01]' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 transition-colors ${isDragging ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
                        <svg className={`w-5 h-5 transition-colors ${isDragging ? 'text-white' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-neutral-600">{isDragging ? 'Drop image' : 'Drop featured image'}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">or <span className="underline underline-offset-2 text-neutral-600 font-medium">browse files</span></p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

                  {isEditing && !imageFile && blog?.image && (
                    <div className="flex items-center gap-2 px-3 py-2 mt-2 bg-amber-50 border border-amber-200 rounded-md">
                      <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs text-amber-700">No new image selected — existing image will be kept.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Tab: Content ── */}
            {activeTab === 'content' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={labelClass + ' mb-0'}>
                    Blog Content *
                  </label>
                  <span className="text-xs text-neutral-400">
                    {paragraphCount} paragraph{paragraphCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 -mt-1">
                  Separate paragraphs with a blank line (double Enter). Each paragraph is saved as a separate block.
                </p>
                <textarea
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className={`${inputClass} font-normal leading-relaxed`}
                  rows={16}
                  placeholder={`Write your first paragraph here...\n\nStart a new paragraph by pressing Enter twice.\n\nEach paragraph block will be saved separately.`}
                  spellCheck
                />

                {/* Live paragraph preview */}
                {paragraphCount > 0 && (
                  <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">Preview — {paragraphCount} paragraph{paragraphCount !== 1 ? 's' : ''}</p>
                    <div className="space-y-2">
                      {parseContent().map((p, i) => (
                        <div key={i} className="flex gap-2.5">
                          <span className="text-xs font-mono text-neutral-300 mt-0.5 flex-shrink-0 w-5">{i + 1}</span>
                          <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">{p}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-6 pb-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
            {/* Dot indicators */}
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`h-2 rounded-full transition-all duration-200 ${activeTab === tab.key ? 'bg-neutral-900 w-5' : 'bg-neutral-300 hover:bg-neutral-400 w-2'}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'content' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('info')}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                >
                  ← Back
                </button>
              )}
              {activeTab === 'info' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold rounded-md transition-all active:scale-95 cursor-pointer"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold rounded-md transition-all duration-200 disabled:opacity-60 active:scale-95 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isEditing ? 'Update Post' : 'Publish Post'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBlogModal;