
import { useQuery } from '@tanstack/react-query';
import { listingsAPI } from '@/services/api';

export interface Listing {
  id: string;
  title: string;
  description: string;
  listing_type: string;
  price_per_night: number;
  location: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  host_id: string;
  is_active: boolean;
  rating?: number;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
}

export function useListings(filters?: any) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const response = await listingsAPI.getListings(filters);
      return response.data.listings as Listing[];
    },
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const response = await listingsAPI.getListingById(id);
      return response.data as Listing;
    },
    enabled: !!id,
  });
}

export function usePopularListings() {
  return useQuery({
    queryKey: ['popular-listings'],
    queryFn: async () => {
      const response = await listingsAPI.getPopularListings();
      return response.data as Listing[];
    },
  });
}
