
import axios from 'axios';
import { supabase } from '@/config/supabase';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with interceptors for auth
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const listingsAPI = {
  getListings: (filters?: any) => api.get('/listings', { params: filters }),
  getListingById: (id: string) => api.get(`/listings/${id}`),
  createListing: (listingData: any) => api.post('/listings', listingData),
  updateListing: (id: string, listingData: any) => api.put(`/listings/${id}`, listingData),
  deleteListing: (id: string) => api.delete(`/listings/${id}`),
  getPopularListings: () => api.get('/listings/popular'),
};

export const likesAPI = {
  getLikeStatus: (listingId: string) => api.get(`/likes/${listingId}/status`),
  toggleLike: (listingId: string) => api.post(`/likes/${listingId}/toggle`),
  getPopularListings: () => api.get('/likes/popular'),
};

export const bookingsAPI = {
  createBooking: (bookingData: any) => api.post('/bookings', bookingData),
  getBookings: () => api.get('/bookings'),
  getBookingById: (id: string) => api.get(`/bookings/${id}`),
  updateBooking: (id: string, bookingData: any) => api.put(`/bookings/${id}`, bookingData),
  cancelBooking: (id: string) => api.delete(`/bookings/${id}`),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData: any) => api.put('/users/profile', profileData),
  getBookings: () => api.get('/users/bookings'),
  getLikedListings: () => api.get('/users/liked-listings'),
};
