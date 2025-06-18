
-- Add rating column to listings table
ALTER TABLE public.listings 
ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
ADD COLUMN total_reviews INTEGER DEFAULT 0;

-- Create likes table for user likes on listings
CREATE TABLE public.listing_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Enable RLS on likes table
ALTER TABLE public.listing_likes ENABLE ROW LEVEL SECURITY;

-- RLS policies for likes
CREATE POLICY "Users can view all likes" ON public.listing_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can like listings" ON public.listing_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" ON public.listing_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to get like count for listings
CREATE OR REPLACE FUNCTION get_listing_like_count(listing_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM public.listing_likes WHERE listing_id = listing_uuid;
$$;

-- Create view for listings with like counts
CREATE OR REPLACE VIEW public.listings_with_likes AS
SELECT 
  l.*,
  COALESCE(like_counts.like_count, 0) as like_count
FROM public.listings l
LEFT JOIN (
  SELECT 
    listing_id,
    COUNT(*) as like_count
  FROM public.listing_likes
  GROUP BY listing_id
) like_counts ON l.id = like_counts.listing_id
WHERE l.is_active = true;

-- Insert mock data (assuming the user with email mokariyakashyap@gmail.com exists)
DO $$
DECLARE
  host_user_id UUID;
  listing_types listing_type[] := ARRAY['entire_place', 'private_room', 'shared_room'];
  locations TEXT[] := ARRAY[
    'Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK', 'Barcelona, Spain',
    'Rome, Italy', 'Amsterdam, Netherlands', 'Berlin, Germany', 'Prague, Czech Republic',
    'Vienna, Austria', 'Lisbon, Portugal', 'Stockholm, Sweden', 'Copenhagen, Denmark',
    'Oslo, Norway', 'Helsinki, Finland', 'Dublin, Ireland', 'Edinburgh, Scotland',
    'Zurich, Switzerland', 'Brussels, Belgium', 'Luxembourg City, Luxembourg',
    'Athens, Greece', 'Istanbul, Turkey', 'Cairo, Egypt', 'Dubai, UAE', 'Mumbai, India',
    'Bangkok, Thailand', 'Singapore', 'Sydney, Australia', 'Melbourne, Australia',
    'Auckland, New Zealand', 'Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada',
    'Los Angeles, USA', 'San Francisco, USA', 'Miami, USA', 'Chicago, USA', 'Boston, USA',
    'Seattle, USA', 'Las Vegas, USA', 'Mexico City, Mexico', 'Buenos Aires, Argentina',
    'Rio de Janeiro, Brazil', 'São Paulo, Brazil', 'Lima, Peru', 'Santiago, Chile',
    'Bogotá, Colombia', 'Caracas, Venezuela', 'Quito, Ecuador', 'La Paz, Bolivia'
  ];
  titles TEXT[] := ARRAY[
    'Cozy Downtown Apartment', 'Luxury Penthouse Suite', 'Charming Historic Villa',
    'Modern Loft Space', 'Seaside Beach House', 'Mountain Cabin Retreat',
    'Urban Studio Apartment', 'Spacious Family Home', 'Boutique Hotel Room',
    'Traditional Townhouse', 'Contemporary Condo', 'Rustic Farmhouse',
    'Designer Apartment', 'Garden View Suite', 'Rooftop Terrace Home',
    'Minimalist Flat', 'Artistic Warehouse', 'Vintage Brownstone',
    'Waterfront Property', 'City Center Residence'
  ];
  descriptions TEXT[] := ARRAY[
    'Beautiful and comfortable accommodation in the heart of the city',
    'Luxurious space with stunning views and premium amenities',
    'Historic charm meets modern comfort in this unique property',
    'Perfectly located for exploring local attractions and culture',
    'Peaceful retreat with all the conveniences you need',
    'Stylish and well-appointed space for your perfect getaway',
    'Exceptional hospitality in a prime location',
    'Thoughtfully designed space with attention to every detail',
    'Ideal for both business and leisure travelers',
    'Experience local culture from this authentic accommodation'
  ];
  base_amenities TEXT[] := ARRAY['WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'Concierge', 'Garden', 'Fireplace', 'Air Conditioning', 'Laundry', 'Beach Access', 'BBQ', 'Hiking Trails', 'City View', 'Elevator', 'Room Service', 'Historic Features'];
  images TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
    'https://images.unsplash.com/photo-1600047509358-9dc75507daeb',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea'
  ];
  i INTEGER;
  selected_amenities TEXT[];
  num_amenities INTEGER;
BEGIN
  -- Get the host user ID (assuming there's only one user with that email)
  SELECT id INTO host_user_id 
  FROM auth.users 
  WHERE email = 'mokariyakashyap@gmail.com' 
  LIMIT 1;
  
  IF host_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email mokariyakashyap@gmail.com not found';
  END IF;
  
  -- Insert 100 mock listings
  FOR i IN 1..100 LOOP
    -- Select random amenities for each listing
    num_amenities := (RANDOM() * 3 + 2)::INTEGER; -- 2-5 amenities
    selected_amenities := ARRAY[]::TEXT[];
    
    -- Always include WiFi
    selected_amenities := array_append(selected_amenities, 'WiFi');
    
    -- Add random amenities
    FOR j IN 1..num_amenities-1 LOOP
      selected_amenities := array_append(selected_amenities, base_amenities[((RANDOM() * array_length(base_amenities, 1))::INTEGER % array_length(base_amenities, 1)) + 1]);
    END LOOP;
    
    INSERT INTO public.listings (
      host_id,
      title,
      description,
      listing_type,
      price_per_night,
      location,
      max_guests,
      bedrooms,
      bathrooms,
      amenities,
      images,
      rating,
      total_reviews,
      is_active
    ) VALUES (
      host_user_id,
      titles[((i - 1) % array_length(titles, 1)) + 1] || ' #' || i,
      descriptions[((i - 1) % array_length(descriptions, 1)) + 1],
      listing_types[((i - 1) % array_length(listing_types, 1)) + 1],
      (RANDOM() * 400 + 50)::DECIMAL(10,2), -- Price between $50-$450
      locations[((i - 1) % array_length(locations, 1)) + 1],
      (RANDOM() * 8 + 1)::INTEGER, -- 1-9 guests
      (RANDOM() * 4 + 1)::INTEGER, -- 1-5 bedrooms
      (RANDOM() * 3 + 1)::INTEGER, -- 1-4 bathrooms
      selected_amenities,
      ARRAY[images[((i - 1) % array_length(images, 1)) + 1]],
      (RANDOM() * 5)::DECIMAL(2,1), -- Rating 0.0-5.0
      (RANDOM() * 100)::INTEGER, -- 0-100 reviews
      true
    );
  END LOOP;
  
  RAISE NOTICE 'Inserted 100 mock listings for host user: %', host_user_id;
END $$;
