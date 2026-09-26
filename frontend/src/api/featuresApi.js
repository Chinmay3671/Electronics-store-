import client from './client';

export const reviewApi = {
  getByProduct: (productId) => client.get(`/reviews/product/${productId}`),
  create: (productId, data) => client.post(`/reviews/product/${productId}`, data),
  update: (id, data) => client.put(`/reviews/${id}`, data),
  delete: (id) => client.delete(`/reviews/${id}`),
};

export const couponApi = {
  validate: (code, orderTotal) => client.post('/coupons/validate', { code, orderTotal }),
  getActive: () => client.get('/coupons/active'),
};

export const recommendationApi = {
  getRecommendations: (data) => client.post('/recommendations', data),
};

export const compatibilityApi = {
  check: (data) => client.post('/compatibility/check', data),
};

export const contactApi = {
  submit: (data) => client.post('/contact', data),
};

export const notificationApi = {
  getAll: () => client.get('/notifications'),
  getUnreadCount: () => client.get('/notifications/unread-count'),
  markAsRead: (id) => client.put(`/notifications/${id}/read`),
  markAllAsRead: () => client.put('/notifications/read-all'),
};

export const adminApi = {
  getDashboard: () => client.get('/admin/dashboard'),
  getAnalytics: () => client.get('/admin/analytics'),
  getProducts: (params) => client.get('/admin/products', { params }),
  createProduct: (data) => client.post('/admin/products', data),
  updateProduct: (id, data) => client.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => client.delete(`/admin/products/${id}`),
  updateStock: (id, data) => client.put(`/admin/products/${id}/stock`, data),
  getOrders: (params) => client.get('/admin/orders', { params }),
  getOrderById: (id) => client.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => client.put(`/admin/orders/${id}/status`, data),
  getCustomers: (params) => client.get('/admin/customers', { params }),
  getInventory: (params) => client.get('/admin/inventory', { params }),
  getReviews: (params) => client.get('/admin/reviews', { params }),
  moderateReview: (id, status) => client.put(`/admin/reviews/${id}/moderate`, { status }),
  getMessages: (params) => client.get('/admin/messages', { params }),
  updateMessageStatus: (id, data) => client.put(`/admin/messages/${id}/status`, data),
  deleteMessage: (id) => client.delete(`/admin/messages/${id}`),
  getCoupons: () => client.get('/admin/coupons'),
  createCoupon: (data) => client.post('/admin/coupons', data),
  updateCoupon: (id, data) => client.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => client.delete(`/admin/coupons/${id}`),
};
