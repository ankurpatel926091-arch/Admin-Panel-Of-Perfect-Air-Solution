import React, { useState } from 'react';
import { useGetServicesQuery, useDeleteServiceMutation } from '@/store/api';
import { toast } from 'sonner';
import AdminServiceModal from './AdminServiceModal';
import Loader from '@/components/ui/Loader';

const AdminServices = () => {
  const { data: services = [], isLoading } = useGetServicesQuery();
  const [deleteService] = useDeleteServiceMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteService(id).unwrap();
      toast.success('Service deleted successfully');
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-1">
            Service Management
          </p>
          <h1 className="heading-1 text-neutral-900">Services</h1>
          <p className="text-neutral-500 mt-1 text-sm">
            {services.length} {services.length === 1 ? 'service' : 'services'} available
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="group inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold px-5 py-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          <span className="text-lg leading-none transition-transform duration-200 group-hover:rotate-90">+</span>
          Add New Service
        </button>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader />
          <p className="text-sm text-neutral-400 animate-pulse">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-md bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-1">No services yet</h3>
          <p className="text-sm text-neutral-400 mb-6 max-w-xs">
            Add your first service to start showcasing what you offer.
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-neutral-700 transition-all active:scale-95 cursor-pointer"
          >
            <span>+</span> Add First Service
          </button>
        </div>
      ) : (
        /* ── Service Cards Grid ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service: any) => (
            <ServiceCard
              key={service._id}
              service={service}
              isDeleting={deletingId === service._id}
              confirmingDelete={confirmDeleteId === service._id}
              onEdit={() => handleEdit(service)}
              onDeleteRequest={() => setConfirmDeleteId(service._id)}
              onDeleteConfirm={() => handleDeleteConfirm(service._id)}
              onDeleteCancel={() => setConfirmDeleteId(null)}
            />
          ))}

          {/* Add New Ghost Card */}
          <button
            onClick={handleAdd}
            className="group flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-white hover:bg-neutral-50 min-h-[220px] transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center transition-colors">
              <span className="text-2xl text-neutral-400 group-hover:text-neutral-600 leading-none">+</span>
            </div>
            <span className="text-xs font-medium text-neutral-400 group-hover:text-neutral-600 transition-colors">
              Add Service
            </span>
          </button>
        </div>
      )}

      <AdminServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

/* ── Service Card ── */
interface ServiceCardProps {
  service: any;
  isDeleting: boolean;
  confirmingDelete: boolean;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service, isDeleting, confirmingDelete,
  onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
}) => {
  return (
    <div className="group relative bg-white rounded-md border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

      {/* Image */}
      <div className="relative h-36 bg-neutral-100 overflow-hidden flex-shrink-0">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Badge */}
        {service.badge && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-neutral-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-md">
              {service.badge}
            </span>
          </div>
        )}
        {/* Rating */}
        {service.rating && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
            <svg className="w-3 h-3 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {service.rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-1">
          {service.title}
        </h3>
        {service.tagline && (
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{service.tagline}</p>
        )}
        <div className="flex items-center justify-between mt-auto pt-1">
          {service.price ? (
            <span className="text-xs font-semibold text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-md">
              {service.price}
            </span>
          ) : <span />}
          {service.duration && (
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {service.duration}
            </span>
          )}
        </div>
      </div>

      {/* Hover Action Bar */}
      {!confirmingDelete && (
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
          <div className="w-px bg-neutral-700" />
          <button
            onClick={onDeleteRequest}
            className="flex-1 py-2.5 bg-neutral-900 hover:bg-red-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* Inline Delete Confirmation */}
      {confirmingDelete && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-neutral-800">Delete service?</p>
            <p className="text-xs text-neutral-500 mt-0.5">This cannot be undone.</p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={onDeleteCancel}
              className="flex-1 py-2 rounded-md border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteConfirm}
              disabled={isDeleting}
              className="flex-1 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isDeleting ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      )}

      {/* Spinner overlay during delete */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AdminServices;