
import { useState } from 'react';
import { useListings } from '@/hooks/useListings';
import Header from '@/components/Header';
import SearchBar, { SearchParams } from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: listings, isLoading } = useListings();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const filteredListings = listings?.filter((listing) => {
    if (!searchParams) return true;
    
    const locationMatch = !searchParams.location || 
      listing.location.toLowerCase().includes(searchParams.location.toLowerCase());
    const guestsMatch = listing.max_guests >= searchParams.guests;
    
    return locationMatch && guestsMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Discover unique places to stay around the world
            </p>
          </div>
          <SearchBar onSearch={setSearchParams} />
        </div>
      </div>

      {/* Listings Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {searchParams ? 'Search Results' : 'Popular Destinations'}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings?.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {filteredListings?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
