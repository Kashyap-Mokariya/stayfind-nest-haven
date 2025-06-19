
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useListingLike, useToggleLike } from '@/hooks/useLikes';
import { useAuth } from '@/contexts/AuthContext';

interface LikeButtonProps {
  listingId: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LikeButton({ listingId, size = 'md' }: LikeButtonProps) {
  const { user } = useAuth();
  const { data: isLiked, isLoading } = useListingLike(listingId);
  const toggleLike = useToggleLike(listingId);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert("Please log in to like listings");
      return;
    }

    console.log('Toggling like for listing:', listingId, 'Current status:', isLiked);
    toggleLike.mutate();
  };

  if (isLoading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`${sizeClasses[size]} p-0 rounded-full bg-white/90 hover:bg-white shadow-sm`}
        disabled
      >
        <Heart className={`${iconSizeClasses[size]} text-gray-400`} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${sizeClasses[size]} p-0 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all duration-200 hover:scale-110`}
      onClick={handleLike}
      disabled={toggleLike.isPending}
    >
      <Heart 
        className={`${iconSizeClasses[size]} transition-colors ${
          isLiked 
            ? 'fill-red-500 text-red-500' 
            : 'text-gray-600 hover:text-red-500'
        }`} 
      />
    </Button>
  );
}
