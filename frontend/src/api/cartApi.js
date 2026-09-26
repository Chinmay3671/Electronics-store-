import client from './client';

export const cartApi = {
  getCart: () => client.get('/cart'),
  addItem: (productId, quantity = 1) => client.post('/cart/items', { productId, quantity }),
  updateItem: (itemId, quantity) => client.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => client.delete(`/cart/items/${itemId}`),
  clearCart: () => client.delete('/cart'),
};

export const wishlistApi = {
  getWishlist: () => client.get('/wishlist'),
  addItem: (productId) => client.post(`/wishlist/${productId}`),
  removeItem: (productId) => client.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => client.post(`/wishlist/${productId}/move-to-cart`),
};

export const orderApi = {
  createOrder: (data) => client.post('/orders', data),
  getUserOrders: (page = 0, size = 10) => client.get('/orders', { params: { page, size } }),
  getAllUserOrders: () => client.get('/orders/all'),
  getOrderById: (id) => client.get(`/orders/${id}`),
  getOrderByNumber: (orderNumber) => client.get(`/orders/number/${orderNumber}`),
  cancelOrder: (id, reason) => client.post(`/orders/${id}/cancel`, { reason }),
};
