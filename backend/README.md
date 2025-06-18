
# StayFinder Backend API

A Node.js/Express.js backend API for the StayFinder accommodation booking platform.

## Features

- User authentication (JWT-based)
- Listing management (CRUD operations)
- Booking system
- Like/Unlike functionality
- User profiles
- Image upload support
- Rate limiting
- Security headers
- Input validation
- Pagination

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Cloudinary account (for image uploads)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Create a PostgreSQL database named 'stayfinder'
# Run the schema.sql file to create tables
psql -d stayfinder -f database/schema.sql
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Listings
- `GET /api/listings` - Get all listings (with optional filters)
- `GET /api/listings/popular` - Get popular listings
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing (requires auth)

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings` - Get user bookings (requires auth)
- `GET /api/bookings/:id` - Get booking by ID (requires auth)

### Likes
- `POST /api/likes/listing/:listingId` - Toggle like on listing (requires auth)
- `GET /api/likes/listing/:listingId` - Get like status for listing (requires auth)
- `GET /api/likes/user` - Get user's liked listings (requires auth)

### Users
- `PUT /api/users/profile` - Update user profile (requires auth)
- `PATCH /api/users/host-status` - Toggle host status (requires auth)

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Create Listing
```bash
POST /api/listings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Beautiful Apartment in Downtown",
  "description": "A lovely apartment with great city views...",
  "listingType": "entire_place",
  "pricePerNight": 120.00,
  "location": "New York, NY",
  "maxGuests": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "amenities": ["WiFi", "Kitchen", "Air Conditioning"],
  "images": ["https://example.com/image1.jpg"]
}
```

### Search Listings
```bash
GET /api/listings?location=New%20York&minPrice=50&maxPrice=200&guests=2&page=1&limit=10
```

## Environment Variables

See `.env.example` for all required environment variables.

## Database Schema

The database schema is defined in `database/schema.sql` and includes:

- `profiles` - User accounts
- `listings` - Property listings
- `bookings` - Booking records
- `listing_likes` - User likes on listings

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Security headers (Helmet)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test
```

## Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
