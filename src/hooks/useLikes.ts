
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useListingLike(listingId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['listing-like', listingId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('listing_likes')
        .select('id')
        .eq('listing_id', listingId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!user && !!listingId,
  });
}

export function useToggleLike(listingId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (isLiked: boolean) => {
      if (!user) throw new Error('Must be logged in to like listings');
      
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('listing_likes')
          .delete()
          .eq('listing_id', listingId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('listing_likes')
          .insert({
            listing_id: listingId,
            user_id: user.id,
          });
        
        if (error) throw error;
      }
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
      const { data, error } = await supabase
        .from('listings_with_likes')
        .select('*')
        .order('like_count', { ascending: false })
        .order('rating', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });
}
