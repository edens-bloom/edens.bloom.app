import apiClient from "../api/apiClient";
import type { Product } from "../models/types";

const getErrorMessage = (
  error: unknown,
  fallbackMessage = "An unknown error occurred",
): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    if (maybeError.response?.data?.message)
      return maybeError.response.data.message;
    if (maybeError.message) return maybeError.message;
  }

  return fallbackMessage;
};

export const productService = {
  /**
   * Fetch all products
   */
  fetchAll: async () => {
    try {
      const response = await apiClient.get("/products");
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Failed to fetch products"), {
        cause: err,
      });
    }
  },

  /**
   * Fetch a product by ID
   */
  fetchById: async (id: number) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (err: unknown) {
      throw new Error(
        getErrorMessage(err, `Failed to fetch product with ID ${id}`),
        { cause: err },
      );
    }
  },

  /**
   * Create a new product
   */
  create: async (productData: Product) => {
    try {
      const response = await apiClient.post("/products", productData);
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Failed to create product"), {
        cause: err,
      });
    }
  },

  /**
   * Update an existing product
   */
  update: async (id: number, productData: Partial<Product>) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
      return response.data;
    } catch (err: unknown) {
      throw new Error(
        getErrorMessage(err, `Failed to update product with ID ${id}`),
        { cause: err },
      );
    }
  },

  /**
   * Delete a product
   */
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    } catch (err: unknown) {
      throw new Error(
        getErrorMessage(err, `Failed to delete product with ID ${id}`),
        { cause: err },
      );
    }
  },

  /**
   * Fetch products by category
   */
  fetchByCategory: async (category: string) => {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
    } catch (err: unknown) {
      throw new Error(
        getErrorMessage(
          err,
          `Failed to fetch products for category ${category}`,
        ),
        { cause: err },
      );
    }
  },
};
