
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users } from 'lucide-react';
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
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    peopleGoing: '27 people going'
  },
  {
    id: 3,
    name: 'Trip To Greece',
    image: 'https://images.unsplash.com/photo-1749576502454-a0fa6ae62a48?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    peopleGoing: '20 people going'
  }
];

export default function PopularDestinations() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold uppercase tracking-wider">
        MOST POPULAR
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 z-100">
        {destinations.map((destination) => (
          <Link 
            key={destination.id}
            to={`/listings?location=${encodeURIComponent(destination.name.replace('Trip To ', ''))}`}
            className="block relative"
          >
            <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white rounded-2xl relative z-10">
              <div className="relative overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-[200px] object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-3 relative z-20">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-blue-600 transition-colors">
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
