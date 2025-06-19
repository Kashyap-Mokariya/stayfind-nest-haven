
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { bookingsAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface Listing {
  id: string;
  title: string;
  price_per_night: number;
  max_guests: number;
}

interface BookingFormProps {
  listing: Listing;
}

export default function BookingForm({ listing }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = nights * Number(listing.price_per_night);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('Please sign in to make a booking.');
      navigate('/login');
      return;
    }

    if (nights <= 0) {
      setMessage('Please select valid check-in and check-out dates.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Submitting booking:', {
        listingId: listing.id,
        checkIn,
        checkOut,
        guests,
        specialRequests
      });

      const response = await bookingsAPI.createBooking({
        listingId: listing.id,
        checkIn,
        checkOut,
        guests,
        specialRequests: specialRequests || undefined
      });

      console.log('Booking response:', response);
      setMessage('Booking submitted successfully!');
      
      // Reset form
      setCheckIn('');
      setCheckOut('');
      setGuests(1);
      setSpecialRequests('');
    } catch (error: any) {
      console.error('Booking error:', error);
      setMessage(error.response?.data?.error || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-8 p-6">
      <div className="mb-4">
        <div className="text-2xl font-bold">${listing.price_per_night}</div>
        <div className="text-gray-600">per night</div>
      </div>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests
          </label>
          <Input
            type="number"
            min="1"
            max={listing.max_guests}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requests or requirements..."
            rows={3}
          />
        </div>

        {nights > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>${listing.price_per_night} x {nights} nights</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Reserve'}
        </Button>
      </form>
    </Card>
  );
}
