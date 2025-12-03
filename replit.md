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
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL (via Neon serverless)
- **Session Management:** connect-pg-simple for PostgreSQL-backed sessions

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
- In-memory storage implementation (`MemStorage`) for development
- Database schema defined using Drizzle ORM with Zod validation
- UUID-based primary keys for all entities

**Key Architectural Decisions:**
- Separation of concerns between routes, storage, and business logic
- Environment-based configuration (DATABASE_URL from environment)
- Build process bundles backend with esbuild for production deployment
- Development mode uses tsx for TypeScript execution without compilation

### Database Design

**Current Schema:**
- Users table with Firebase authentication sync
- Orders table for order management
- Schema defined in `shared/schema.ts` for type safety across stack
- Drizzle migrations stored in `migrations/` directory

**Database Provider:**
- Neon serverless PostgreSQL for users and orders
- Connection pooling handled by `@neondatabase/serverless`
- Schema synchronization via `drizzle-kit push` command

**Firestore Integration (Menu Items):**
- Menu items are stored in Firebase Firestore (collection: `menuItems`)
- Server-side Firebase Admin SDK for secure Firestore access
- `server/firebase-admin.ts` - Firebase Admin initialization
- `server/firestoreMenuService.ts` - CRUD operations for menu items
- Requires `FIREBASE_SERVICE_ACCOUNT_KEY` secret for server-side access

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