
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number;
  totalReviews?: number;
  size?: 'sm' | 'md' | 'lg';
  showReviews?: boolean;
}

export default function RatingDisplay({ 
  rating, 
  totalReviews = 0, 
  size = 'sm',
  showReviews = true 
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (rating === 0 && totalReviews === 0) {
    return (
      <div className={`flex items-center text-gray-500 ${textSizeClasses[size]}`}>
        <Star className={`${sizeClasses[size]} mr-1`} />
        <span>New</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${textSizeClasses[size]}`}>
      <Star className={`${sizeClasses[size]} mr-1 fill-yellow-400 text-yellow-400`} />
      <span className="font-medium">{rating.toFixed(1)}</span>
      {showReviews && totalReviews > 0 && (
        <span className="text-gray-600 ml-1">({totalReviews})</span>
      )}
    </div>
  );
}
