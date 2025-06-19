
# StayFinder Frontend

A React frontend application for StayFinder that connects to the Express.js backend.

## Features

- **Modern React Architecture**: Built with React 18, TypeScript, and Vite
- **Supabase Authentication**: Integrated with Supabase for user authentication
- **Backend Integration**: Connects to Express.js backend via REST API
- **Responsive Design**: Fully responsive UI with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching

## Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **Axios** - HTTP client for API calls
- **Supabase** - Authentication (auth tokens passed to backend)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:3001`

3. **Make sure the backend is running**
   The frontend expects the backend API to be running on `http://localhost:5000`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── lib/                # Utility functions
│   └── config/             # Configuration files
├── public/                 # Static assets
└── package.json
```

## Key Features

### Authentication
- Supabase authentication with JWT tokens
- Automatic token management
- Protected routes
- Login/Register flows

### API Integration
- Axios interceptors for automatic token attachment
- Centralized API service layer
- Error handling
- Request/response transformations

### UI Components
- Custom styled components with Tailwind CSS
- Responsive design
- Loading states
- Error boundaries

### Data Management
- React Query for server state
- Optimistic updates
- Cache invalidation
- Background refetching

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Configuration

The app connects to:
- **Backend API**: `http://localhost:5000`
- **Supabase**: Using the same project as the root app

## API Endpoints Used

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/listings` - Get listings
- `GET /api/listings/popular` - Get popular listings
- `POST /api/likes/listing/:id` - Toggle like on listing
- And more...

## Development Notes

- The frontend runs on port 3001 to avoid conflicts with the root project
- Proxy configuration in Vite routes `/api` requests to the backend
- Authentication tokens are automatically managed and sent with API requests
- All the same functionality as the root project, but using the Express.js backend
