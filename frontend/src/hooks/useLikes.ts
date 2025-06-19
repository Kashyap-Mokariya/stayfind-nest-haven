
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { likesAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export function useListingLike(listingId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['listing-like', listingId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const response = await likesAPI.getLikeStatus(listingId);
      return response.data.liked;
    },
    enabled: !!user && !!listingId,
  });
}

export function useToggleLike(listingId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in to like listings');
      const response = await likesAPI.toggleLike(listingId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing-like', listingId] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['popular-listings'] });
    },
  });
}

export function usePopularListings() {
  return useQuery({
    queryKey: ['popular-listings'],
    queryFn: async () => {
      const response = await likesAPI.getPopularListings();
      return response.data;
    },
  });
}
