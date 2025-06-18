
# StayFinder Backend API with Supabase Integration

A Node.js/Express.js backend API that integrates with Supabase for the StayFinder accommodation booking platform. This backend maintains all current functionality while providing a traditional REST API layer.

## Features

- **Supabase Integration**: Uses existing Supabase database and authentication
- **Authentication**: Supabase Auth integration (no JWT handling needed)
- **Listing Management**: Full CRUD operations for listings
- **Booking System**: Complete booking functionality
- **Like/Unlike**: User like functionality for listings
- **User Profiles**: Profile management
- **File Upload Support**: Ready for Cloudinary integration
- **Security**: Rate limiting, CORS, security headers
- **Validation**: Input validation and sanitization

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- Existing Supabase project
- Access to Supabase service role key

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Supabase configuration
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Environment Configuration

### Required Environment Variables

```env
# Supabase Configuration
SUPABASE_URL=https://bwusbjpwqrfbvvdzsegv.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Important**: You'll need to get your service role key from your Supabase dashboard under Settings > API.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user with Supabase
- `POST /api/auth/login` - Login user with Supabase
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Listings
- `GET /api/listings` - Get all listings (with filters)
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

## Authentication Flow

This backend integrates seamlessly with your existing Supabase authentication:

1. **Frontend** authenticates with Supabase directly
2. **Frontend** sends Supabase auth token in `Authorization: Bearer <token>` header
3. **Backend** validates token with Supabase
4. **Backend** proceeds with database operations using Supabase client

## Key Differences from Pure Express Backend

- **No password hashing**: Supabase handles all auth
- **No JWT creation**: Supabase provides tokens
- **No database connection**: Supabase client handles all DB operations
- **No user table**: Uses Supabase auth.users + profiles table
- **RLS policies**: Database security handled by Supabase RLS

## Database Operations

All database operations use the Supabase JavaScript client:

```javascript
// Example: Get listings
const { data, error } = await supabase
  .from('listings')
  .select('*')
  .eq('is_active', true);
```

## Integration with Frontend

To use this backend with your React frontend:

1. Update your frontend API calls to point to `http://localhost:5000/api`
2. Keep using Supabase auth on the frontend
3. Pass Supabase tokens to backend API calls
4. All existing functionality will work seamlessly

## Development Workflow

1. Start Supabase (already running)
2. Start backend: `npm run dev`
3. Start frontend: `npm start` (in main project)
4. Both will work together seamlessly

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

## Security Features

- **Supabase RLS**: Database-level security
- **Token validation**: Supabase auth token verification
- **Rate limiting**: Prevents abuse
- **CORS protection**: Configurable origins
- **Input validation**: Request validation and sanitization
- **Security headers**: Helmet middleware

## Deployment Considerations

1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Set up Supabase service role key securely
4. Configure rate limiting for production load
5. Set up proper logging and monitoring

## Benefits of This Architecture

- **Maintains existing functionality**: All Supabase features work
- **Familiar REST API**: Traditional Express.js patterns
- **Easy scaling**: Can add middleware, caching, etc.
- **Flexible**: Can add custom business logic
- **Secure**: Leverages Supabase security features
- **No migration needed**: Uses existing database and auth

This backend serves as a perfect bridge between your React frontend and Supabase backend, giving you the flexibility of Express.js while maintaining all the power of Supabase.
