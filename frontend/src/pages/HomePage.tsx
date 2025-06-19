
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar, { SearchParams } from '@/components/SearchBar';
import { usePopularListings } from '@/hooks/useListings';
import PropertyCard from '@/components/PropertyCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: popularListings, isLoading } = usePopularListings();

  const handleSearch = (params: SearchParams) => {
    const searchParams = new URLSearchParams();
    if (params.location) searchParams.set('location', params.location);
    if (params.checkIn) searchParams.set('checkIn', params.checkIn);
    if (params.checkOut) searchParams.set('checkOut', params.checkOut);
    if (params.guests) searchParams.set('guests', params.guests.toString());
    
    navigate(`/listings?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Header transparent={true} />
      
      <div className="relative h-screen bg-gradient-to-br from-orange-400 via-teal-300 to-teal-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-1 max-h-full py-20">
            <div className="text-white space-y-6 lg:space-y-8">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium tracking-wider uppercase opacity-90">
                  MOUNTAINS | PLAINS | BEACHES
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Spend your vacation with our activities
                </h1>
              </div>

              {!isLoading && popularListings && popularListings.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Popular Destinations</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {popularListings.slice(0, 3).map((listing) => (
                      <div key={listing.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={listing.images?.[0] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04'}
                            alt={listing.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-sm">{listing.title}</h3>
                            <p className="text-xs opacity-90">{listing.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative lg:block hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 rounded-full opacity-20 blur-3xl transform scale-150"></div>
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
                alt="Beautiful destination"
                className="relative w-full h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          <div className="pb-6 lg:pb-12">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}
