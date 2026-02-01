# Developer Guide

This guide provides comprehensive information for developers working on the Hotel Management Application. It covers architecture, development workflows, best practices, and common tasks.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Code Organization](#code-organization)
5. [Key Concepts](#key-concepts)
6. [Common Development Tasks](#common-development-tasks)
7. [Debugging](#debugging)
8. [Testing](#testing)
9. [Performance Optimization](#performance-optimization)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Code Style & Conventions](#code-style--conventions)
13. [Contributing](#contributing)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js**: v18 or higher
- **npm/yarn/pnpm**: Latest version
- **Git**: For version control
- **VS Code** (recommended): With TypeScript and ESLint extensions

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hotel-management-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy `.env.example` to `.env.local` (if available) or create `.env.local`:
   ```env
   # Sanity CMS
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_STUDIO_TOKEN=your_token

   # NextAuth
   NEXTAUTH_SECRET=generate_random_secret
   NEXTAUTH_URL=http://localhost:3000

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Main app: http://localhost:3000
   - Sanity Studio: http://localhost:3000/studio

---

## Project Architecture

### Tech Stack Overview

```
┌─────────────────────────────────────────┐
│           Next.js 15 (App Router)       │
│  ┌─────────────────────────────────┐   │
│  │  React 19 Components + TypeScript│   │
│  │  ┌──────────────────────────┐   │   │
│  │  │   Tailwind CSS Styling    │   │   │
│  │  └──────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│        Next.js API Routes (Serverless)  │
│  ┌─────────────────────────────────┐   │
│  │     NextAuth Authentication     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              ↕
┌─────────────────────────────────────────┐
│           Sanity CMS (Headless)         │
│  ┌─────────────────────────────────┐   │
│  │  Content Storage & Management   │   │
│  │  GROQ Queries                   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Architecture Patterns

#### 1. App Router Structure (Next.js 15)

The project uses Next.js App Router with route groups:

```
src/app/
├── (cms)/          # CMS route group (different layout)
│   └── studio/     # Sanity Studio
└── (web)/          # Main app route group
    ├── layout.tsx  # Root layout with providers
    ├── page.tsx    # Homepage
    ├── auth/       # Authentication page
    ├── rooms/      # Room listing and details
    └── users/[id]/ # User dashboard (protected)
```

#### 2. Data Fetching Strategy

- **Server Components**: Fetch data directly in components using Sanity client
- **Client Components**: Use SWR for client-side data fetching with caching
- **API Routes**: Handle mutations and authenticated operations

#### 3. State Management

- **Server State**: SWR for caching and revalidation
- **UI State**: React hooks (`useState`, `useCallback`, `useContext`)
- **Global State**: Context API (ThemeContext for dark mode, LanguageContext for EN/VI)
- **Session State**: NextAuth session management

#### 4. Authentication Flow

```
User Login Request
    ↓
NextAuth Middleware (/api/auth/[...nextauth])
    ↓
Google OAuth OR Credentials Provider
    ↓
next-auth-sanity Adapter
    ↓
Sanity User Document (Create/Update)
    ↓
JWT Session Created (HTTP-only cookie)
    ↓
Session Available via useSession() hook
```

#### 5. Internationalization (i18n)

The app supports English and Vietnamese using a lightweight custom solution (no external i18n library).

**Architecture:**
- `LanguageContext` — stores `"en" | "vi"` state, persisted in `localStorage` (`hotel-language` key)
- `LanguageProvider` — wraps the app alongside `ThemeProvider` and `AuthProvider`
- `translations.ts` — central dictionary mapping keys to EN/VI strings; exports a `useTranslation()` hook

**Usage in components:**
```tsx
'use client';
import { useTranslation } from '@/libs/translations';

export default function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("hero.title")}</h1>;
}
```

**CMS content:** Room fields have optional Vietnamese variants (`name_vi`, `description_vi`, `specialNote_vi`). Components check the current language and fall back to the English field when the Vietnamese variant is empty.

**Currency:** Rooms have an optional `price_vnd` field. When language is `vi` and `price_vnd` is set, prices display as `₫1,500,000`; otherwise they show in USD (`$`).

---

## Development Workflow

### Branch Strategy

```
main          # Production-ready code
  ├── develop # Development branch
      ├── feature/booking-system
      ├── feature/review-system
      ├── bugfix/date-validation
      └── hotfix/security-patch
```

**Naming Conventions:**
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Production hotfixes
- `refactor/component-name` - Code refactoring

### Development Process

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally:**
   ```bash
   npm run dev
   npm run lint
   ```

3. **Commit with descriptive messages:**
   ```bash
   git add .
   git commit -m "feat: add room quantity selection to booking form"
   ```

   **Commit Message Prefixes:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `refactor:` - Code refactoring
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `test:` - Adding/updating tests
   - `chore:` - Maintenance tasks

4. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Code Review:**
   - All PRs require review before merging
   - Address review comments
   - Ensure CI/CD passes

---

## Code Organization

### Directory Structure Explained

```
hotel-management-app/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (cms)/             # CMS-specific routes
│   │   ├── (web)/             # Public-facing routes
│   │   └── api/               # API endpoints
│   │
│   ├── components/            # React components
│   │   ├── Header/           # Component with its own directory
│   │   │   ├── Header.tsx    # Main component
│   │   │   └── index.ts      # Export barrel
│   │   └── BackDrop.tsx      # Single-file component
│   │
│   ├── context/              # React contexts
│   │   ├── themeContext.ts   # Dark mode context
│   │   └── languageContext.ts # Language (EN/VI) context
│   │
│   ├── libs/                 # Utility libraries
│   │   ├── sanity.ts         # Sanity client config
│   │   ├── auth.ts           # NextAuth config
│   │   ├── apis.ts           # API helper functions
│   │   ├── sanityQueries.ts  # GROQ query definitions
│   │   └── translations.ts   # i18n dictionary & useTranslation hook
│   │
│   └── models/               # TypeScript types/interfaces
│       ├── room.ts
│       ├── booking.ts
│       ├── user.ts
│       └── review.ts
│
├── schemaTypes/              # Sanity schema definitions
│   ├── index.ts
│   ├── user.ts
│   ├── hotelRoom.ts
│   ├── booking.ts
│   └── review.ts
│
├── src/sanity/plugins/       # Custom Sanity Studio plugins
│   └── bookingCalendar.tsx   # Booking calendar tool (check-in/out tracking)
│
├── public/                   # Static assets
│   └── images/
│
└── Configuration files
    ├── next.config.ts        # Next.js config
    ├── sanity.config.ts      # Sanity Studio config
    ├── tailwind.config.ts    # Tailwind CSS config
    ├── tsconfig.json         # TypeScript config
    └── eslint.config.mjs     # ESLint config
```

### File Naming Conventions

- **Components**: PascalCase (`Header.tsx`, `BookRoomCta.tsx`)
- **Utilities**: camelCase (`apis.ts`, `sanityQueries.ts`)
- **Types/Models**: camelCase (`room.ts`, `booking.ts`)
- **Pages**: lowercase (`page.tsx`, `layout.tsx`)
- **API Routes**: lowercase (`route.ts`)

---

## Key Concepts

### 1. Server vs Client Components

**Server Components (Default):**
```tsx
// src/app/(web)/rooms/page.tsx
import { getRooms } from '@/libs/apis';

export default async function RoomsPage() {
  const rooms = await getRooms(); // Fetch directly

  return <div>{/* Render rooms */}</div>;
}
```

**Client Components:**
```tsx
'use client'; // Must have this directive

import { useState } from 'react';

export default function BookingForm() {
  const [date, setDate] = useState(new Date());

  return <div>{/* Interactive form */}</div>;
}
```

**When to use Client Components:**
- Need hooks (`useState`, `useEffect`, `useContext`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)
- Third-party libraries requiring client-side

### 2. Data Fetching with SWR

```tsx
'use client';

import useSWR from 'swr';
import { getRoomReviews } from '@/libs/apis';

export default function Reviews({ roomId }: { roomId: string }) {
  const { data, error, isLoading } = useSWR(
    `/api/room-reviews/${roomId}`,
    () => getRoomReviews(roomId)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reviews</div>;

  return <div>{/* Render reviews */}</div>;
}
```

**SWR Benefits:**
- Automatic caching
- Revalidation on focus
- Polling/refetching
- Optimistic updates

### 3. GROQ Queries (Sanity)

GROQ is Sanity's query language. Examples:

**Basic Query:**
```groq
*[_type == "hotelRoom" && isFeatured == true][0] {
  _id,
  name,
  slug,
  description,
  price,
  coverImage
}
```

**Join with References:**
```groq
*[_type == "booking" && user._ref == $userId] {
  _id,
  checkinDate,
  checkoutDate,
  hotelRoom -> {
    _id,
    name,
    slug,
    price
  }
}
```

**Conditional Filtering:**
```groq
*[_type == "booking" &&
  hotelRoom._ref == $roomId &&
  (checkinDate <= $checkin && checkoutDate > $checkin)
]
```

**Image URL Resolution (coalesce pattern):**

Room images support both external URLs and Sanity file uploads. GROQ queries use `coalesce` to resolve whichever is populated:
```groq
"coverImage": coverImage {
    "url": coalesce(url, file.asset->url)
}
"images": images[] {
    _key,
    "url": coalesce(url, file.asset->url)
}
```

### 4. NextAuth Session Management

**Server-side:**
```tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/libs/auth';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  // Use userId...
}
```

**Client-side:**
```tsx
'use client';

import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not logged in</div>;

  return <div>Welcome {session.user.name}</div>;
}
```

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Create route file:**
   ```
   src/app/api/your-endpoint/route.ts
   ```

2. **Implement handler:**
   ```typescript
   import { NextResponse } from 'next/server';
   import { getServerSession } from 'next-auth';
   import { authOptions } from '@/libs/auth';

   export async function GET(req: Request) {
     const session = await getServerSession(authOptions);

     if (!session) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     try {
       // Your logic here
       return NextResponse.json({ data: 'success' }, { status: 200 });
     } catch (error) {
       return NextResponse.json({ error: 'Failed' }, { status: 500 });
     }
   }
   ```

3. **Add helper function in `libs/apis.ts`:**
   ```typescript
   export async function yourApiFunction() {
     const { data } = await axios.get('/api/your-endpoint');
     return data;
   }
   ```

### Adding a New Page

1. **Create page directory:**
   ```
   src/app/(web)/your-page/page.tsx
   ```

2. **Implement page:**
   ```tsx
   export default function YourPage() {
     return (
       <div>
         <h1>Your Page</h1>
       </div>
     );
   }
   ```

3. **Add navigation link in Header:**
   ```tsx
   <Link href="/your-page">Your Page</Link>
   ```

### Adding a New Component

1. **Create component directory:**
   ```
   src/components/YourComponent/
   ```

2. **Create component file:**
   ```tsx
   // src/components/YourComponent/YourComponent.tsx
   import React from 'react';

   interface YourComponentProps {
     title: string;
   }

   export default function YourComponent({ title }: YourComponentProps) {
     return <div>{title}</div>;
   }
   ```

3. **Create barrel export:**
   ```typescript
   // src/components/YourComponent/index.ts
   export { default } from './YourComponent';
   ```

4. **Use component:**
   ```tsx
   import YourComponent from '@/components/YourComponent';

   <YourComponent title="Hello" />
   ```

### Adding a Sanity Schema

1. **Create schema file:**
   ```typescript
   // schemaTypes/yourSchema.ts
   export default {
     name: 'yourType',
     title: 'Your Type',
     type: 'document',
     fields: [
       {
         name: 'name',
         title: 'Name',
         type: 'string',
         validation: (Rule: any) => Rule.required(),
       },
       // More fields...
     ],
   };
   ```

2. **Export in index:**
   ```typescript
   // schemaTypes/index.ts
   import yourSchema from './yourSchema';

   export const schemaTypes = [
     // ... existing schemas
     yourSchema,
   ];
   ```

3. **Use in GROQ queries:**
   ```typescript
   // libs/sanityQueries.ts
   export const getYourDataQuery = `*[_type == "yourType"] { ... }`;
   ```

### Modifying the Database Schema

1. **Update schema in `schemaTypes/`**
2. **Deploy to Sanity:**
   ```bash
   # Automatically deployed when you save in Sanity Studio
   # Access Studio at /studio
   ```
3. **Update TypeScript types in `src/models/`**
4. **Update GROQ queries if needed**

### Adding a Custom Sanity Studio Tool

Custom tools appear in the Studio's top navigation bar alongside "Structure" and "Vision".

1. **Create the plugin file** in `src/sanity/plugins/`:
   ```tsx
   import { definePlugin, type Tool } from 'sanity'
   import { SomeIcon } from '@sanity/icons'

   function MyToolComponent() {
     const client = useClient({ apiVersion: '2024-01-01' })
     // Fetch data, render UI...
   }

   export const myPlugin = definePlugin({
     name: 'my-tool',
     tools: [{
       name: 'my-tool',
       title: 'My Tool',
       icon: SomeIcon,
       component: MyToolComponent,
     }],
   })
   ```

2. **Register in `sanity.config.ts`:**
   ```typescript
   import { myPlugin } from './src/sanity/plugins/myPlugin'

   plugins: [structureTool(), visionTool(), myPlugin()],
   ```

**Existing custom tools:**
- **Booking Calendar** (`bookingCalendar.tsx`) — Monthly calendar showing check-ins/check-outs with admin check-off functionality

---

## Debugging

### Useful Debugging Tools

**1. Next.js Dev Tools:**
- React Developer Tools (browser extension)
- Next.js built-in error overlay
- Console logs in API routes

**2. Sanity Vision:**
- Access at `/studio/vision`
- Test GROQ queries
- Inspect document structure

**3. Network Tab:**
- Monitor API calls
- Check request/response payloads
- Verify authentication headers

### Common Issues & Solutions

#### Issue: Session not available
```typescript
// Check if providers are set up correctly
// src/app/(web)/layout.tsx
import AuthProvider from '@/components/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

#### Issue: Sanity client undefined
```typescript
// Ensure environment variables are set
// NEXT_PUBLIC_SANITY_PROJECT_ID
// NEXT_PUBLIC_SANITY_DATASET

// Check sanity.ts configuration
import { createClient } from 'next-sanity';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2022-03-07',
});

export default sanityClient;
```

#### Issue: TypeScript errors in components
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart TypeScript server in VS Code
Cmd+Shift+P → TypeScript: Restart TS Server
```

---

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Google OAuth login works
- [ ] Email/password registration works
- [ ] Session persists across page reloads
- [ ] Protected routes redirect to login

**Booking System:**
- [ ] Date picker shows blocked dates correctly
- [ ] Availability updates in real-time
- [ ] Booking validates date ranges
- [ ] Quantity selection works
- [ ] Price calculation is accurate
- [ ] Booking confirmation shows correct details

**Reviews:**
- [ ] Users can submit reviews
- [ ] Reviews display correctly
- [ ] Updating reviews works
- [ ] Cannot submit duplicate reviews

**Language / i18n:**
- [ ] Language toggle switches all UI text between EN and VI
- [ ] CMS content (room name, description) shows Vietnamese when `_vi` fields are populated
- [ ] CMS content falls back to English when `_vi` fields are empty
- [ ] VND prices display with `₫` symbol and locale formatting when VI is selected
- [ ] USD prices display when EN is selected or `price_vnd` is not set
- [ ] Language preference persists across page reloads (localStorage)
- [ ] No hydration mismatch warnings in console

**UI/UX:**
- [ ] Dark mode toggle works
- [ ] Responsive on mobile devices
- [ ] Images load correctly
- [ ] Forms validate input
- [ ] Toast notifications appear

### Future Testing Strategies

Consider implementing:
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright or Cypress
- **API Tests**: Supertest or Postman
- **E2E Tests**: Playwright

---

## Performance Optimization

### Current Optimizations

1. **Image Optimization:**
   - Next.js `<Image>` component (auto-optimization)
   - Lazy loading images

2. **Data Fetching:**
   - SWR caching reduces redundant requests
   - Server-side rendering for initial load

3. **Code Splitting:**
   - Automatic with Next.js App Router
   - Dynamic imports for heavy components

### Recommended Improvements

1. **Enable ISR (Incremental Static Regeneration):**
   ```typescript
   // src/libs/apis.ts
   const result = await sanityClient.fetch(
     query,
     params,
     { next: { revalidate: 3600 } } // Revalidate every hour
   );
   ```

2. **Optimize GROQ Queries:**
   - Only fetch required fields
   - Use projections to limit data
   - Avoid nested references when possible

3. **Add Loading States:**
   - Implement skeleton loaders
   - Suspense boundaries

4. **Bundle Analysis:**
   ```bash
   npm install @next/bundle-analyzer
   ```

---

## Deployment

### Deploying to Vercel

1. **Push code to GitHub**
2. **Import project in Vercel**
3. **Add environment variables in Vercel dashboard**
4. **Deploy**

**Environment Variables Required:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_STUDIO_TOKEN`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (production URL)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### Production Checklist

- [ ] All environment variables set
- [ ] OAuth redirect URLs updated for production
- [ ] Sanity CORS settings allow production domain
- [ ] ISR/caching strategies implemented
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] Analytics configured
- [ ] SEO meta tags added
- [ ] Sitemap generated
- [ ] robots.txt configured

---

## Troubleshooting

### Sanity Studio not loading

**Solution:**
```bash
# Check if Sanity config is correct
cat sanity.config.ts

# Ensure dependencies are installed
npm install sanity @sanity/vision
```

### OAuth not working in production

**Solution:**
- Verify OAuth redirect URIs in Google Console include production URL
- Check `NEXTAUTH_URL` environment variable is set to production URL
- Ensure `NEXTAUTH_SECRET` is properly generated and set

### Build fails on Vercel

**Solution:**
- Check build logs for specific errors
- Ensure all environment variables are set
- Verify TypeScript has no errors: `npm run build` locally

---

## Code Style & Conventions

### TypeScript

- Use TypeScript for all new files
- Define interfaces for component props
- Avoid `any` type (use `unknown` if necessary)
- Use type inference when possible

### React

- Use functional components (no class components)
- Use hooks for state management
- Extract reusable logic into custom hooks
- Keep components small and focused

### Styling

- Use Tailwind utility classes
- Follow mobile-first responsive design
- Use theme context for dark mode
- Avoid inline styles (use Tailwind)

### Imports

```typescript
// Order: React → External → Internal → Relative
import React from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { Room } from '@/models/room';
import { getRooms } from '@/libs/apis';

import './styles.css';
```

---

## Contributing

### Pull Request Process

1. Create a feature branch
2. Make changes with clear commit messages
3. Test thoroughly
4. Update documentation if needed
5. Submit PR with description
6. Address review comments
7. Merge after approval

### Code Review Guidelines

**Reviewers should check:**
- Code follows style conventions
- No TypeScript errors
- Proper error handling
- Performance considerations
- Security best practices
- Documentation updated

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Sanity Documentation](https://www.sanity.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated:** February 1, 2026
**Maintained by:** Development Team
