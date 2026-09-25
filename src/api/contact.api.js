import baseApi from "./baseApi";

export const createContact = async (data) => {
  const response = await baseApi.post("/contact/send", data);
  return response.data;
};

export const getContacts = async () => {
  const response = await baseApi.get("/contact/get");
  return response.data;
};