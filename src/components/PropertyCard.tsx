
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Bed, Bath } from 'lucide-react';
import { Listing } from '@/hooks/useListings';
import { Link } from 'react-router-dom';
import RatingDisplay from './RatingDisplay';
import LikeButton from './LikeButton';

interface PropertyCardProps {
  listing: Listing;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const imageUrl = listing.images?.[0] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04';

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white rounded-2xl relative z-10">
        <div className="relative h-48">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 group-hover:text-blue-600 transition-all duration-500"
          />
          <Badge className="absolute top-2 left-2 bg-white text-gray-800">
            {listing.listing_type.replace('_', ' ')}
          </Badge>
          <div className="absolute top-2 right-2">
            <LikeButton listingId={listing.id} size="sm" />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 flex-1">{listing.title}</h3>
            <RatingDisplay 
              rating={listing.rating || 0} 
              totalReviews={listing.total_reviews || 0}
              size="sm"
            />
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{listing.location}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {listing.max_guests}
            </div>
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {listing.bedrooms}
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {listing.bathrooms}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="text-right w-full">
            <span className="text-2xl font-bold">${listing.price_per_night}</span>
            <span className="text-gray-600"> / night</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
