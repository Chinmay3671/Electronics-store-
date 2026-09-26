import client from './client';

export const productApi = {
  getProducts: (params = {}) => client.get('/products', { params }),
  getProductById: (id) => client.get(`/products/${id}`),
  getProductBySlug: (slug) => client.get(`/products/slug/${slug}`),
  getFeatured: () => client.get('/products/featured'),
  getTrending: () => client.get('/products/trending'),
  getFlashDeals: () => client.get('/products/flash-deals'),
  getNewArrivals: () => client.get('/products/new-arrivals'),
  getSuggestions: (q) => client.get('/products/suggestions', { params: { q } }),
  getCompare: (ids) => client.get('/products/compare', { params: { ids } }),
};

export const categoryApi = {
  getAll: () => client.get('/categories'),
  getById: (id) => client.get(`/categories/${id}`),
  getBySlug: (slug) => client.get(`/categories/slug/${slug}`),
};

export const brandApi = {
  getAll: () => client.get('/brands'),
  getById: (id) => client.get(`/brands/${id}`),
  getBySlug: (slug) => client.get(`/brands/slug/${slug}`),
};
