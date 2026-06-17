import api from './api';

/* ────────────────────────────────────────────────────────────
   Generic helper for simple CRUD resources (courses, centers, etc.)
   ──────────────────────────────────────────────────────────── */
const crud = (resource) => ({
  getAll: async (params = {}) => (await api.get(`/${resource}`, { params })).data,
  getAllAdmin: async (params = {}) => (await api.get(`/${resource}/admin/all`, { params })).data,
  getOne: async (id) => (await api.get(`/${resource}/${id}`)).data,
  create: async (payload, config = {}) => (await api.post(`/${resource}`, payload, config)).data,
  update: async (id, payload, config = {}) => (await api.put(`/${resource}/${id}`, payload, config)).data,
  remove: async (id) => (await api.delete(`/${resource}/${id}`)).data,
});

/* ────────────────────────────────────────────────────────────
   Notices
   ──────────────────────────────────────────────────────────── */
export const noticeService = {
  ...crud('notices'),
};

/* ────────────────────────────────────────────────────────────
   Hero Slides (multipart for image upload)
   ──────────────────────────────────────────────────────────── */
export const slideService = {
  getAll: async () => (await api.get('/slides')).data,
  getAllAdmin: async () => (await api.get('/slides/admin/all')).data,

  create: async (formData) => (await api.post('/slides', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data,

  update: async (id, formData) => (await api.put(`/slides/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data,

  reorder: async (order) => (await api.put('/slides/reorder', { order })).data,

  remove: async (id) => (await api.delete(`/slides/${id}`)).data,
};

/* ────────────────────────────────────────────────────────────
   Courses
   ──────────────────────────────────────────────────────────── */
export const courseService = {
  ...crud('courses'),
  getCategories: async () => (await api.get('/courses/categories')).data,
};

/* ────────────────────────────────────────────────────────────
   Universities (multipart for logo upload)
   ──────────────────────────────────────────────────────────── */
export const universityService = {
  getAll: async () => (await api.get('/universities')).data,
  getAllAdmin: async () => (await api.get('/universities/admin/all')).data,

  create: async (formData) => (await api.post('/universities', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data,

  update: async (id, formData) => (await api.put(`/universities/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data,

  remove: async (id) => (await api.delete(`/universities/${id}`)).data,
};

/* ────────────────────────────────────────────────────────────
   Centers
   ──────────────────────────────────────────────────────────── */
export const centerService = {
  ...crud('centers'),
};

/* ────────────────────────────────────────────────────────────
   Gallery (multipart, multi-file)
   ──────────────────────────────────────────────────────────── */
export const galleryService = {
  getAll: async (params = {}) => (await api.get('/gallery', { params })).data,
  getCategories: async () => (await api.get('/gallery/categories')).data,

  upload: async (formData) => (await api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data,

  update: async (id, payload) => (await api.put(`/gallery/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/gallery/${id}`)).data,
  bulkDelete: async (ids) => (await api.post('/gallery/bulk-delete', { ids })).data,
};

/* ────────────────────────────────────────────────────────────
   Enquiries
   ──────────────────────────────────────────────────────────── */
export const enquiryService = {
  submit: async (payload) => (await api.post('/enquiries', payload)).data,
  getAll: async (params = {}) => (await api.get('/enquiries', { params })).data,
  getOne: async (id) => (await api.get(`/enquiries/${id}`)).data,
  update: async (id, payload) => (await api.put(`/enquiries/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/enquiries/${id}`)).data,
  exportCsvUrl: () => '/api/enquiries/export/csv',
};

/* ────────────────────────────────────────────────────────────
   Users (admin management)
   ──────────────────────────────────────────────────────────── */
export const userService = {
  getAll: async () => (await api.get('/users')).data,
  create: async (payload) => (await api.post('/users', payload)).data,
  update: async (id, payload) => (await api.put(`/users/${id}`, payload)).data,
  resetPassword: async (id, newPassword) => (await api.put(`/users/${id}/reset-password`, { newPassword })).data,
  remove: async (id) => (await api.delete(`/users/${id}`)).data,
};

/* ────────────────────────────────────────────────────────────
   Site Settings (multipart for logo)
   ──────────────────────────────────────────────────────────── */
export const settingsService = {
  get: async () => (await api.get('/settings')).data,
  update: async (formData) => (await api.put('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })).data,
};
