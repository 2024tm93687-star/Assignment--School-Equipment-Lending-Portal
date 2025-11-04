interface ApiError {
  message?: string;
  error?: string;
  details?: string;
  status?: number;
}

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem("token");
  const tokenType = sessionStorage.getItem("tokenType") || "Bearer";

  // Log request details for debugging
  console.log(`API Request to: ${url}`, {
    method: options.method || "GET",
    hasToken: !!token,
  });

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `${tokenType} ${token}` } : {}),
    ...options.headers,
  };

  try {
    const fullUrl = url.startsWith("http") ? url : url; // URL should be complete from constants
    const response = await fetch(fullUrl, { ...options, headers });

    // Handle 204 No Content early: don't attempt to parse JSON
    if (response.status === 204) {
      return null;
    }

    let data: any;

    // Try to parse JSON response
    try {
      data = await response.json();
    } catch (e) {
      // If body is empty, return null instead of throwing
      const text = await response.text();
      if (!text) {
        data = null;
      } else {
        console.error("Failed to parse JSON response:", e);
        throw new Error(`Invalid response format: ${text}`);
      }
    }

    // Handle non-200 responses
    if (!response.ok) {
      const errorResponse: ApiError = {
        message: data?.message || data?.error,
        error: data?.details,
        status: response.status,
      };

      // Log error details
      console.error("API Error Response:", {
        status: response.status,
        url: fullUrl,
        errorResponse,
      });

      // Specific error handling for different status codes
      switch (response.status) {
        case 401:
          // Clear token on authentication failure
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("tokenType");
          throw new Error("Authentication failed. Please log in again.");
        case 403:
          throw new Error("You do not have permission to perform this action.");
        case 404:
          throw new Error("The requested resource was not found.");
        case 422:
          throw new Error(
            errorResponse.message ||
              "Validation failed. Please check your input."
          );
        default:
          throw new Error(
            errorResponse.message ||
              errorResponse.error ||
              `Request failed with status: ${response.status}`
          );
      }
    }

    return data;
  } catch (error) {
    console.error("API Request Failed:", {
      url,
      method: options.method,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred while making the request");
    }
  }
};
