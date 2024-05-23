import axios from "axios";
import useTokenStore from "@/store";

const api = axios.create({
  // todo: move this value to env variable.
  baseURL: import.meta.env.VITE_APP_BACKEND_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data: { email: string; password: string }) =>
  api.post("/api/users/login", data);

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/api/users/register", data);

export const getProducts = async () => api.get("/api/products");
export const getCategories = async () => api.get("/api/categories");
export const getOrders = async () => api.get("/api/orders");
export const getProductById = async (productId: string | undefined) =>
  api.get(`/api/products/${productId}`);
export const searchProducts = async (productId: string | undefined) =>
  api.get(`/api/products/search?${productId}`);
export const getCategoryById = async (categoryId: string | undefined) =>
  api.get(`/api/categories/${categoryId}`);

export const createProduct = async (data: FormData) =>
  api.post("/api/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const createCategory = async (data: FormData) =>
  api.post("/api/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editProduct = async (
  id: string | undefined,
  data: FormData | undefined
) =>
  api.patch(`/api/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editCategory = async (
  id: string | undefined,
  data: FormData | undefined
) =>
  api.patch(`/api/categories/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteCategory = async (id: string | undefined) =>
  api.delete(`/api/categories/${id}`);
export const deleteOrder = async (id: string | undefined) =>
  api.delete(`/api/orders/${id}`);
export const deleteProduct = async (id: string | undefined) =>
  api.delete(`/api/products/${id}`);
