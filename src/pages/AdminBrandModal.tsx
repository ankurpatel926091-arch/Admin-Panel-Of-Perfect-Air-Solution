import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  createBrand,
  updateBrand,
} from "@/api/brand.api";

import { toast } from "react-toastify";
import { Tag, UploadCloud, Check, X, Trash2 } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface AdminBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: any;
  onSuccess?: () => void;
}

const AdminBrandModal: React.FC<AdminBrandModalProps> = ({
  isOpen,
  onClose,
  brand,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Brand name
  const [name, setName] = useState("");

  // Active status
  const [isActive, setIsActive] = useState(true);

  // Selected image
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Image preview
  const [previewUrl, setPreviewUrl] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!brand;

  // =====================================================
  // OPEN MODAL
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      setIsDragging(false);

      if (brand) {
        // Edit mode
        setName(brand.name || "");
        setIsActive(brand.isActive ?? true);

        // Backend response:
        // logo: {
        //   url: "...",
        //   public_id: "..."
        // }

        setPreviewUrl(brand.logo?.url || "");
      } else {
        // Add mode
        setName("");
        setIsActive(true);
        setPreviewUrl("");
      }
    }
  }, [brand, isOpen]);

  // =====================================================
  // APPLY FILE
  // =====================================================

  const applyFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setImageFile(file);

    const preview = URL.createObjectURL(file);

    setPreviewUrl(preview);
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      applyFile(file);
    }
  };

  // =====================================================
  // DROP
  // =====================================================

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      applyFile(file);
    }
  };

  // =====================================================
  // DRAG OVER
  // =====================================================

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    setIsDragging(true);
  };

  // =====================================================
  // DRAG LEAVE
  // =====================================================

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Name validation
    if (!name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    // Add mode me logo required hai
    if (!isEditing && !imageFile) {
      toast.error("Please select a brand logo");
      return;
    }

    try {
      setIsLoading(true);

      // =================================================
      // FORM DATA
      // =================================================

      const formData = new FormData();

      // Backend:
      // const { name, isActive } = req.body;

      formData.append("name", name.trim());

      formData.append(
        "isActive",
        String(isActive)
      );

      // Backend:
      // upload.single("logo")

      if (imageFile) {
        formData.append("logo", imageFile);
      }

      console.log("Submitting Brand:", {
        name,
        isActive,
        imageFile,
      });

      // =================================================
      // UPDATE
      // =================================================

      if (isEditing) {
        await updateBrand(
          brand._id,
          formData
        );

        toast.success(
          "Brand updated successfully"
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        await createBrand(formData);

        toast.success(
          "Brand added successfully"
        );
      }

      // Refresh parent brands
      if (onSuccess) {
        await onSuccess();
      }

      // Close modal
      onClose();

    } catch (error: any) {
      console.error(
        "Brand Save Error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to save brand"
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-[480px] p-0 gap-0 bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl">

        {/* =========================================
            HEADER
        ========================================= */}
        <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284C7]/15 to-sky-500/25 text-[#0284C7] flex items-center justify-center flex-shrink-0 border border-sky-100 shadow-sm">
              <Tag size={18} className="text-[#0284C7]" />
            </div>

            <div>
              <DialogTitle className="text-lg font-bold text-slate-800 leading-tight">
                {isEditing
                  ? "Update Brand"
                  : "Add New Brand"}
              </DialogTitle>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {isEditing
                  ? "Update brand information and logo"
                  : "Add a new brand partner"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* =========================================
            FORM
        ========================================= */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">

            {/* =====================================
                BRAND NAME
            ===================================== */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Brand Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. Daikin, Mitsubishi, LG"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/15"
              />
            </div>

            {/* =====================================
                ACTIVE STATUS
            ===================================== */}
            <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 bg-slate-50/60">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Active Brand
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Show this brand publicly on the website
                </p>
              </div>

              <ToggleSwitch
                size="sm"
                checked={isActive}
                onChange={setIsActive}
                ariaLabel="Toggle active brand status"
              />
            </div>

            {/* =====================================
                IMAGE PREVIEW / DROP ZONE
            ===================================== */}
            {previewUrl ? (
              <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                <div className="flex items-center justify-center p-4 min-h-[120px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                  <img
                    src={previewUrl}
                    alt="Brand preview"
                    className="max-h-20 max-w-[70%] object-contain drop-shadow-sm transition-transform hover:scale-105"
                  />
                </div>

                <div className="px-3 py-2 border-t border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>

                    <span className="text-xs font-medium text-slate-600 truncate">
                      {imageFile
                        ? imageFile.name
                        : "Current logo"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 pl-7">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="text-xs font-semibold text-slate-600 hover:text-[#0284C7] px-2 py-0.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Replace
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-0.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`
                  relative flex flex-col items-center justify-center min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 p-6
                  ${
                    isDragging
                      ? "border-[#0284C7] bg-sky-50/60 scale-[1.01]"
                      : "border-slate-300 hover:border-[#0284C7] bg-slate-50/60 hover:bg-white"
                  }
                `}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors duration-200 ${
                    isDragging
                      ? "bg-[#0284C7] text-white shadow-md shadow-sky-500/20"
                      : "bg-white text-slate-500 border border-slate-200 shadow-sm"
                  }`}
                >
                  <UploadCloud size={22} />
                </div>

                <p className="text-sm font-semibold text-slate-700 text-center">
                  {isDragging
                    ? "Drop logo here"
                    : "Click or drag brand logo here"}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Supports PNG, JPG, SVG, WEBP
                </p>
              </div>
            )}

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* =========================================
              FOOTER
          ========================================= */}
          <div className="px-5 py-4 flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 hover:shadow-lg transition-all duration-200 disabled:opacity-60 active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  <span>
                    {isEditing
                      ? "Update Brand"
                      : "Save"}
                  </span>
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