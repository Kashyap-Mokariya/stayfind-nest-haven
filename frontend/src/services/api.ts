
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase.auth.token');
  if (token) {
    const parsedToken = JSON.parse(token);
    config.headers.Authorization = `Bearer ${parsedToken.access_token}`;
  }
  return config;
});

export default api;

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; fullName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Listings API
export const listingsAPI = {
  getListings: (params?: any) => api.get('/listings', { params }),
  getListingById: (id: string) => api.get(`/listings/${id}`),
  createListing: (data: any) => api.post('/listings', data),
  getPopularListings: () => api.get('/listings/popular'),
};

// Likes API
export const likesAPI = {
  toggleLike: (listingId: string) => api.post(`/likes/listing/${listingId}`),
  getLikeStatus: (listingId: string) => api.get(`/likes/listing/${listingId}`),
  getUserLikes: () => api.get('/likes/user'),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (data: any) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings'),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
};

// Users API
export const usersAPI = {
  updateProfile: (data: any) => api.put('/users/profile', data),
  toggleHostStatus: () => api.patch('/users/host-status'),
};
