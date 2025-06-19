
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  initialValues?: SearchParams | null;
}

export interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function SearchBar({ onSearch, initialValues }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (initialValues) {
      setLocation(initialValues.location || '');
      setCheckIn(initialValues.checkIn || '');
      setCheckOut(initialValues.checkOut || '');
      setGuests(initialValues.guests || 1);
    }
  }, [initialValues]);

  const handleSearch = () => {
    onSearch({ location, checkIn, checkOut, guests });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            className="px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
