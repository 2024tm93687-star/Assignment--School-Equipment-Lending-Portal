export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${tokenType} ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    try {
      const errBody = await response.json();
      const message = errBody?.message || errBody?.error || `HTTP error! status: ${response.status}`;
      throw new Error(message);
    } catch (_) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return response.json();
};
