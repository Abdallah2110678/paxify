// src/services/cartService.js
import api from "./api";

function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await api.post(
    `/api/carts/add/${productId}?quantity=${quantity}`,
    null,
    { headers: authHeaders() }
  );
  return data;
}

export async function getCartByUser() {
  const { data } = await api.get(`/api/carts/by-user`, {
    headers: authHeaders(),
  });
  return data;
}

export async function updateCartItem(cartId, itemId, quantity) {
  const { data } = await api.put(
    `/api/carts/${cartId}/update/${itemId}?quantity=${quantity}`,
    null,
    { headers: authHeaders() }
  );
  return data;
}

export async function removeCartItem(cartId, itemId) {
  const { data } = await api.delete(`/api/carts/${cartId}/remove/${itemId}`, {
    headers: authHeaders(),
  });
  return data;
}

export async function clearCart(cartId) {
  await api.delete(`/api/carts/${cartId}/clear`, {
    headers: authHeaders(),
  });
}
