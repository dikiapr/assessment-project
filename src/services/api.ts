const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Generic fetch function
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Save token to localStorage
    if (data.data.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  register: async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, confirmPassword }),
    });

    // Save token to localStorage
    if (data.data.token) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    return await apiFetch("/products");
  },

  getById: async (id: number) => {
    return await apiFetch(`/products/${id}`);
  },

  create: async (data: { name: string; price: number; stock: number }) => {
    return await apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: { name: string; price: number; stock: number },
  ) => {
    return await apiFetch(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return await apiFetch(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async () => {
    return await apiFetch("/transactions");
  },

  getById: async (id: number) => {
    return await apiFetch(`/transactions/${id}`);
  },

  create: async (items: { productId: number; qty: number }[]) => {
    return await apiFetch("/transactions", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },
};

// Reports API
export const reportsAPI = {
  get: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString();
    return await apiFetch(`/reports${query ? `?${query}` : ""}`);
  },

  exportPDF: async (startDate?: string, endDate?: string) => {
    const token = getToken();
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString();
    const response = await fetch(
      `${API_BASE_URL}/reports/export/pdf${query ? `?${query}` : ""}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Gagal export PDF");
    }

    // Get filename from header
    const contentDisposition = response.headers.get("Content-Disposition");
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/"/g, "")
      : `Laporan_Penjualan_${new Date().getTime()}.pdf`;

    // Download file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  exportExcel: async (startDate?: string, endDate?: string) => {
    const token = getToken();
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const query = params.toString();
    const response = await fetch(
      `${API_BASE_URL}/reports/export/excel${query ? `?${query}` : ""}`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Gagal export Excel");
    }

    // Get filename from header
    const contentDisposition = response.headers.get("Content-Disposition");
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/"/g, "")
      : `Laporan_Penjualan_${new Date().getTime()}.xlsx`;

    // Download file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    return await apiFetch("/users");
  },
};
