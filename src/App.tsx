import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Context & Layout
import { AuthProvider } from "./context/AdminAuthContext";
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogs from "./pages/AdminBlogs";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminServices from "./pages/AdminServices";
import AdminBrands from "./pages/AdminBrands";
import AdminGallery from "./pages/AdminGallery";
import AdminGalleryCategory from "./pages/AdminGalleryCategory";
import AdminContact from "./pages/AdminContact";
import AdminBookings from "./pages/AdminBookings";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Login */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/" element={<AdminLogin />} />

            {/* Admin Dashboard & Management Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/create" element={<AdminBlogEditor />} />
              <Route path="blogs/new" element={<Navigate to="/admin/blogs/create" replace />} />
              <Route path="blogs/edit/:id" element={<AdminBlogEditor />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="gallery-categories" element={<AdminGalleryCategory />} />
              <Route path="galleryCategory" element={<Navigate to="/admin/gallery-categories" replace />} />
              <Route path="contacts" element={<AdminContact />} />
              <Route path="contact" element={<Navigate to="/admin/contacts" replace />} />
              <Route path="bookings" element={<AdminBookings />} />
            </Route>

            {/* Root redirect to /admin */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
