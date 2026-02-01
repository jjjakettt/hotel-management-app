# Hotel Management App

A modern, full-stack hotel booking and management application built with Next.js, Sanity CMS, and NextAuth. This application provides a complete solution for hotel room browsing, real-time availability checking, booking management, user authentication, and review systems.

## Features

### User Features
- **Room Browsing & Search**
  - View all available hotel rooms with detailed information
  - Filter rooms by type (Deluxe, Premium, Suite, Presidential)
  - Search rooms by name
  - View room amenities, dimensions, pricing, and images

- **Smart Booking System**
  - Real-time room availability checking
  - Date range selection with blocked unavailable dates
  - Multi-room booking support with quantity selection
  - Dynamic price calculation with discount application
  - Validation against overbooking and overlapping reservations
  - Adult and children count specification

- **User Authentication**
  - Google OAuth login
  - Email and password registration/login
  - Secure session management with NextAuth
  - User profile with customizable image and bio

- **User Dashboard**
  - View all current and past bookings in a detailed table
  - Analytics dashboard with spending visualization (Chart.js)
  - Rate and review booked rooms
  - Account information display
  - Sign out functionality

- **Review System**
  - Submit 1-5 star ratings for rooms
  - Write detailed text reviews
  - View all reviews for each room
  - Update existing reviews
  - Prevents duplicate reviews (one review per user per room)

- **Multi-Language Support (English / Vietnamese)**
  - Language toggle in the header (EN/VI)
  - All UI strings translated via a central translation dictionary
  - CMS content supports dual-language fields (`name_vi`, `description_vi`, `specialNote_vi`)
  - Vietnamese Dong (VND) pricing with `₫` symbol and locale-formatted numbers
  - Fallback to English when Vietnamese content is not available
  - Language preference persisted in localStorage

- **Additional Features**
  - Dark mode toggle with localStorage persistence
  - Newsletter signup
  - Featured room section on homepage
  - Hotel photo gallery
  - Responsive design for mobile and desktop
  - Toast notifications for user actions

## Tech Stack

### Frontend
- **Next.js 15.3.4** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **react-icons** - Icon library
- **react-hot-toast** - Toast notifications
- **react-datepicker** - Date selection component

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth 4.24.11** - Authentication solution
- **next-auth-sanity** - Sanity adapter for NextAuth

### Database & CMS
- **Sanity.io** - Headless CMS for content management
- **next-sanity** - Sanity client for Next.js
- **GROQ** - Sanity query language
- **SWR** - Client-side data fetching and caching

### Data Visualization
- **Chart.js 4.5.0** - Charting library
- **react-chartjs-2** - React wrapper for Chart.js

### HTTP Client
- **Axios** - Promise-based HTTP client

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Sanity account** (free tier available at [sanity.io](https://sanity.io))
- **Google OAuth credentials** (for Google login)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_STUDIO_TOKEN=your_sanity_token_with_write_permissions

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up Sanity**
   - Create a new project at [sanity.io](https://sanity.io)
   - Copy your project ID to the environment variables
   - Generate an API token with write permissions
   - The schemas are already configured in the `schemaTypes/` directory

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000)

### Sanity Studio
Access the Sanity Studio CMS at [http://localhost:3000/studio](http://localhost:3000/studio)

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Project Structure

```
hotel-management-app/
├── src/
│   ├── app/
│   │   ├── (cms)/                      # CMS route group
│   │   │   └── studio/                 # Sanity Studio interface
│   │   ├── (web)/                      # Main web application
│   │   │   ├── auth/                   # Authentication page
│   │   │   ├── rooms/                  # Room listing and details
│   │   │   ├── users/[id]/             # User dashboard
│   │   │   ├── page.tsx                # Homepage
│   │   │   ├── layout.tsx              # Root layout
│   │   │   └── globals.css             # Global styles
│   │   └── api/                        # API routes
│   │       ├── auth/[...nextauth]/     # NextAuth handler
│   │       ├── bookings/               # Booking endpoints
│   │       ├── users/                  # User & review endpoints
│   │       ├── rooms/                  # Room availability endpoints
│   │       └── sanity/signUp/          # User registration
│   ├── components/                     # React components
│   ├── context/                        # React contexts (theme, language)
│   ├── libs/                           # Utility libraries
│   │   ├── sanity.ts                   # Sanity client config
│   │   ├── auth.ts                     # NextAuth config
│   │   ├── apis.ts                     # API functions
│   │   ├── sanityQueries.ts            # GROQ queries
│   │   └── translations.ts            # i18n translation dictionary & hook
│   └── models/                         # TypeScript types
├── schemaTypes/                        # Sanity CMS schemas
├── public/                             # Static assets
└── Configuration files
```

## Usage Guide

### For End Users

1. **Browsing Rooms**
   - Visit the homepage or click "Rooms" in the navigation
   - Use filters to find rooms by type or search by name
   - Click on a room card to view full details

2. **Booking a Room**
   - Navigate to a room's detail page
   - Select check-in and check-out dates
   - Specify number of adults, children, and quantity of rooms
   - The system will validate availability and show blocked dates
   - Click "Book Now" to confirm (requires authentication)

3. **Creating an Account**
   - Click "Sign In" in the header
   - Choose Google OAuth or email/password registration
   - Fill in required information
   - Verify your email (if using credentials)

4. **Viewing Your Bookings**
   - After logging in, click your profile picture in the header
   - View all your bookings in the table
   - See analytics of your spending by room

5. **Leaving Reviews**
   - In your user dashboard, click "Rate" on any booked room
   - Select a star rating (1-5)
   - Write your review text
   - Submit or update your existing review

6. **Dark Mode**
   - Click the theme toggle icon in the header
   - Your preference is saved to localStorage

7. **Language Switching**
   - Click the language toggle (EN/VI) in the header
   - All UI text and supported CMS content will switch languages
   - Prices display in VND (₫) when Vietnamese is selected (if VND price is set)
   - Your preference is saved to localStorage

### For Administrators

1. **Managing Content**
   - Access Sanity Studio at `/studio`
   - Add, edit, or delete hotel rooms
   - Manage user accounts
   - View and moderate reviews
   - Check booking data

2. **Adding New Rooms**
   - Open Sanity Studio
   - Create a new "Hotel Room" document
   - Fill in all required fields (name, description, price, images)
   - Optionally fill Vietnamese fields (`name_vi`, `description_vi`, `specialNote_vi`, `price_vnd`) for multi-language support
   - Add amenities and configure room type
   - Set quantity available
   - Publish the room

## Key Features in Detail

### Real-Time Availability System
The app uses sophisticated GROQ queries to:
- Check overlapping bookings for each date in the selected range
- Calculate available room quantity dynamically
- Block dates when all rooms are booked
- Prevent overbooking through validation

### Smart Booking Validation
- Prevents check-out dates before check-in dates
- Disables past dates in the date picker
- Validates sufficient room quantity is available
- Automatically calculates total price with discounts
- Supports multi-room bookings

### Review System
- One review per user per room (prevents spam)
- Users can update their existing reviews
- Star ratings aggregated and displayed
- Authenticated users only

### Analytics Dashboard
- Bar chart visualization using Chart.js
- Shows spending per room across all bookings
- Dynamically generated from user's booking history
- Responsive chart sizing

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (usually "production") | Yes |
| `SANITY_STUDIO_TOKEN` | Sanity API token with write permissions | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth session encryption | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes (for Google login) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes (for Google login) |

## API Documentation

See [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for detailed API endpoint documentation.

## Developer Guide

See [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) for development workflows, contribution guidelines, and architecture details.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
Ensure the platform supports:
- Node.js runtime
- Environment variables
- Serverless functions (for API routes)

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
