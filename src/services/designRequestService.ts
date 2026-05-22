import apiClient from "../api/apiClient";

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

export interface DesignRequest {
  full_name: string;
  phone: string;
  email?: string;
  description: string;
  image?: File;
}

export const designRequestService = {
  /**
   * Submit a custom design request
   */
  submit: async (data: DesignRequest) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("phone", data.phone);
      if (data.email) formData.append("email", data.email);
      formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const response = await apiClient.post("/design-requests", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Failed to submit design request"), {
        cause: err,
      });
    }
  },
};
