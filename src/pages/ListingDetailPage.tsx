
import { useParams } from 'react-router-dom';
import { useListing } from '@/hooks/useListings';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Users, Bed, Bath, Wifi } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import RatingDisplay from '@/components/RatingDisplay';
import LikeButton from '@/components/LikeButton';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading } = useListing(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h1>
            <p className="text-gray-600">The listing you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = listing.images?.[0] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="rounded-lg overflow-hidden relative">
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4">
                <LikeButton listingId={listing.id} size="lg" />
              </div>
            </div>

            {/* Title and Location */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>{listing.listing_type.replace('_', ' ')}</Badge>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{listing.title}</h1>
                <RatingDisplay 
                  rating={listing.rating || 0} 
                  totalReviews={listing.total_reviews || 0}
                  size="lg"
                />
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{listing.location}</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{listing.max_guests} guests</span>
              </div>
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2" />
                <span>{listing.bedrooms} bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-2" />
                <span>{listing.bathrooms} bathrooms</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Wifi className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div>
            <BookingForm listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}
