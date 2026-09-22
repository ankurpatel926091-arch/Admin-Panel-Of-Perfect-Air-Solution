import { Outlet, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import perfectAirLogo from "../assets/Perfect Air Logo.png";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Tags,
  LogOut,
  CalendarClock,
  Sparkles,
  Globe,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Images,
  MessageSquare,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-sm text-slate-500">
        Redirecting...
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Blogs", path: "/admin/blogs", icon: FileText },
    // { label: "Services", path: "/admin/services", icon: Briefcase },
    { label: "Brands", path: "/admin/brands", icon: Tags },
    { label: "Gallery", path: "/admin/gallery", icon: Images },
    { label: "Contact", path: "/admin/contacts", icon: MessageSquare },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* ── Mobile Sidebar Overlay Backdrop ── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#051B30] text-slate-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-4 border-b border-[#0D2D4E] bg-[#051B30] flex items-center justify-between shrink-0">
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center flex-1 pr-3"
          >
            <div className="bg-white rounded-xl py-1.5 px-3 shadow-md border border-white/20 flex items-center justify-center">
              <img
                src={perfectAirLogo}
                alt="Perfect Air Solution Logo"
                className="h-11 w-auto max-w-[170px] object-contain"
              />
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close Navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold border transition-colors duration-150 ${
                    isActive
                      ? "bg-[#0284C7] text-white border-sky-400/40 shadow-sm shadow-sky-950/40"
                      : "border-transparent text-slate-300 hover:text-white hover:bg-white/[0.08]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors duration-150 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-300"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-sm shadow-cyan-300 shrink-0" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Sidebar Footer Logout Button */}
        <div className="p-3.5 border-t border-white/[0.08] bg-[#031322]/60">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
              navigate("/admin/login");
            }}
            className="w-full flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-rose-400 hover:bg-rose-500/15 border border-white/[0.05] hover:border-rose-500/30 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={18} className="text-rose-400 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#051B30] text-slate-200 border-r border-[#0D2D4E] flex-col shrink-0 transition-all duration-300 z-30 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="h-24 sm:h-[96px] px-3.5 border-b border-[#0D2D4E] bg-[#051B30] flex items-center justify-center shrink-0 overflow-hidden">
          <Link to="/admin" className="flex items-center justify-center group w-full py-1">
            {sidebarOpen ? (
              <div className="w-full bg-white rounded-xl py-2 px-3 shadow-md border border-white/20 flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
                <img
                  src={perfectAirLogo}
                  alt="Perfect Air Solution Logo"
                  className="h-14 sm:h-16 w-auto max-w-[210px] object-contain group-hover:scale-105 transition-all duration-300"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md border border-white/20 p-1 group-hover:scale-105 transition-all duration-300">
                <img
                  src={perfectAirLogo}
                  alt="Perfect Air Solution Logo"
                  className="h-8 w-auto max-w-full object-contain"
                />
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {sidebarOpen && (
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
              Navigation
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                title={!sidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors duration-150 ${
                    isActive
                      ? "bg-[#0284C7] text-white border-sky-400/40 shadow-sm shadow-sky-950/40"
                      : "border-transparent text-slate-300 hover:text-white hover:bg-white/[0.08]"
                  } ${!sidebarOpen ? "justify-center" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors duration-150 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-300"
                      }`}
                    />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                    {sidebarOpen && (
                      <span
                        className={`ml-auto w-1.5 h-1.5 rounded-full transition-opacity duration-150 shrink-0 ${
                          isActive
                            ? "bg-cyan-200 shadow-sm shadow-cyan-300 opacity-100"
                            : "opacity-0 pointer-events-none"
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout Button */}
        <div className="p-3 border-t border-white/[0.08] bg-[#031322]/60">
          <button
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-rose-400 hover:bg-rose-500/15 border border-white/[0.05] hover:border-rose-500/30 transition-all duration-200 cursor-pointer ${
              !sidebarOpen ? "justify-center px-2" : ""
            }`}
            title="Logout"
          >
            <LogOut size={18} className="text-rose-400 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* ── Fixed Top Header ── */}
        <header className="h-16 sm:h-20 lg:h-[84px] bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-20 shadow-2xs">
          {/* Left: Hamburger & Greeting */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Open Mobile Menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <h2 className="text-sm sm:text-base lg:text-xl font-extrabold text-[#051B30] tracking-tight truncate flex items-center gap-1.5 sm:gap-2">
                <span className="truncate">{getGreeting()}, Administrator</span>
               
              </h2>
             
            </div>
          </div>

          {/* Right: View Website Link & User Profile Pill */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <a
              href="https://perfect-air-solution.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0284C7] hover:text-[#051B30] bg-sky-50 hover:bg-sky-100 border border-sky-200/80 px-3.5 py-2 sm:py-2.5 rounded-xl transition-all shadow-2xs"
            >
              <Globe size={15} />
              <span>View Website</span>
              <ArrowUpRight size={13} />
            </a>

            {/* Mobile external website icon link */}
            <a
              href="https://perfect-air-solution.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="md:hidden p-2 text-[#0284C7] bg-sky-50 border border-sky-200/80 rounded-xl hover:bg-sky-100 transition-colors"
              title="View Website"
            >
              <Globe size={17} />
            </a>

            <div className="h-7 w-[1px] bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block" />

            {/* Profile Dropdown Chip with Logout menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 sm:gap-3 p-1 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 data-[state=open]:bg-slate-100 select-none"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#051B30] to-[#0284C7] text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-2xs shrink-0">
                    AD
                  </div>
                  <div className="text-left hidden md:block leading-none pr-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-800">Administrator</p>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7] mt-1 block">
                      SUPER ADMIN
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-200/90 bg-white z-50"
              >
                {/* Logout Option */}
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/admin/login");
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                >
                  <LogOut size={16} className="text-rose-500" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* ── Scrollable Main Content ── */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
