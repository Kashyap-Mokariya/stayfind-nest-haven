
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePopularListings } from '@/hooks/useLikes';
import RatingDisplay from './RatingDisplay';
import LikeButton from './LikeButton';

export default function PopularDestinations() {
  const { data: listings, isLoading } = usePopularListings();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold uppercase tracking-wider">
          MOST POPULAR
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-[200px] w-full rounded-2xl bg-white/20 animate-pulse" />
              <div className="h-4 w-3/4 bg-white/20 animate-pulse rounded" />
              <div className="h-4 w-1/2 bg-white/20 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold uppercase tracking-wider">
          MOST POPULAR
        </h2>
        <p className="text-white/80">No popular destinations found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold uppercase tracking-wider">
        MOST POPULAR
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 z-100">
        {listings.map((listing) => (
          <Link 
            key={listing.id}
            to={`/listing/${listing.id}`}
            className="block relative"
          >
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white rounded-2xl relative z-10">
              <div className="relative overflow-hidden">
                <img
                  src={listing.images?.[0] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04'}
                  alt={listing.title}
                  className="w-full h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <LikeButton listingId={listing.id} size="sm" />
                </div>
              </div>
              <CardContent className="p-3 relative z-20">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
                    {listing.title}
                  </h3>
                  <RatingDisplay 
                    rating={listing.rating || 0} 
                    totalReviews={listing.total_reviews || 0}
                    size="sm"
                    showReviews={false}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {listing.max_guests} guests
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${listing.price_per_night}/night
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
