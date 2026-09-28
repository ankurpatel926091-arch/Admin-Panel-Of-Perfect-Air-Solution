import baseApi from "./baseApi";

// Get all brands
export const getBrands = async () => {
  const response = await baseApi.get("/brand/get");
  return response.data;
};

// Get active brands
export const getActiveBrands = async () => {
  const response = await baseApi.get("/brand/active");
  return response.data;
};

// Create brand
export const createBrand = async (formData) => {
  const response = await baseApi.post("/brand/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update brand
export const updateBrand = async (id, formData) => {
  const response = await baseApi.put(`/brand/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete brand
export const deleteBrand = async (id) => {
  const response = await baseApi.delete(`/brand/${id}`);
  return response.data;
};

// Toggle status
export const toggleBrandStatus = async (id) => {
  const response = await baseApi.patch(`/brand/status/${id}`);
  return response.data;
};
