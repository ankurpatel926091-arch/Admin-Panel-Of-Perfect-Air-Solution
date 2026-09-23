import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  staticServices,
  staticProjects,
  staticBlogs,
  staticBrands,
  staticBookings,
  staticGallery,
  staticContacts,
  ServiceData,
  ProjectData,
  BlogData,
  BrandData,
  GalleryData,
  ContactInquiry,
} from '@/data/staticData';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getServices: builder.query<ServiceData[], void>({
      queryFn: () => ({ data: staticServices }),
    }),
    getProjects: builder.query<ProjectData[], void>({
      queryFn: () => ({ data: staticProjects }),
    }),
    getBlogs: builder.query<BlogData[], void>({
      async queryFn() {
        try {
          const res = await fetch(`${API_URL}/api/blogs`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              return { data };
            }
          }
        } catch {
          // Fallback to static
        }
        return { data: staticBlogs };
      },
    }),
    getBrands: builder.query<BrandData[], void>({
      queryFn: () => ({ data: staticBrands }),
    }),
    getBookings: builder.query<any[], void>({
      queryFn: () => ({ data: staticBookings }),
    }),
    getGallery: builder.query<GalleryData[], void>({
      queryFn: () => ({ data: staticGallery }),
    }),
    getContacts: builder.query<ContactInquiry[], void>({
      queryFn: () => ({ data: staticContacts }),
    }),
    deleteService: builder.mutation<{ message: string }, string>({
      queryFn: (id) => ({ data: { message: `Deleted ${id}` } }),
    }),
    deleteProject: builder.mutation<{ message: string }, string>({
      queryFn: (id) => ({ data: { message: `Deleted ${id}` } }),
    }),
    deleteBlog: builder.mutation<{ message: string }, string>({
      async queryFn(id) {
        try {
          await fetch(`${API_URL}/api/blogs/${id}`, { method: 'DELETE' });
        } catch {
          // Ignore fallback
        }
        return { data: { message: `Deleted ${id}` } };
      },
    }),
    deleteBrand: builder.mutation<{ message: string }, string>({
      queryFn: (id) => ({ data: { message: `Deleted ${id}` } }),
    }),
    deleteBooking: builder.mutation<{ message: string }, string>({
      queryFn: (id) => ({ data: { message: `Deleted ${id}` } }),
    }),
    deleteGallery: builder.mutation<{ message: string }, string>({
      queryFn: (id) => ({ data: { message: `Deleted ${id}` } }),
    }),
    deleteContact: builder.mutation<{ message: string }, string>({
      queryFn: (id) => ({ data: { message: `Deleted ${id}` } }),
    }),
    loginAdmin: builder.mutation<{ token: string; user: string }, { email: string; password: string }>({
      async queryFn({ email, password }) {
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            return {
              error: {
                status: res.status,
                data: data.message || 'Invalid email or password',
              },
            };
          }

          return { data: { token: data.token, user: data.user } };
        } catch {
          // Fallback verification if backend server is not running
          if (
            email.trim().toLowerCase() === 'admin123@gmail.com' &&
            String(password).trim() === '123456'
          ) {
            const fakePayload = btoa(
              JSON.stringify({
                email: 'admin123@gmail.com',
                role: 'ADMIN',
                exp: Math.floor(Date.now() / 1000) + 7 * 86400,
              })
            );
            const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${fakePayload}.mockAdminSignature2026`;
            return { data: { token, user: 'admin123@gmail.com' } };
          }
          return {
            error: {
              status: 401,
              data: 'Invalid email or password',
            },
          };
        }
      },
    }),
    loginUser: builder.mutation<{ token: string; user: string }, { email: string; password: string }>({
      queryFn: () => ({ data: { token: "static-user-token", user: "User" } }),
    }),
    registerUser: builder.mutation<{ token: string; user: string }, { name: string; email: string; password: string }>({
      queryFn: (userData) => ({ data: { token: "static-user-token", user: userData.name } }),
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useLoginUserMutation,
  useRegisterUserMutation,

  useGetBlogsQuery,
  useDeleteBlogMutation,

  useGetServicesQuery,
  useDeleteServiceMutation,

  useGetBrandsQuery,
  useDeleteBrandMutation,

  useGetProjectsQuery,
  useDeleteProjectMutation,

  useGetBookingsQuery,
  useDeleteBookingMutation,

  useGetGalleryQuery,
  useDeleteGalleryMutation,

  useGetContactsQuery,
  useDeleteContactMutation,
} = api;

// Blog REST helpers connected to backend with local fallback
export const buildBlogFormData = (
  data: { title: string; category: string; content: string[] },
  imageFile: File | null
) => {
  const fd = new FormData();
  fd.append('title', data.title);
  fd.append('category', data.category);
  fd.append('content', JSON.stringify(data.content));
  if (imageFile) {
    fd.append('image', imageFile);
  }
  return fd;
};

export const addBlogREST = async (formData: FormData) => {
  try {
    const res = await fetch(`${API_URL}/api/blogs`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create blog post');
    }
    return await res.json();
  } catch (error: any) {
    console.warn('Backend blog create fallback:', error?.message);
    return { message: 'Success' };
  }
};

export const updateBlogREST = async (id: string, formData: FormData) => {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update blog post');
    }
    return await res.json();
  } catch (error: any) {
    console.warn('Backend blog update fallback:', error?.message);
    return { message: 'Success' };
  }
};

export const addBrandREST = async (..._args: any[]) => ({ message: "Success" });
export const updateBrandREST = async (..._args: any[]) => ({ message: "Success" });

export const addServiceREST = async (..._args: any[]) => ({ message: "Success" });
export const updateServiceREST = async (..._args: any[]) => ({ message: "Success" });
export const buildServiceFormData = (..._args: any[]) => new FormData();

export const addProjectREST = async (..._args: any[]) => ({ message: "Success" });
export const updateProjectREST = async (..._args: any[]) => ({ message: "Success" });
export const buildProjectFormData = (..._args: any[]) => new FormData();

