import React, { useState, useMemo, useEffect } from 'react';
import { useGetContactsQuery, useDeleteContactMutation } from '@/store/api';
import { toast } from 'sonner';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';
import {
  MessageSquare,
  Phone,
  Search,
  X,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const STATUS_FILTERS = ['all', 'New', 'Contacted', 'Resolved'];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'New':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500 animate-pulse',
      };
    case 'Contacted':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'Resolved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
};

const getServiceBadge = (service: string) => {
  const s = (service || '').toLowerCase();
  if (s.includes('vrf')) return 'bg-purple-50 text-purple-700 border-purple-200';
  if (s.includes('amc')) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (s.includes('commercial')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  if (s.includes('repair')) return 'bg-amber-50 text-amber-800 border-amber-200';
  if (s.includes('install')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const AdminContact: React.FC = () => {
  const { data: contacts = [], isLoading } = useGetContactsQuery();
  const [deleteContact] = useDeleteContactMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery]);

  // Local status override map for instant interactive toggles
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id).unwrap();
      toast.success('Inquiry removed');
    } catch {
      toast.error('Failed to delete inquiry');
    } finally {
      setConfirmDeleteId(null);
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: newStatus }));
    toast.success(`Inquiry status updated to ${newStatus}`);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((item: any) => {
      const currentStatus = statusOverrides[item._id] || item.status || 'New';
      const matchesStatus =
        selectedStatus === 'all' || currentStatus.toLowerCase() === selectedStatus.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [contacts, selectedStatus, searchQuery, statusOverrides]);

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredContacts.slice(start, start + itemsPerPage);
  }, [filteredContacts, currentPage, itemsPerPage]);

  const newCount = contacts.filter((c: any) => (statusOverrides[c._id] || c.status) === 'New').length;
  const resolvedCount = contacts.filter((c: any) => (statusOverrides[c._id] || c.status) === 'Resolved').length;

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* ── 1. Top Header Banner ── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#051B30] via-[#08335C] to-[#0D508D] text-white p-6 sm:p-7 shadow-sm overflow-hidden">
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-white/[0.04] pointer-events-none">
          <MessageSquare size={200} strokeWidth={1.2} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
              <MessageSquare size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Contact &amp; Enquiries
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 font-normal">
                Manage customer enquiries and follow-ups.
              </p>
            </div>
          </div>

          <a
            href="/contact-us"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all self-start sm:self-auto"
          >
            <span>Live Contact Page</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* ── 2. Stat Cards Row (3 Cards Only) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Enquiries */}
        <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-indigo-50/60 rounded-2xl p-5 border border-blue-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-blue-900">Total Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-blue-950">{contacts.length}</div>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">Total leads received</p>
          </div>
        </div>

        {/* New Enquiries */}
        <div className="bg-gradient-to-br from-rose-50/90 via-red-50/40 to-pink-50/60 rounded-2xl p-5 border border-rose-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-rose-900">New Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-rose-950">{newCount}</div>
            <p className="text-[11px] text-rose-600 font-semibold mt-1">Pending callback</p>
          </div>
        </div>

        {/* Resolved Enquiries */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-green-50/60 rounded-2xl p-5 border border-emerald-200/80 shadow-2xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-emerald-900">Resolved Enquiries</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-950">{resolvedCount}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Successfully served</p>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone number, or email..."
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

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {STATUS_FILTERS.map((st) => {
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#051B30] to-[#0D508D] text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/90'
                }`}
              >
                <span className="capitalize">{st === 'all' ? 'All' : st}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Inquiries Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <Loader />
            <p className="text-xs sm:text-sm font-semibold text-slate-400 animate-pulse">Loading inquiries...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="py-20 px-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-md">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-base font-extrabold text-[#051B30]">No inquiries found</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              {searchQuery || selectedStatus !== 'all'
                ? 'No inquiries match your current search or status filter.'
                : 'Customer inquiries submitted via the Contact Us form will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border-b border-slate-200/90 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4 w-60">Customer</th>
                  <th className="px-6 py-4 w-44">Service</th>
                  <th className="px-6 py-4">Inquiry Message</th>
                  <th className="px-6 py-4 w-36">Status</th>
                  <th className="px-6 py-4 w-36">Date</th>
                  <th className="px-6 py-4 text-right w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedContacts.map((contact: any) => {
                  const currentStatus = statusOverrides[contact._id] || contact.status || 'New';
                  const statusBadge = getStatusBadge(currentStatus);
                  const isConfirming = confirmDeleteId === contact._id;

                  const initials = contact.name
                    ? contact.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'CU';

                  return (
                    <tr
                      key={contact._id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedInquiry(contact)}
                    >
                      {/* Customer info */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#051B30] to-[#0284C7] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-[#051B30] text-sm group-hover:text-[#0284C7] transition-colors truncate">
                              {contact.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <Phone size={11} className="text-slate-400 shrink-0" />
                              <span>{contact.phone}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service requested */}
                      <td className="px-6 py-4 align-middle">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getServiceBadge(
                            contact.service
                          )}`}
                        >
                          {contact.service || 'General Inquiry'}
                        </span>
                      </td>

                      {/* Message preview */}
                      <td className="px-6 py-4 align-middle max-w-xs">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {contact.message}
                        </p>
                      </td>

                      {/* Interactive Status Switcher */}
                      <td
                        className="px-6 py-4 align-middle"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer shadow-2xs ${statusBadge.bg}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 align-middle">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(contact.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </td>

                      {/* Actions: Call, WhatsApp, Delete */}
                      <td
                        className="px-6 py-4 align-middle text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {isConfirming ? (
                          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-xl px-2.5 py-1">
                            <span className="text-xs text-rose-600 font-bold">Delete?</span>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              className="px-2 py-0.5 bg-rose-600 text-white text-xs font-bold rounded"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 text-slate-500 text-xs font-semibold"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Call */}
                            <a
                              href={`tel:${contact.phone}`}
                              title="Call Phone"
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl border border-blue-200 transition-colors"
                            >
                              <Phone size={14} />
                            </a>

                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/91${contact.phone}?text=Hello%20${encodeURIComponent(
                                contact.name
                              )},%20regarding%20your%20inquiry%20with%20Perfect%20Air%20Solution:`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl border border-emerald-200 transition-colors"
                            >
                              <MessageCircle size={14} />
                            </a>

                            {/* Delete */}
                            <button
                              onClick={() => setConfirmDeleteId(contact._id)}
                              className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-200 transition-colors cursor-pointer"
                              title="Delete Inquiry"
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
        )}

        {/* Pagination Controls */}
        {filteredContacts.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/40">
            <AdminPagination
              currentPage={currentPage}
              totalItems={filteredContacts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* ── 5. Inquiry Details Modal ── */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        {selectedInquiry && (
          <DialogContent className="sm:max-w-lg rounded-2xl p-6 bg-white shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-[#051B30] flex items-center justify-between">
                <span>Inquiry Details</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    getStatusBadge(statusOverrides[selectedInquiry._id] || selectedInquiry.status).bg
                  }`}
                >
                  {statusOverrides[selectedInquiry._id] || selectedInquiry.status}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#051B30] to-[#0284C7] text-white flex items-center justify-center font-black text-sm">
                  {selectedInquiry.name
                    ? selectedInquiry.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'CU'}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#051B30]">{selectedInquiry.name}</h4>
                  <p className="text-xs text-slate-500">{selectedInquiry.email}</p>
                  <p className="text-xs font-bold text-[#0284C7] mt-0.5">{selectedInquiry.phone}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Service Requested
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getServiceBadge(
                    selectedInquiry.service
                  )}`}
                >
                  {selectedInquiry.service || 'General Inquiry'}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Message
                </span>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone size={15} />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedInquiry.phone}?text=Hello%20${encodeURIComponent(
                    selectedInquiry.name
                  )},%20regarding%20your%20inquiry%20with%20Perfect%20Air%20Solution:`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminContact;
