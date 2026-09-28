import React, { useState, useMemo, useEffect } from 'react';
import { getContacts } from '@/api/contact.api';
import { toast } from 'sonner';
import Loader from '@/components/ui/Loader';
import AdminPagination from '@/components/AdminPagination';
import useDebounce from '@/hooks/useDebounce';

import {
  MessageSquare,
  Phone,
  Search,
  X,
  Calendar,
  MessageCircle,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


// ─────────────────────────────────────────────
// Service Badge
// ─────────────────────────────────────────────

const getServiceBadge = (service: string) => {
  const s = (service || '').toLowerCase();

  if (s.includes('vrf')) {
    return 'bg-purple-50 text-purple-700 border-purple-200';
  }

  if (s.includes('amc')) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }

  if (s.includes('commercial')) {
    return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  }

  if (s.includes('repair')) {
    return 'bg-amber-50 text-amber-800 border-amber-200';
  }

  if (s.includes('install')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }

  return 'bg-slate-100 text-slate-700 border-slate-200';
};


// ─────────────────────────────────────────────
// Admin Contact
// ─────────────────────────────────────────────

const AdminContact: React.FC = () => {
  // ───────────────────────────────────────────
  // Contact Data
  // ───────────────────────────────────────────

  const [contacts, setContacts] = useState<any[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ───────────────────────────────────────────
  // UI States
  // ───────────────────────────────────────────

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  // ───────────────────────────────────────────
  // Pagination
  // ───────────────────────────────────────────

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  // ───────────────────────────────────────────
  // Fetch Contacts
  // ───────────────────────────────────────────

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);

        const data = await getContacts();

        setContacts(data.contacts || []);
        setTotalContacts(data.total || 0);
      } catch (error) {
        console.error('Error fetching contacts:', error);

        toast.error('Failed to load inquiries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);


  // ───────────────────────────────────────────
  // Reset Pagination When Search Changes
  // ───────────────────────────────────────────

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);


  // ───────────────────────────────────────────
  // Search Filter
  // ───────────────────────────────────────────

  const filteredContacts = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();

    if (!q) {
      return contacts;
    }

    return contacts.filter((item: any) => {
      return (
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.includes(q)
      );
    });
  }, [contacts, debouncedSearch]);


  // ───────────────────────────────────────────
  // Pagination
  // ───────────────────────────────────────────

  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredContacts.slice(
      start,
      start + itemsPerPage
    );
  }, [filteredContacts, currentPage]);


  // ───────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────

  return (
    <div className="space-y-6 font-sans pb-10">

      {/* ───────────────────────────────────────
          1. Top Header Banner
      ─────────────────────────────────────── */}

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

        </div>
      </div>


      {/* ───────────────────────────────────────
          2. Stat Card
      ─────────────────────────────────────── */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

        {/* Total Enquiries */}

        <div className="bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-indigo-50/60 rounded-2xl p-5 border border-blue-200/80 shadow-2xs">

          <div className="flex items-start justify-between">

            <span className="text-xs font-bold text-blue-900">
              Total Enquiries
            </span>

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <MessageSquare size={18} />
            </div>

          </div>

          <div className="mt-3">

            <div className="text-3xl font-black text-blue-950">
              {totalContacts}
            </div>

            <p className="text-[11px] text-blue-600 font-semibold mt-1">
              Total leads received
            </p>

          </div>

        </div>


        {/* Information Card */}

        <div className="bg-gradient-to-br from-slate-50 via-white to-sky-50 rounded-2xl p-5 border border-slate-200/80 shadow-2xs">

          <div className="flex items-start justify-between">

            <span className="text-xs font-bold text-slate-800">
              Current Records
            </span>

            <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-md">
              <MessageSquare size={18} />
            </div>

          </div>

          <div className="mt-3">

            <div className="text-3xl font-black text-slate-900">
              {contacts.length}
            </div>

            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Records loaded
            </p>

          </div>

        </div>


        {/* Search Result Card */}

        <div className="bg-gradient-to-br from-cyan-50 via-white to-blue-50 rounded-2xl p-5 border border-cyan-200/80 shadow-2xs">

          <div className="flex items-start justify-between">

            <span className="text-xs font-bold text-cyan-900">
              Search Results
            </span>

            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25">
              <Search size={18} />
            </div>

          </div>

          <div className="mt-3">

            <div className="text-3xl font-black text-cyan-950">
              {filteredContacts.length}
            </div>

            <p className="text-[11px] text-cyan-600 font-semibold mt-1">
              Matching enquiries
            </p>

          </div>

        </div>

      </div>


      {/* ───────────────────────────────────────
          3. Search Bar
      ─────────────────────────────────────── */}

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">

        <div className="relative flex-1 min-w-[260px]">

          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />

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

      </div>


      {/* ───────────────────────────────────────
          4. Inquiries Table
      ─────────────────────────────────────── */}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">

        {isLoading ? (

          <div className="p-20 flex flex-col items-center justify-center gap-3">

            <Loader />

            <p className="text-xs sm:text-sm font-semibold text-slate-400 animate-pulse">
              Loading inquiries...
            </p>

          </div>

        ) : filteredContacts.length === 0 ? (

          <div className="py-20 px-6 flex flex-col items-center justify-center text-center gap-3">

            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center shadow-md">
              <MessageSquare size={28} />
            </div>

            <h3 className="text-base font-extrabold text-[#051B30]">
              No inquiries found
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              {searchQuery
                ? 'No inquiries match your current search.'
                : 'Customer inquiries submitted via the Contact Us form will appear here.'}
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border-b border-slate-200/90 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">

                  <th className="px-6 py-4 w-60">
                    Customer
                  </th>

                  <th className="px-6 py-4 w-44">
                    Service
                  </th>

                  <th className="px-6 py-4">
                    Inquiry Message
                  </th>

                  <th className="px-6 py-4 w-36">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right w-28">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {paginatedContacts.map((contact: any) => {

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

                      {/* Customer Info */}

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

                              <Phone
                                size={11}
                                className="text-slate-400 shrink-0"
                              />

                              <span>
                                {contact.phone}
                              </span>

                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Service */}

                      <td className="px-6 py-4 align-middle">

                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getServiceBadge(
                            contact.service
                          )}`}
                        >
                          {contact.service || 'General Inquiry'}
                        </span>

                      </td>


                      {/* Message */}

                      <td className="px-6 py-4 align-middle max-w-xs">

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {contact.message}
                        </p>

                      </td>


                      {/* Date */}

                      <td className="px-6 py-4 align-middle">

                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">

                          <Calendar size={12} />

                          {contact.createdAt
                            ? new Date(
                                contact.createdAt
                              ).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}

                        </span>

                      </td>


                      {/* Actions */}

                      <td
                        className="px-6 py-4 align-middle text-right"
                        onClick={(e) => e.stopPropagation()}
                      >

                        <div className="flex items-center justify-end gap-1.5">

                          {/* Call */}

                          {contact.phone && (
                            <a
                              href={`tel:${contact.phone}`}
                              title="Call Phone"
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl border border-blue-200 transition-colors"
                            >
                              <Phone size={14} />
                            </a>
                          )}


                          {/* WhatsApp */}

                          {contact.phone && (
                            <a
                              href={`https://wa.me/91${contact.phone}?text=Hello%20${encodeURIComponent(
                                contact.name || ''
                              )},%20regarding%20your%20inquiry%20with%20Perfect%20Air%20Solution:`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl border border-emerald-200 transition-colors"
                            >
                              <MessageCircle size={14} />
                            </a>
                          )}

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}


        {/* ─────────────────────────────────────
            Pagination
        ───────────────────────────────────── */}

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


      {/* ───────────────────────────────────────
          5. Inquiry Details Modal
      ─────────────────────────────────────── */}

      <Dialog
        open={!!selectedInquiry}
        onOpenChange={() => setSelectedInquiry(null)}
      >

        {selectedInquiry && (

          <DialogContent className="sm:max-w-lg rounded-2xl p-6 bg-white shadow-2xl">

            <DialogHeader>

              <DialogTitle className="text-xl font-extrabold text-[#051B30]">

                Inquiry Details

              </DialogTitle>

            </DialogHeader>


            <div className="space-y-4 mt-2">

              {/* Customer */}

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

                  <h4 className="font-extrabold text-base text-[#051B30]">
                    {selectedInquiry.name}
                  </h4>

                  <p className="text-xs text-slate-500">
                    {selectedInquiry.email}
                  </p>

                  <p className="text-xs font-bold text-[#0284C7] mt-0.5">
                    {selectedInquiry.phone}
                  </p>

                </div>

              </div>


              {/* Service */}

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


              {/* Message */}

              <div>

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Message
                </span>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>

              </div>


              {/* Date */}

              <div>

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Submitted On
                </span>

                <div className="flex items-center gap-2 text-xs text-slate-600">

                  <Calendar size={14} />

                  {selectedInquiry.createdAt
                    ? new Date(
                        selectedInquiry.createdAt
                      ).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}

                </div>

              </div>


              {/* Actions */}

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">

                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >

                    <Phone size={15} />

                    <span>
                      Call
                    </span>

                  </a>
                )}


                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/91${selectedInquiry.phone}?text=Hello%20${encodeURIComponent(
                      selectedInquiry.name || ''
                    )},%20regarding%20your%20inquiry%20with%20Perfect%20Air%20Solution:`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >

                    <MessageCircle size={15} />

                    <span>
                      WhatsApp
                    </span>

                  </a>
                )}

              </div>

            </div>

          </DialogContent>

        )}

      </Dialog>

    </div>
  );
};

export default AdminContact;