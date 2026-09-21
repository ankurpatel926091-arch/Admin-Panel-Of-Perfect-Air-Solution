import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetServicesQuery, addServiceREST, updateServiceREST, buildServiceFormData } from '@/store/api';
import { toast } from 'sonner';

interface AdminServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: any;
}

const emptyForm = {
  title: '', icon: '', badge: '', tagline: '',
  desc: '', longDesc: '', duration: '', price: '',
  highlights: '', process: '[]', faqs: '[]',
};

const inputClass = "w-full border border-neutral-200 rounded-md px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all";
const labelClass = "block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1.5";

const AdminServiceModal: React.FC<AdminServiceModalProps> = ({ isOpen, onClose, service }) => {
  const { refetch } = useGetServicesQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'advanced'>('basic');
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
      setImageFile(null);
      setIsDragging(false);
      if (service) {
        setFormData({
          title: service.title || '',
          icon: service.icon || '',
          badge: service.badge || '',
          tagline: service.tagline || '',
          desc: service.desc || '',
          longDesc: service.longDesc || '',
          duration: service.duration || '',
          price: service.price || '',
          highlights: Array.isArray(service.highlights) ? service.highlights.join(', ') : '',
          process: service.process ? JSON.stringify(service.process, null, 2) : '[]',
          faqs: service.faqs ? JSON.stringify(service.faqs, null, 2) : '[]',
        });
        setPreviewUrl(service.image || '');
      } else {
        setFormData(emptyForm);
        setPreviewUrl('');
      }
    }
  }, [service, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFile = (file: File) => {
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
    if (file && file.type.startsWith('image/')) applyFile(file);
    else toast.error('Please drop a valid image file');
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate JSON fields
    let parsedProcess = [], parsedFaqs = [];
    try {
      parsedProcess = formData.process ? JSON.parse(formData.process) : [];
      parsedFaqs = formData.faqs ? JSON.parse(formData.faqs) : [];
    } catch {
      toast.error('Invalid JSON in Process or FAQs field');
      setActiveTab('advanced');
      return;
    }

    const parsedHighlights = formData.highlights
      ? formData.highlights.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    try {
      setIsLoading(true);
      const fd = buildServiceFormData(
        {
          title: formData.title,
          icon: formData.icon,
          badge: formData.badge || '',
          tagline: formData.tagline || '',
          desc: formData.desc,
          longDesc: formData.longDesc || '',
          duration: formData.duration || '',
          price: formData.price || '',
          highlights: parsedHighlights,
          process: parsedProcess,
          faqs: parsedFaqs,
          rating: service?.rating ?? 5,
          reviews: service?.reviews ?? 0,
        },
        imageFile
      );

      if (service) {
        await updateServiceREST(service._id || service.id, fd);
        toast.success('Service updated successfully');
      } else {
        await addServiceREST(fd);
        toast.success('Service created successfully');
      }
      await refetch();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Error saving service');
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!service;
  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'details', label: 'Details' },
    { key: 'advanced', label: 'Process & FAQs' },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white rounded-md overflow-hidden border border-neutral-200 shadow-md">

        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-neutral-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-neutral-900 leading-tight">
                {isEditing ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isEditing ? `Editing: ${service.title}` : 'Fill in the details to create a new service'}
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

            {/* ── Tab: Basic Info ── */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Title *</label>
                    <input name="title" required value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. AC Installation & Service" />
                  </div>
                  <div>
                    <label className={labelClass}>Icon Name</label>
                    <input name="icon" value={formData.icon} onChange={handleChange} className={inputClass} placeholder="e.g. AirVent" />
                  </div>
                  <div>
                    <label className={labelClass}>Badge</label>
                    <input name="badge" value={formData.badge} onChange={handleChange} className={inputClass} placeholder="Most Popular" />
                  </div>
                  <div>
                    <label className={labelClass}>Price</label>
                    <input name="price" value={formData.price} onChange={handleChange} className={inputClass} placeholder="Starts from ₹999" />
                  </div>
                  <div>
                    <label className={labelClass}>Duration</label>
                    <input name="duration" value={formData.duration} onChange={handleChange} className={inputClass} placeholder="2–4 Hours" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Tagline</label>
                    <input name="tagline" value={formData.tagline} onChange={handleChange} className={inputClass} placeholder="A short punchy tagline" />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className={labelClass}>Service Image</label>
                  {previewUrl ? (
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden">
                      <div className="flex items-center justify-center p-4 min-h-[120px]">
                        <img src={previewUrl} alt="Preview" className="max-h-28 max-w-full object-contain drop-shadow-sm rounded-md" />
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
                          <button type="button" onClick={handleRemoveImage} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-md transition-colors cursor-pointer">Remove</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center min-h-[120px] rounded-md border-2 border-dashed cursor-pointer transition-all duration-200 ${
                        isDragging ? 'border-neutral-900 bg-neutral-50 scale-[1.01]' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center mb-2 transition-colors ${isDragging ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
                        <svg className={`w-5 h-5 transition-colors ${isDragging ? 'text-white' : 'text-neutral-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-neutral-600">{isDragging ? 'Drop to upload' : 'Drop image here'}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">or <span className="underline underline-offset-2 text-neutral-600 font-medium">browse files</span></p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
              </div>
            )}

            {/* ── Tab: Details ── */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Short Description *</label>
                  <textarea name="desc" required value={formData.desc} onChange={handleChange} className={inputClass} rows={3} placeholder="Brief overview shown in listing cards..." />
                </div>
                <div>
                  <label className={labelClass}>Long Description</label>
                  <textarea name="longDesc" value={formData.longDesc} onChange={handleChange} className={inputClass} rows={5} placeholder="Detailed description shown on the service page..." />
                </div>
                <div>
                  <label className={labelClass}>Highlights <span className="normal-case font-normal text-neutral-400">(comma separated)</span></label>
                  <input name="highlights" value={formData.highlights} onChange={handleChange} className={inputClass} placeholder="Expert technicians, Same day service, 1 year warranty" />
                  {formData.highlights && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.highlights.split(',').map(h => h.trim()).filter(Boolean).map((h, i) => (
                        <span key={i} className="inline-flex items-center px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-md">{h}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Tab: Advanced ── */}
            {activeTab === 'advanced' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelClass + ' mb-0'}>Process Steps <span className="normal-case font-normal text-neutral-400">(JSON array)</span></label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, process: JSON.stringify([{ step: "01", title: "", desc: "" }], null, 2) }))}
                      className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
                    >
                      Insert template
                    </button>
                  </div>
                  <textarea
                    name="process"
                    value={formData.process}
                    onChange={handleChange}
                    className={`${inputClass} font-mono text-xs`}
                    rows={7}
                    placeholder='[{"step": "01", "title": "Inspection", "desc": "..."}]'
                    spellCheck={false}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelClass + ' mb-0'}>FAQs <span className="normal-case font-normal text-neutral-400">(JSON array)</span></label>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, faqs: JSON.stringify([{ q: "", a: "" }], null, 2) }))}
                      className="text-xs text-neutral-500 hover:text-neutral-800 underline underline-offset-2"
                    >
                      Insert template
                    </button>
                  </div>
                  <textarea
                    name="faqs"
                    value={formData.faqs}
                    onChange={handleChange}
                    className={`${inputClass} font-mono text-xs`}
                    rows={7}
                    placeholder='[{"q": "How long does it take?", "a": "..."}]'
                    spellCheck={false}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-6 pb-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
            {/* Tab navigation pills */}
            <div className="flex gap-1">
              {tabs.map((tab, i) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${activeTab === tab.key ? 'bg-neutral-900 w-5' : 'bg-neutral-300 hover:bg-neutral-400'}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Prev / Next */}
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'advanced' ? 'details' : 'basic')}
                  className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                >
                  ← Back
                </button>
              )}
              {activeTab !== 'advanced' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basic' ? 'details' : 'advanced')}
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
                      {isEditing ? 'Update Service' : 'Save Service'}
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

export default AdminServiceModal;