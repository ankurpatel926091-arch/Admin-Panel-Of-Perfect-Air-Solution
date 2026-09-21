import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Admin Context & Layout
import { AuthProvider } from "./context/AdminAuthContext";
import AdminLayout from "./layouts/AdminLayout";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlogs from "./pages/AdminBlogs";
import AdminServices from "./pages/AdminServices";
import AdminBrands from "./pages/AdminBrands";
import AdminGallery from "./pages/AdminGallery";
import AdminContact from "./pages/AdminContact";
import AdminBookings from "./pages/AdminBookings";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ToastContainer position="top-right" autoClose={3000} />

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
              <Route path="services" element={<AdminServices />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="gallery" element={<AdminGallery />} />
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
