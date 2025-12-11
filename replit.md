# Restaurant Ordering Platform

## Overview

A modern, mobile-first digital ordering platform for restaurants, designed for QR-code based table ordering and online pickup/delivery. The application features a vibrant, animated interface inspired by modern food delivery platforms (DoorDash, Uber Eats) combined with sleek SaaS interactions (Linear, Notion). Built as a full-stack TypeScript application with React frontend and Express backend.

The platform enables guests to browse menus, add items to cart, track orders in real-time, and complete purchases without waiting for a server. The system is optimized for the restaurant "Karahi Point" but can be adapted for any dining establishment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** React Context API for cart state, TanStack Query for server state
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI primitives with shadcn/ui component library
- **Build Tool:** Vite with hot module replacement

**Design System:**
- Custom Tailwind configuration with extended color palette and spacing
- Component library following the "New York" shadcn/ui style
- CSS custom properties for theming with light/dark mode support
- Mobile-first responsive design approach
- Rich animations using Tailwind utilities and CSS transitions

**Key Architectural Decisions:**
- Single-page application (SPA) architecture for smooth transitions
- Component-driven development with reusable UI primitives
- Local storage for cart persistence across sessions
- Optimistic UI updates for better perceived performance
- Separated component examples for development/testing

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** Firebase Firestore (sole database)
- **Authentication:** Firebase Authentication

**Project Structure:**
- `server/` - Express server implementation
- `shared/` - Shared TypeScript types and schemas (used by both client and server)
- `client/` - React frontend application
- Monorepo structure with path aliases for clean imports

**API Design:**
- RESTful API endpoints prefixed with `/api`
- JSON request/response format
- Request logging middleware with duration tracking
- Error handling with appropriate HTTP status codes

**Storage Layer:**
- Interface-based storage design (`IStorage`) for flexibility
- All data stored in Firebase Firestore collections
- Zod schemas for validation in `shared/schema.ts`
- UUID-based primary keys for all entities

**Firestore Services:**
- `server/firebase-admin.ts` - Firebase Admin initialization
- `server/firestoreUserService.ts` - User CRUD operations
- `server/firestoreMenuService.ts` - Menu items CRUD operations
- `server/firestoreOrderService.ts` - Orders CRUD operations
- `server/storage.ts` - FirestoreStorage class implementing IStorage interface

**Key Architectural Decisions:**
- Separation of concerns between routes, storage, and business logic
- Firebase Firestore as the sole database (no PostgreSQL)
- Build process bundles backend with esbuild for production deployment
- Development mode uses tsx for TypeScript execution without compilation

### Database Design (Firestore Collections)

**Collections:**
- `users` - User accounts with Firebase auth sync
- `orders` - Customer orders with status tracking
- `menuItems` - Restaurant menu items

**Required Environment Variables:**
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Server-side Firebase Admin SDK credentials
- `VITE_FIREBASE_API_KEY` - Client-side Firebase API key
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI - Headless UI primitives for accessibility
- Embla Carousel - Carousel/slider functionality
- cmdk - Command palette component
- Lucide React - Icon library
- date-fns - Date manipulation utilities

**Development Tools:**
- Replit-specific plugins for development environment
  - Runtime error overlay
  - Cartographer (code navigation)
  - Dev banner
- TypeScript with strict mode enabled
- ESBuild for production builds
- PostCSS with Tailwind and Autoprefixer

**State Management:**
- TanStack Query (React Query) - Server state synchronization
- React Hook Form with Zod resolvers - Form validation

**Styling:**
- Tailwind CSS v3
- class-variance-authority - Component variant management
- clsx + tailwind-merge - Conditional class name utilities

**Build & Development:**
- Vite development server with middleware mode for API proxy
- HMR (Hot Module Replacement) over HTTP server
- TypeScript path aliases configured in both tsconfig and Vite

**Assets:**
- Generated images stored in `attached_assets/generated_images/`
- Stock images stored in `attached_assets/stock_images/` (biryani, tikka, curry, naan)
- Food photography for dishes (Chicken Karahi, BBQ, Biryani, etc.)
- Static assets resolved via Vite alias `@assets`

**Animation Library:**
- Framer Motion for component transitions and interactions
- Restrained animation durations (0.4-1.2s) for professional feel

**Key Integration Points:**
- No external payment processing (yet to be implemented)
- Firebase Authentication for user sign-in
- No email/SMS notifications (yet to be implemented)
- No real-time websockets (polling-based updates)

## Recent Changes

- **December 11, 2025:** Migrated from PostgreSQL/Drizzle to Firebase Firestore only
  - Removed all PostgreSQL dependencies (@neondatabase/serverless, pg, drizzle-orm, drizzle-kit)
  - Created FirestoreUserService for user data management
  - Updated shared/schema.ts to use plain TypeScript interfaces with Zod validation
  - Updated storage.ts to use FirestoreStorage class
