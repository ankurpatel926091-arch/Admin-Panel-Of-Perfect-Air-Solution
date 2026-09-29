import baseApi from "./baseApi";

export const getGalleryAPI = async (params = {}) => {
  const response = await baseApi.get("/gallery/get", {
    params,
  });

  return response.data;
};

export const createGalleryAPI = async (formData) => {
  const response = await baseApi.post("/gallery/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateGalleryAPI = async (id, formData) => {
  const response = await baseApi.put(`/gallery/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteGalleryAPI = async (id) => {
  const response = await baseApi.delete(`/gallery/delete/${id}`);
  return response.data;
};

export const toggleGalleryStatusAPI = async (id) => {
  const response = await baseApi.patch(`/gallery/status/${id}`);
  return response.data;
};
