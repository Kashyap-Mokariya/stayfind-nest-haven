
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar, { SearchParams } from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { useListings } from '@/hooks/useListings';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    setFilters({
      location: location || '',
      checkIn: checkIn || '',
      checkOut: checkOut || '',
      guests: guests ? parseInt(guests) : undefined,
    });
  }, [searchParams]);

  const { data: listings, isLoading, error } = useListings(filters);

  const handleSearch = (params: SearchParams) => {
    const newSearchParams = new URLSearchParams();
    if (params.location) newSearchParams.set('location', params.location);
    if (params.checkIn) newSearchParams.set('checkIn', params.checkIn);
    if (params.checkOut) newSearchParams.set('checkOut', params.checkOut);
    if (params.guests) newSearchParams.set('guests', params.guests.toString());
    
    setSearchParams(newSearchParams);
  };

  const initialSearchValues: SearchParams = {
    location: searchParams.get('location') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : 1,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} initialValues={initialSearchValues} />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Available Properties
            {filters.location && ` in ${filters.location}`}
          </h1>
          {listings && (
            <p className="text-gray-600 mt-1">
              {listings.length} properties found
            </p>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-2xl h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading listings. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && listings && listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No properties found matching your criteria.</p>
          </div>
        )}

        {!isLoading && !error && listings && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
