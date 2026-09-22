import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Images,
  Tag,
  MessageSquare,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  useGetBlogsQuery,
  useGetGalleryQuery,
  useGetBrandsQuery,
  useGetContactsQuery,
} from "@/store/api";

/* ─── Skeleton Loading Badge ─────────────────────────────────── */
const CountBadge = ({ loading, count }: { loading: boolean; count: number }) =>
  loading ? (
    <span className="inline-block w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
  ) : (
    <span>{count}</span>
  );

/* ─── Reference Style Stat Card ──────────────────────────────── */
interface StatCardItem {
  title: string;
  count: number;
  loading: boolean;
  subtext: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  path: string;
}

const ReferenceStatCard: React.FC<StatCardItem> = ({
  title,
  count,
  loading,
  subtext,
  icon: Icon,
  iconBg,
  iconColor,
  path,
}) => (
  <Link
    to={path}
    className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between cursor-pointer"
  >
    {/* Top Row: Title on Left, Icon in soft rounded square on Right */}
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs sm:text-sm font-semibold text-slate-500 leading-tight">
        {title}
      </span>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconBg} ${iconColor}`}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>
    </div>

    {/* Middle / Bottom: Big Bold Number & Subtext */}
    <div className="mt-3">
      <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans leading-none">
        <CountBadge loading={loading} count={count} />
      </div>
      <p className="text-xs text-slate-400 font-medium mt-2 flex items-center justify-between">
        <span>{subtext}</span>
        <ArrowRight
          size={13}
          className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#0284C7]"
        />
      </p>
    </div>
  </Link>
);

/* ─── Main Admin Dashboard Component ─────────────────────────── */
const AdminDashboard = () => {
  const { data: blogs = [], isLoading: blogsLoading } = useGetBlogsQuery();
  const { data: gallery = [], isLoading: galleryLoading } = useGetGalleryQuery();
  const { data: brands = [], isLoading: brandsLoading } = useGetBrandsQuery();
  const { data: contacts = [], isLoading: contactsLoading } = useGetContactsQuery();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const stats: StatCardItem[] = [
    {
      title: "Today's Blog Posts",
      count: blogs.length,
      loading: blogsLoading,
      subtext: "Published articles",
      icon: FileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      path: "/admin/blogs",
    },
    {
      title: "Gallery",
      count: gallery.length,
      loading: galleryLoading,
      subtext: "Showcase photos",
      icon: Images,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      path: "/admin/gallery",
    },
    {
      title: "Brands",
      count: brands.length,
      loading: brandsLoading,
      subtext: "Authorized manufacturers",
      icon: Tag,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      path: "/admin/brands",
    },
    {
      title: "Contact",
      count: contacts.length,
      loading: contactsLoading,
      subtext: "Inquiries received",
      icon: MessageSquare,
      iconBg: "bg-cyan-50",
      iconColor: "text-[#0284C7]",
      path: "/admin/contact",
    },
  ];

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* ── 1. Welcome Banner Card (Matching Reference Image 1) ── */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#051B30] via-[#08335C] to-[#0D508D] text-white p-7 sm:p-8 shadow-sm overflow-hidden">
        {/* Subtle Watermark Silhouette Outline on Right (matching reference photo) */}
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-white/[0.04] pointer-events-none">
          <Layers size={220} strokeWidth={1.2} />
        </div>

        <div className="relative z-10 flex items-start sm:items-center gap-5">
          {/* Rounded Icon Badge Container */}
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
            <ShieldCheck size={28} />
          </div>

          <div>
          
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Welcome back, Administrator</span>
              
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-normal max-w-xl">
              Here's your website content, product catalog, and customer inquiry overview for today.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Section Header & Today Date Widget (Matching Reference Image 1) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <h2 className="text-2xl font-extrabold text-[#051B30] tracking-tight">
            HVAC Admin Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of today's content status and customer inquiries
          </p>
        </div>

        {/* Date Box Widget (matching reference photo) */}
        <div className="self-start sm:self-auto flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div className="text-left leading-tight pr-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Today
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-800">
              {getFormattedDate()}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Stat Cards Row (4 Columns matching Reference Image 1) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s, i) => (
          <ReferenceStatCard key={i} {...s} />
        ))}
      </div>

      {/* ── 4. Lower Two-Column Section (Matching Reference Image 1) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
        {/* Left Column (Main Section - Matching "Current Patient" in Reference) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#051B30] tracking-tight">
                    Recent Customer Inquiries
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Latest messages received from website
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100">
                Live Queue
              </span>
            </div>

            {/* Inquiries List */}
            {contactsLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2].map((n) => (
                  <div key={n} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No recent inquiries received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.slice(0, 3).map((b: any, index: number) => (
                  <div
                    key={b._id || index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {b.name || "Customer Lead"}
                          </h4>
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md">
                            {b.service || "General Inquiry"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                          {b.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} /> {b.phone}
                            </span>
                          )}
                          {b.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} /> {b.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs shrink-0">
                      <span className="text-slate-400 font-medium text-[11px] block">
                        {b.createdAt && !isNaN(new Date(b.createdAt).getTime())
                          ? new Date(b.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : b.createdAt || "Recent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Total {contacts.length} inquiries logged
            </span>
            <Link
              to="/admin/contact"
              className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] inline-flex items-center gap-1"
            >
              <span>View All Inquiries</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right Column (Quick Actions - Matching Reference Image 1) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#051B30] tracking-tight">
                Quick Actions
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Frequently used actions
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/admin/blogs/new"
                className="flex items-center gap-3.5 p-3 rounded-xl bg-blue-50/60 hover:bg-blue-50 border border-blue-100/80 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-blue-900 group-hover:text-blue-700 transition-colors truncate">
                    Today's New Blog Post
                  </p>
                  <p className="text-[11px] text-blue-600/70 font-medium truncate">
                    Write &amp; publish HVAC article
                  </p>
                </div>
                <ArrowUpRight size={14} className="text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/admin/gallery"
                className="flex items-center gap-3.5 p-3 rounded-xl bg-purple-50/60 hover:bg-purple-50 border border-purple-100/80 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Images size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-purple-900 group-hover:text-purple-700 transition-colors truncate">
                    Manage Gallery
                  </p>
                  <p className="text-[11px] text-purple-600/70 font-medium truncate">
                    View &amp; manage installation photos
                  </p>
                </div>
                <ArrowUpRight size={14} className="text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/admin/brands/new"
                className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100/80 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Tag size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors truncate">
                    Upload Partner Brand
                  </p>
                  <p className="text-[11px] text-emerald-600/70 font-medium truncate">
                    Authorized brand logo &amp; dealer tier
                  </p>
                </div>
                <ArrowUpRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 text-center">
            <Link
              to="/admin/contact"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage all active client requests</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
