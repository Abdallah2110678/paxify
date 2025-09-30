import api from "./api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadProductImage(productId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(
    `/api/products/${productId}/image`,
    formData,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}
// Optional: still keep JSON version
export async function createProduct(payload) {
  const { data } = await api.post("/api/products", payload, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return data;
}

// Other CRUD ops
export async function getProducts() {
  const { data } = await api.get("/api/products", {
    headers: { ...authHeaders() },
  });
  return data;
}

export async function getProductById(id) {
  const { data } = await api.get(`/api/products/${id}`, {
    headers: { ...authHeaders() },
  });
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/api/products/${id}`, payload, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return data;
}

export function deleteProduct(id) {
  return api.delete(`/api/products/${id}`, {
    headers: { ...authHeaders() },
  });
}
