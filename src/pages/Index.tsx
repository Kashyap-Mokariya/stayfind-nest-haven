
import { Search, MapPin, Star, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const featuredListings = [
    {
      id: 1,
      title: "Modern Beachfront Villa",
      location: "Malibu, California",
      price: 299,
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: ["WiFi", "Pool", "Kitchen", "Beach Access"]
    },
    {
      id: 2,
      title: "Cozy Mountain Cabin",
      location: "Aspen, Colorado",
      price: 189,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ["WiFi", "Fireplace", "Kitchen", "Mountain View"]
    },
    {
      id: 3,
      title: "Urban Loft Downtown",
      location: "New York, NY",
      price: 225,
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["WiFi", "Gym", "Rooftop", "City View"]
    },
    {
      id: 4,
      title: "Lakeside Retreat",
      location: "Lake Tahoe, Nevada",
      price: 165,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      guests: 5,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ["WiFi", "Lake Access", "Kayaks", "Fire Pit"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                StayFinder
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Explore</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Experiences</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Host</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hidden md:flex">
                Become a Host
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Stay Anywhere
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover unique places to stay, from cozy cabins to luxury villas. 
            Your next adventure starts with the perfect accommodation.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-2 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <Input
                    placeholder="Where are you going?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="border-0 p-0 focus-visible:ring-0 text-base"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Check in</p>
                  <p className="text-sm text-gray-500">Add dates</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Check out</p>
                  <p className="text-sm text-gray-500">Add dates</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-3 p-2">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Guests</p>
                    <p className="text-sm text-gray-500">Add guests</p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl h-12 px-8">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Stays
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked properties that offer exceptional experiences and unforgettable memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white rounded-2xl">
                <div className="relative overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute top-4 right-4 rounded-full w-10 h-10 p-0 ${
                      favorites.includes(listing.id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white/80 hover:bg-white text-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(listing.id);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(listing.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                      {listing.amenities[0]}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {listing.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.location}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{listing.guests} guests</span>
                    <span>{listing.bedrooms} bedrooms</span>
                    <span>{listing.bathrooms} baths</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${listing.price}
                      </span>
                      <span className="text-gray-600"> /night</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {listing.reviews} reviews
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Start Hosting?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Share your space and earn extra income while creating memorable experiences for travelers
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl">
            Become a Host Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SF</span>
                </div>
                <h4 className="text-xl font-bold">StayFinder</h4>
              </div>
              <p className="text-gray-400">
                Discover unique places to stay around the world.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Information</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cancellation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Community</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Diversity</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Host</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Host Your Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Forum</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StayFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
