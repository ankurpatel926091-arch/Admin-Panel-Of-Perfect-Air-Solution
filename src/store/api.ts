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
      queryFn: () => ({ data: staticBlogs }),
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
      queryFn: (id) => ({ data: { message: `Deleted ${id}` } }),
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
      queryFn: () => ({ data: { token: "static-admin-token", user: "Admin" } }),
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

// Mock REST helpers for admin modals so admin actions work locally without error
export const addBlogREST = async (..._args: any[]) => ({ message: "Success" });
export const updateBlogREST = async (..._args: any[]) => ({ message: "Success" });
export const buildBlogFormData = (..._args: any[]) => new FormData();

export const addBrandREST = async (..._args: any[]) => ({ message: "Success" });
export const updateBrandREST = async (..._args: any[]) => ({ message: "Success" });

export const addServiceREST = async (..._args: any[]) => ({ message: "Success" });
export const updateServiceREST = async (..._args: any[]) => ({ message: "Success" });
export const buildServiceFormData = (..._args: any[]) => new FormData();

export const addProjectREST = async (..._args: any[]) => ({ message: "Success" });
export const updateProjectREST = async (..._args: any[]) => ({ message: "Success" });
export const buildProjectFormData = (..._args: any[]) => new FormData();

