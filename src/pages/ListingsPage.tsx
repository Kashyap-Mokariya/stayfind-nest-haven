
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListings } from '@/hooks/useListings';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import SearchBar, { SearchParams } from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: listings, isLoading } = useListings();
  const [currentSearch, setCurrentSearch] = useState<SearchParams | null>(null);

  useEffect(() => {
    // Parse URL parameters into search state
    const location = searchParams.get('location') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const guests = parseInt(searchParams.get('guests') || '1');

    if (location || checkIn || checkOut || guests > 1) {
      setCurrentSearch({ location, checkIn, checkOut, guests });
    }
  }, [searchParams]);

  const handleSearch = (params: SearchParams) => {
    setCurrentSearch(params);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams();
    if (params.location) newSearchParams.set('location', params.location);
    if (params.checkIn) newSearchParams.set('checkIn', params.checkIn);
    if (params.checkOut) newSearchParams.set('checkOut', params.checkOut);
    if (params.guests) newSearchParams.set('guests', params.guests.toString());
    
    setSearchParams(newSearchParams);
  };

  const filteredListings = listings?.filter((listing) => {
    if (!currentSearch) return true;
    
    const locationMatch = !currentSearch.location || 
      listing.location.toLowerCase().includes(currentSearch.location.toLowerCase());
    const guestsMatch = listing.max_guests >= currentSearch.guests;
    
    return locationMatch && guestsMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar onSearch={handleSearch} initialValues={currentSearch} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentSearch?.location ? `Stays in ${currentSearch.location}` : 'All Listings'}
          </h1>
          <p className="text-gray-600">
            {filteredListings ? `${filteredListings.length} places to stay` : 'Loading...'}
          </p>
        </div>
        
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

        {filteredListings?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
