import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  updateProfile: (data) =>
    api.put('/users/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDashboard: () => api.get('/users/dashboard'),
};

export const companyAPI = {
  create: (data) =>
    api.post('/companies', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => api.get('/companies/my/company'),
  update: (data) =>
    api.put('/companies/my/company', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
};

export const jobAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getMy: () => api.get('/jobs/my/jobs'),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const applicationAPI = {
  apply: (jobId, data) =>
    api.post(`/applications/jobs/${jobId}/apply`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMy: (params) => api.get('/applications/my', { params }),
  getApplicants: (jobId, params) => api.get(`/applications/jobs/${jobId}/applicants`, { params }),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  getById: (id) => api.get(`/applications/${id}`),
};

export const savedJobAPI = {
  getAll: (params) => api.get('/saved-jobs', { params }),
  save: (jobId) => api.post(`/saved-jobs/${jobId}`),
  remove: (jobId) => api.delete(`/saved-jobs/${jobId}`),
  check: (jobId) => api.get(`/saved-jobs/${jobId}/check`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getApplicationTrends: () => api.get('/admin/analytics/applications'),
  getRecruiterActivity: () => api.get('/admin/analytics/recruiters'),
  getUserGrowth: () => api.get('/admin/analytics/users'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  toggleJobStatus: (id) => api.put(`/admin/jobs/${id}/toggle-status`),
  getCompanies: (params) => api.get('/admin/companies', { params }),
  toggleCompanyStatus: (id) => api.put(`/admin/companies/${id}/toggle-status`),
};
