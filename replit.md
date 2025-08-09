# Overview

SplitEase is a Gen-Z focused expense splitting application that allows users to create groups, split expenses among friends, and track balances. The app features a mobile-first design with a modern UI built using React, TypeScript, and a comprehensive component library. It provides functionality for user authentication, group management, expense tracking, and settlement management with real-time balance calculations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for client-side routing with mobile-optimized navigation
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with structured error handling
- **Session Management**: Express session with PostgreSQL session store
- **Authentication**: Replit Auth integration with OpenID Connect

## Mobile-First Design
- **Responsive Layout**: Mobile-optimized with max-width container (max-w-sm)
- **Navigation**: Bottom navigation bar for authenticated users
- **Progressive Web App**: Configured for mobile app-like experience
- **Touch Interactions**: Optimized for mobile gestures and interactions

## Database Schema
- **Users**: Profile management with social login integration
- **Groups**: Expense group management with member relationships
- **Expenses**: Individual expense tracking with split calculations
- **Settlements**: Payment reconciliation between users
- **Sessions**: Secure session storage for authentication

## Component Architecture
- **Atomic Design**: Reusable UI components with consistent styling
- **Custom Components**: Specialized components for expense tracking (ActivityItem, GroupCard, ExpenseForm)
- **Layout Components**: Mobile-first layout with bottom navigation
- **Form Components**: Integrated form handling with validation

# External Dependencies

## Database
- **Neon Database**: PostgreSQL serverless database with connection pooling
- **Drizzle ORM**: Type-safe database operations with schema validation

## Authentication
- **Replit Auth**: OpenID Connect authentication provider
- **Session Storage**: PostgreSQL-backed session management with connect-pg-simple

## UI Components
- **Radix UI**: Accessible component primitives for complex UI patterns
- **shadcn/ui**: Pre-styled component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool with hot module replacement and optimized bundling
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation for forms and API data

## Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **CSS Variables**: Theme system with light/dark mode support
- **Google Fonts**: Inter font family for modern typography

## Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class composition
- **nanoid**: Unique ID generation for components