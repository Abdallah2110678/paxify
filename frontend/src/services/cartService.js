import api from "./api";

// 🛒 Create a cart for a user
export function createCart(userId) {
  return api.post(`/api/carts?userId=${userId}`, null, {
    headers: { ...authHeaders() },
  });
}

// 🛒 Get cart by ID
export async function getCart(cartId) {
  const { data } = await api.get(`/api/carts/${cartId}`, {
    headers: { ...authHeaders() },
  });
  return data;
}

// 🛒 Add product to cart
export function addProductToCart(cartId, productId, quantity) {
  return api.post(
    `/api/carts/${cartId}/add/${productId}?quantity=${quantity}`,
    null,
    { headers: { ...authHeaders() } }
  );
}

// 🛒 Update product quantity in cart
export function updateCartItem(cartId, itemId, quantity) {
  return api.put(
    `/api/carts/${cartId}/update/${itemId}?quantity=${quantity}`,
    null,
    { headers: { ...authHeaders() } }
  );
}

// 🛒 Remove item from cart
export function removeCartItem(cartId, itemId) {
  return api.delete(`/api/carts/${cartId}/remove/${itemId}`, {
    headers: { ...authHeaders() },
  });
}

// 🛒 Clear the cart
export function clearCart(cartId) {
  return api.delete(`/api/carts/${cartId}/clear`, {
    headers: { ...authHeaders() },
  });
}
