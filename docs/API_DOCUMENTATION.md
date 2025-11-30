# API Documentation

This document provides detailed information about all API endpoints available in the Hotel Management Application.

## Table of Contents
- [Authentication](#authentication)
- [Bookings API](#bookings-api)
- [Rooms API](#rooms-api)
- [Users & Reviews API](#users--reviews-api)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

---

## Base URL

For local development:
```
http://localhost:3000/api
```

For production:
```
https://your-domain.com/api
```

---

## Authentication

All authenticated endpoints require a valid NextAuth session. The session is managed via HTTP-only cookies.

### NextAuth Endpoints

#### POST/GET `/api/auth/[...nextauth]`

Handles all NextAuth operations including login, logout, and session management.

**Supported Providers:**
- Google OAuth
- Email/Password (Credentials)

**NextAuth Routes:**
- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get current session
- `/api/auth/providers` - Get available providers
- `/api/auth/callback/google` - Google OAuth callback
- `/api/auth/callback/credentials` - Credentials callback

**Example: Get Session (Client-side)**
```typescript
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();
// session.user.id, session.user.email, session.user.name, session.user.image
```

---

## Bookings API

### Create Booking

#### POST `/api/bookings`

Creates a new room booking with validation for availability and date conflicts.

**Authentication:** Required

**Request Body:**
```json
{
  "user": "user-id-string",
  "hotelRoom": "room-id-string",
  "checkinDate": "2025-12-01",
  "checkoutDate": "2025-12-05",
  "numberOfDays": 4,
  "adults": 2,
  "children": 1,
  "quantity": 2,
  "totalPrice": 800,
  "discount": 50
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | string | Yes | User ID making the booking |
| `hotelRoom` | string | Yes | Room ID to book |
| `checkinDate` | string (ISO date) | Yes | Check-in date (YYYY-MM-DD) |
| `checkoutDate` | string (ISO date) | Yes | Check-out date (YYYY-MM-DD) |
| `numberOfDays` | number | Yes | Number of days for the stay (min: 1) |
| `adults` | number | Yes | Number of adults (min: 1) |
| `children` | number | Yes | Number of children (can be 0) |
| `quantity` | number | Yes | Number of rooms to book (min: 1) |
| `totalPrice` | number | Yes | Total price for the booking |
| `discount` | number | Yes | Discount amount applied (can be 0) |

**Validation Rules:**
- Check-out date must be after check-in date
- Validates against overlapping bookings
- Ensures sufficient room quantity is available
- All fields are required (children and discount can be 0)

**Success Response (200):**
```json
{
  "success": true,
  "result": {
    "_id": "booking-doc-id",
    "_type": "booking",
    "user": { "_ref": "user-id", "_type": "reference" },
    "hotelRoom": { "_ref": "room-id", "_type": "reference" },
    "checkinDate": "2025-12-01",
    "checkoutDate": "2025-12-05",
    "numberOfDays": 4,
    "adults": 2,
    "children": 1,
    "quantity": 2,
    "totalPrice": 800,
    "discount": 50
  }
}
```

**Error Responses:**

- **401 Unauthorized:**
  ```json
  { "error": "Unauthorized" }
  ```

- **400 Bad Request:**
  ```json
  { "error": "Missing required fields" }
  ```
  ```json
  { "error": "Invalid date range" }
  ```

- **409 Conflict:**
  ```json
  { "error": "Not enough rooms available for selected dates" }
  ```

- **500 Internal Server Error:**
  ```json
  {
    "success": false,
    "error": "Failed to create booking"
  }
  ```

**Example Usage:**
```typescript
import axios from 'axios';

const createBooking = async (bookingData) => {
  try {
    const { data } = await axios.post('/api/bookings', {
      user: 'user-123',
      hotelRoom: 'room-456',
      checkinDate: '2025-12-01',
      checkoutDate: '2025-12-05',
      numberOfDays: 4,
      adults: 2,
      children: 0,
      quantity: 1,
      totalPrice: 400,
      discount: 0
    });
    console.log('Booking created:', data);
  } catch (error) {
    console.error('Booking failed:', error.response?.data);
  }
};
```

---

## Rooms API

### Check Room Availability

#### GET `/api/rooms/[id]/availability`

Checks how many rooms are available for a specific date range.

**Authentication:** Not required

**URL Parameters:**
- `id` - Room ID

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checkinDate` | string | Yes | Check-in date (YYYY-MM-DD) |
| `checkoutDate` | string | Yes | Check-out date (YYYY-MM-DD) |

**Success Response (200):**
```json
{
  "availableQuantity": 3,
  "totalQuantity": 5
}
```

**Response Fields:**
- `availableQuantity` - Number of rooms available (0 if fully booked)
- `totalQuantity` - Total number of rooms of this type

**Error Responses:**

- **400 Bad Request:**
  ```json
  { "error": "Dates required" }
  ```

- **500 Internal Server Error:**
  ```json
  { "error": "Failed to check availability" }
  ```

**Example Usage:**
```typescript
import axios from 'axios';

const checkAvailability = async (roomId, checkin, checkout) => {
  const { data } = await axios.get(`/api/rooms/${roomId}/availability`, {
    params: {
      checkinDate: '2025-12-01',
      checkoutDate: '2025-12-05'
    }
  });

  console.log(`${data.availableQuantity} out of ${data.totalQuantity} rooms available`);
};
```

---

### Get Fully Booked Dates

#### GET `/api/rooms/[id]/booked-dates`

Returns an array of dates when all rooms of this type are fully booked. Used to disable dates in the date picker.

**Authentication:** Not required

**URL Parameters:**
- `id` - Room ID

**Success Response (200):**
```json
[
  "2025-12-15",
  "2025-12-16",
  "2025-12-17",
  "2025-12-25",
  "2025-12-26"
]
```

**Response:** Array of date strings in `YYYY-MM-DD` format representing fully booked dates.

**Error Responses:**

- **500 Internal Server Error:**
  ```json
  { "error": "Failed to fetch booked dates" }
  ```

**Example Usage:**
```typescript
import axios from 'axios';

const getBlockedDates = async (roomId) => {
  const { data } = await axios.get(`/api/rooms/${roomId}/booked-dates`);
  // data = ["2025-12-15", "2025-12-16", ...]

  // Use to disable dates in date picker
  const isDateBlocked = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return data.includes(dateStr);
  };
};
```

---

## Users & Reviews API

### Get Current User Data

#### GET `/api/users`

Retrieves the current authenticated user's profile data including bookings and reviews.

**Authentication:** Required

**Success Response (200):**
```json
{
  "_id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "image": "https://example.com/avatar.jpg",
  "about": "Travel enthusiast",
  "_createdAt": "2025-01-15T10:30:00Z",
  "bookings": [
    {
      "_id": "booking-1",
      "hotelRoom": {
        "_id": "room-1",
        "name": "Deluxe Suite",
        "slug": "deluxe-suite",
        "price": 200
      },
      "checkinDate": "2025-12-01",
      "checkoutDate": "2025-12-05",
      "numberOfDays": 4,
      "adults": 2,
      "children": 0,
      "quantity": 1,
      "totalPrice": 800,
      "discount": 0
    }
  ]
}
```

**Error Responses:**

- **500 Internal Server Error:**
  ```json
  "Authentication Required"
  ```

- **400 Bad Request:**
  ```json
  "Unable to fetch"
  ```

**Example Usage:**
```typescript
import axios from 'axios';

const getUserProfile = async () => {
  try {
    const { data } = await axios.get('/api/users');
    console.log('User data:', data);
  } catch (error) {
    console.error('Failed to fetch user:', error.response?.data);
  }
};
```

---

### Create or Update Review

#### POST `/api/users`

Creates a new review for a room or updates an existing review if the user has already reviewed the room.

**Authentication:** Required

**Request Body:**
```json
{
  "roomId": "room-id-string",
  "reviewText": "Amazing stay! The room was clean and comfortable.",
  "ratingValue": 5
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roomId` | string | Yes | Room ID to review |
| `reviewText` | string | Yes | Review text content |
| `ratingValue` | number | Yes | Star rating (1-5) |

**Success Response (200):**
```json
{
  "transactionId": "tx-123",
  "results": [
    {
      "id": "review-id",
      "operation": "create",
      "document": {
        "_id": "review-id",
        "_type": "review",
        "user": { "_ref": "user-id", "_type": "reference" },
        "hotelRoom": { "_ref": "room-id", "_type": "reference" },
        "text": "Amazing stay! The room was clean and comfortable.",
        "userRating": 5
      }
    }
  ]
}
```

**Behavior:**
- If the user has already reviewed this room, the review is **updated**
- If no review exists, a **new review** is created
- One review per user per room (prevents spam)

**Error Responses:**

- **500 Internal Server Error:**
  ```json
  "Authentication Required"
  ```

- **400 Bad Request:**
  ```json
  "All Fields are required"
  ```
  ```json
  "Unable to create review"
  ```

**Example Usage:**
```typescript
import axios from 'axios';

const submitReview = async (roomId, text, rating) => {
  try {
    const { data } = await axios.post('/api/users', {
      roomId: 'room-123',
      reviewText: 'Great experience!',
      ratingValue: 5
    });
    console.log('Review submitted:', data);
  } catch (error) {
    console.error('Review failed:', error.response?.data);
  }
};
```

---

### Get Room Reviews

#### GET `/api/room-reviews/[id]`

Retrieves all reviews for a specific room.

**Authentication:** Not required

**URL Parameters:**
- `id` - Room ID

**Success Response (200):**
```json
[
  {
    "_id": "review-1",
    "text": "Excellent room with great amenities!",
    "userRating": 5,
    "_createdAt": "2025-11-20T14:30:00Z",
    "user": {
      "name": "Jane Smith"
    }
  },
  {
    "_id": "review-2",
    "text": "Good value for money",
    "userRating": 4,
    "_createdAt": "2025-11-15T10:15:00Z",
    "user": {
      "name": "Bob Johnson"
    }
  }
]
```

**Response:** Array of review objects with user information.

**Error Responses:**

- **400 Bad Request:**
  ```json
  "Unable to fetch"
  ```

**Example Usage:**
```typescript
import axios from 'axios';

const fetchRoomReviews = async (roomId) => {
  try {
    const { data } = await axios.get(`/api/room-reviews/${roomId}`);
    console.log(`Found ${data.length} reviews:`, data);
  } catch (error) {
    console.error('Failed to fetch reviews:', error.response?.data);
  }
};
```

---

## User Registration

### Sign Up (Email/Password)

#### POST `/api/sanity/signUp`

Creates a new user account with email and password credentials.

**Authentication:** Not required

**Handled by:** `next-auth-sanity` adapter

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response:**
User document created in Sanity and can now log in via `/api/auth/signin`.

**Note:** This endpoint is managed by the `next-auth-sanity` adapter. Refer to [NextAuth documentation](https://next-auth.js.org/) for detailed authentication flows.

---

## Error Handling

All API endpoints follow consistent error response patterns:

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Authentication required |
| 409 | Conflict | Resource conflict (e.g., room not available) |
| 500 | Internal Server Error | Server-side error |

### Error Response Format

Most endpoints return errors in JSON format:

```json
{
  "error": "Error message description"
}
```

Some endpoints (legacy) return plain text:
```
"Error message description"
```

---

## Data Models

### Booking Object

```typescript
interface Booking {
  _id: string;
  user: {
    _type: 'reference';
    _ref: string; // User ID
  };
  hotelRoom: {
    _type: 'reference';
    _ref: string; // Room ID
  };
  checkinDate: string; // ISO date
  checkoutDate: string; // ISO date
  numberOfDays: number;
  adults: number;
  children: number;
  quantity: number;
  totalPrice: number;
  discount: number;
}
```

### Review Object

```typescript
interface Review {
  _id: string;
  user: {
    _type: 'reference';
    _ref: string; // User ID
  };
  hotelRoom: {
    _type: 'reference';
    _ref: string; // Room ID
  };
  text: string;
  userRating: number; // 1-5
  _createdAt: string; // ISO timestamp
}
```

### User Object

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  image?: string; // URL
  about?: string;
  isAdmin: boolean;
  _createdAt: string; // ISO timestamp
}
```

### Room Object

```typescript
interface Room {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  quantity: number; // Total available rooms
  type: 'Deluxe' | 'Premium' | 'Suite' | 'Presidential';
  dimension: string;
  numberOfBeds: number;
  coverImage: {
    url: string;
  };
  images: Array<{
    url: string;
  }>;
  offeredAmenities: Array<{
    icon: string;
    amenity: string;
  }>;
  specialNote: string;
  isFeatured: boolean;
}
```

---

## Rate Limiting

Currently, there is **no rate limiting** implemented on API endpoints. For production deployment, consider implementing rate limiting using:
- Vercel Edge Functions rate limiting
- Custom middleware with Redis
- Third-party services like Upstash Rate Limit

---

## CORS Configuration

The API is configured for same-origin requests. If you need to access the API from a different domain, configure CORS in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
      ],
    },
  ];
}
```

---

## Webhooks

Currently, **no webhooks** are implemented. Future considerations:
- Sanity webhooks for content changes
- Payment webhooks (if payment integration is added)
- Booking confirmation emails

---

## API Best Practices

### Authentication
- Always check session validity on protected routes
- Use `getServerSession(authOptions)` on server-side
- Use `useSession()` hook on client-side

### Data Fetching
- Use SWR for client-side data fetching (with caching)
- Set appropriate cache strategies (`cache: 'no-cache'` for development)
- Implement revalidation strategies for production

### Error Handling
```typescript
try {
  const { data } = await axios.post('/api/endpoint', payload);
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data);
    // Show user-friendly error message
  }
}
```

### Date Formatting
Always use ISO 8601 format for dates:
```typescript
const date = new Date('2025-12-01');
const isoDate = date.toISOString().split('T')[0]; // "2025-12-01"
```

---

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Sanity.io API Documentation](https://www.sanity.io/docs/http-api)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## Support

For API issues or questions:
1. Check the error response for specific details
2. Review the relevant endpoint documentation above
3. Contact the development team
4. Create an issue in the repository

---

**Last Updated:** November 29, 2025
**API Version:** 1.0.0
**Maintained by:** Development Team
