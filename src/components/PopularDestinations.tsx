
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  {
    id: 1,
    name: 'Trip To Scotland',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    peopleGoing: '31 people going'
  },
  {
    id: 2,
    name: 'Trip To Egypt',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e',
    peopleGoing: '27 people going'
  },
  {
    id: 3,
    name: 'Trip To Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
    peopleGoing: '20 people going'
  }
];

export default function PopularDestinations() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold uppercase tracking-wider">
        MOST POPULAR
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {destinations.map((destination) => (
          <Link 
            key={destination.id}
            to={`/listings?location=${encodeURIComponent(destination.name.replace('Trip To ', ''))}`}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
              <div className="relative h-32">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                  {destination.name}
                </h3>
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="h-3 w-3 mr-1" />
                  {destination.peopleGoing}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
