import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetBrandsQuery, addBrandREST, updateBrandREST } from '@/store/api';
import { toast } from 'sonner';

interface AdminBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: any;
}

const AdminBrandModal: React.FC<AdminBrandModalProps> = ({ isOpen, onClose, brand }) => {
  const { refetch } = useGetBrandsQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      setPreviewUrl(brand?.heroImage || '');
      setIsDragging(false);
    }
  }, [brand, isOpen]);

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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand && !imageFile) {
      toast.error('Please select an image to upload');
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (imageFile) formData.append('heroImage', imageFile);

      if (brand) {
        await updateBrandREST(brand._id || brand.id, formData);
        toast.success('Brand updated successfully');
      } else {
        await addBrandREST(formData);
        toast.success('Brand added successfully');
      }
      await refetch();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Error saving brand');
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!brand;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white rounded-md overflow-hidden border border-neutral-200 shadow-md">

        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-neutral-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-neutral-900 leading-tight">
                {isEditing ? 'Update Brand Logo' : 'Add New Brand'}
              </DialogTitle>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isEditing ? 'Replace the existing logo image' : 'Upload a brand partner logo'}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">

            {previewUrl ? (
              /* ── Preview State ── */
              <div className="relative rounded-md border border-neutral-200 bg-neutral-50 overflow-hidden">
                <div className="flex items-center justify-center p-6 min-h-[160px]">
                  <img
                    src={previewUrl}
                    alt="Brand preview"
                    className="max-h-32 max-w-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-200 bg-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-neutral-500 truncate">
                      {imageFile ? imageFile.name : 'Current logo'}
                    </span>
                    {imageFile && (
                      <span className="text-xs text-neutral-400 flex-shrink-0">
                        ({(imageFile.size / 1024).toFixed(0)} KB)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-neutral-600 hover:text-neutral-900 font-medium px-2 py-1 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Drop Zone State ── */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative flex flex-col items-center justify-center min-h-[160px] rounded-md border-2 border-dashed cursor-pointer transition-all duration-200
                  ${isDragging
                    ? 'border-neutral-900 bg-neutral-50 scale-[1.01]'
                    : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50 hover:bg-white'
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-md flex items-center justify-center mb-3 transition-colors duration-200 ${isDragging ? 'bg-neutral-900' : 'bg-neutral-200'}`}>
                  <svg
                    className={`w-5 h-5 transition-colors duration-200 ${isDragging ? 'text-white' : 'text-neutral-500'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-neutral-700">
                  {isDragging ? 'Drop to upload' : 'Drop image here'}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  or <span className="text-neutral-600 font-medium underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-neutral-400 mt-3">PNG, JPG, SVG, WEBP</p>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Keep existing notice */}
            {isEditing && !imageFile && brand?.heroImage && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md">
                <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-700">No new file selected — existing logo will be kept.</p>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-6 pb-6 flex items-center justify-end gap-2 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
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
                  {isEditing ? 'Update Brand' : 'Save Brand'}
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBrandModal;