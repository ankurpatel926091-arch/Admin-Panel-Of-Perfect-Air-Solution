import baseApi from "./baseApi";

export const getBlogsAPI = async () => {
  const response = await baseApi.get("/blogs/get");
  return response.data;
};

export const getBlogByIdAPI = async (id) => {
  const response = await baseApi.get(`/blogs/${id}`);
  return response.data;
};

export const createBlogAPI = async (formData) => {
  const response = await baseApi.post("/blogs/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateBlogAPI = async (id, formData) => {
  const response = await baseApi.put(`/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBlogAPI = async (id) => {
  const response = await baseApi.delete(`/blogs/${id}`);
  return response.data;
};
