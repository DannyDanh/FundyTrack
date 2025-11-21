const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = {
  async get(url) {
    const res = await fetch(API_BASE + url, {
      credentials: "include",
    });
    return handleResponse(res);
  },

  async post(url, data) {
    const res = await fetch(API_BASE + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async put(url, data) {
    const res = await fetch(API_BASE + url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async patch(url, data) {
    const res = await fetch(API_BASE + url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async delete(url) {
    const res = await fetch(API_BASE + url, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse(res);
  },
};

async function handleResponse(res) {
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("Request failed:", text);
    throw err;
  }
}
