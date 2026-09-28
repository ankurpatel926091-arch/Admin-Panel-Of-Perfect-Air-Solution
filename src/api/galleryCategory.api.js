import baseApi from "./baseApi";

// Fallback initial categories matching the frontend showcase
export const DEFAULT_GALLERY_CATEGORIES = [
  { _id: "cat_vrf", title: "VRF / VRV Systems", isActive: true, createdAt: new Date().toISOString() },
  { _id: "cat_comm", title: "Commercial HVAC", isActive: true, createdAt: new Date().toISOString() },
  { _id: "cat_res", title: "Residential AC", isActive: true, createdAt: new Date().toISOString() },
  { _id: "cat_duct", title: "Ductable & Cassette", isActive: true, createdAt: new Date().toISOString() },
  { _id: "cat_ahu", title: "AHU & Maintenance", isActive: true, createdAt: new Date().toISOString() },
];

export const getGalleryCategories = async () => {
  try {
    const response = await baseApi.get("/galleryCategory/get");
    return response.data;
  } catch (error) {
    console.warn("Backend getGalleryCategories fallback:", error);
    return {
      galleryCategories: DEFAULT_GALLERY_CATEGORIES,
      total: DEFAULT_GALLERY_CATEGORIES.length,
    };
  }
};

export const createGalleryCategory = async (data) => {
  const response = await baseApi.post("/galleryCategory/create", data);
  return response.data;
};

export const updateGalleryCategory = async (id, data) => {
  const response = await baseApi.put(`/galleryCategory/update/${id}`, data);
  return response.data;
};

export const toggleGalleryCategoryStatus = async (id) => {
  const response = await baseApi.patch(`/galleryCategory/status/${id}`);
  return response.data;
};

export const deleteGalleryCategory = async (id) => {
  const response = await baseApi.delete(`/galleryCategory/delete/${id}`);
  return response.data;
};
