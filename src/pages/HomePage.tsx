
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/hooks/useListings';
import Header from '@/components/Header';
import SearchBar, { SearchParams } from '@/components/SearchBar';
import PopularDestinations from '@/components/PopularDestinations';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (params: SearchParams) => {
    // Navigate to listings page with search parameters
    const searchParams = new URLSearchParams();
    if (params.location) searchParams.set('location', params.location);
    if (params.checkIn) searchParams.set('checkIn', params.checkIn);
    if (params.checkOut) searchParams.set('checkOut', params.checkOut);
    if (params.guests) searchParams.set('guests', params.guests.toString());
    
    navigate(`/listings?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with Background */}
      <div className="relative min-h-screen bg-gradient-to-br from-orange-400 via-teal-300 to-teal-600 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-2">
                <p className="text-sm font-medium tracking-wider uppercase opacity-90">
                  MOUNTAINS | PLAINS | BEACHES
                </p>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Spend your vacation with our activities
                </h1>
              </div>

              {/* Popular Destinations */}
              <PopularDestinations />
            </div>

            {/* Right Content - Floating Image */}
            <div className="relative lg:block hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 rounded-full opacity-20 blur-3xl transform scale-150"></div>
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
                alt="Beautiful destination"
                className="relative z-10 w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Search Bar at Bottom */}
          <div className="pb-12">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}
