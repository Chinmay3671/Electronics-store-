import client from './client';

export const authApi = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  forgotPassword: (data) => client.post('/auth/forgot-password', data),
  resetPassword: (data) => client.post('/auth/reset-password', data),
};

export const userApi = {
  getProfile: () => client.get('/users/me'),
  updateProfile: (data) => client.put('/users/me', data),
  changePassword: (data) => client.put('/users/me/password', data),
};

export const addressApi = {
  getAll: () => client.get('/addresses'),
  getById: (id) => client.get(`/addresses/${id}`),
  create: (data) => client.post('/addresses', data),
  update: (id, data) => client.put(`/addresses/${id}`, data),
  delete: (id) => client.delete(`/addresses/${id}`),
  setDefault: (id) => client.put(`/addresses/${id}/default`),
};
