// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://commitandconnect.onrender.com/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// Mentor API
export const getMentors = (params) => api.get('/mentors', { params });
export const getMyProfile = () => api.get('/mentors/me');
export const createProfile = (data) => api.post('/mentors', data);
export const updateProfile = (data) => api.put('/mentors/me', data);
export const deleteProfile = () => api.delete('/mentors/me');

// Match API
export const createMatch = (data) => api.post('/matches', data);
export const getMatches = () => api.get('/matches');
export const updateMatchStatus = (id, status) => api.put(`/matches/${id}`, { status });
export const deleteMatch = (id) => api.delete(`/matches/${id}`);
