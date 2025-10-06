# TaxEase – Nigeria Tax Calculator

## Overview

TaxEase is a responsive web application that helps Nigerians estimate their personal income and digital asset taxes under the 2025 Nigeria Tax Reform Act (effective January 2026). The application provides calculations for both the new 2025 reform rules and legacy pre-2025 Finance Act rules, allowing users to compare tax obligations under different regimes.

The calculator handles employment income, business/freelance income, cryptocurrency gains, and various deductions including rent relief, pension contributions, NHF contributions, and other allowable deductions. It applies progressive Personal Income Tax (PIT) rates with exemptions and relief caps specific to Nigerian tax law.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: Radix UI primitives with shadcn/ui component library configured in "new-york" style. The application uses a comprehensive set of pre-built accessible components including dialogs, dropdowns, forms, sidebars, and toast notifications.

**Styling**: Tailwind CSS with custom design tokens configured for a dark mode financial application aesthetic. The color palette features Nigerian Green (HSL 152 100% 27%) as the primary brand color, with carefully defined neutral grays for backgrounds, cards, and borders. The design follows a "clarity first" principle appropriate for financial calculations.

**State Management**: React hooks for local component state, with TanStack Query (React Query) configured for server state management. LocalStorage is used for persisting user input data across sessions.

**Routing**: Wouter for client-side routing (lightweight alternative to React Router)

**Form Handling**: React Hook Form with Zod schema validation via @hookform/resolvers

### Backend Architecture

**Server Framework**: Express.js running on Node.js

**API Structure**: RESTful API with routes prefixed under `/api`. The server is configured with JSON body parsing and URL-encoded form data support. Currently implements a minimal routing structure with placeholder storage interfaces.

**Development Tools**: Vite middleware integration for HMR (Hot Module Replacement) in development mode, with custom error overlays and development banners for Replit environment

**Build Process**: 
- Client: Vite builds the React application to `dist/public`
- Server: esbuild bundles the Express server to `dist/index.js` with ESM format

### Data Storage

**Database**: PostgreSQL configured through Drizzle ORM

**ORM**: Drizzle ORM with schema definition in TypeScript. Currently implements a basic users table with UUID primary keys, username, and password fields.

**Database Provider**: Neon Database serverless PostgreSQL (@neondatabase/serverless)

**Migrations**: Drizzle Kit configured to output migrations to `./migrations` directory

**Session Storage**: connect-pg-simple for PostgreSQL-backed session storage

**Schema Validation**: Drizzle-Zod integration for runtime schema validation

Note: The application currently uses in-memory storage (MemStorage class) for development, with database infrastructure configured but not yet actively integrated into the tax calculation features.

### Design System

The application follows strict design guidelines defined in `design_guidelines.md`:

**Typography**: Inter and Poppins font families with a carefully scaled type system (H1: 32px, H2: 24px, Body: 15px)

**Color Semantic**: 
- Success states use green (HSL 142 76% 36%)
- Warnings use amber (HSL 38 92% 50%)
- Errors use red (HSL 0 84% 60%)

**Layout**: Consistent spacing using Tailwind units (2, 4, 6, 8) with component padding of p-6 or p-8

**Responsive Strategy**: Mobile-first approach with sidebar toggle for smaller screens, desktop sidebar navigation for larger viewports

### Component Architecture

**Key Custom Components**:
- `TaxCalculatorForm`: Main form handling all tax inputs and calculation logic
- `AppSidebar`: Navigation sidebar with mode toggle (2025 Reform vs Legacy)
- `CurrencyInput`: Specialized input with Nigerian Naira (₦) formatting
- `CryptoInputs`: Grouped inputs for cryptocurrency transaction details
- `TaxResults`: Display component for calculated tax obligations with PDF export capability
- `ModeToggle`: Mode switcher between tax calculation regimes

All components use TypeScript with proper prop typing and follow the shadcn/ui patterns for composition and styling.

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless UI primitives (@radix-ui/react-*) for accessible component foundation
- **cmdk**: Command menu component for keyboard-driven interfaces
- **Lucide React**: Icon library for consistent iconography
- **embla-carousel-react**: Carousel/slider functionality
- **class-variance-authority**: CSS variant management utility
- **tailwind-merge & clsx**: Utility functions for conditional class name composition

### Development & Build Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Fast JavaScript bundler for server-side code
- **TypeScript**: Type safety across the application
- **PostCSS & Autoprefixer**: CSS processing pipeline
- **Replit-specific plugins**: Runtime error modal, cartographer, dev banner for Replit environment integration

### Database & Data Management
- **Drizzle ORM**: Type-safe database ORM
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle Kit**: Database migration management
- **Drizzle Zod**: Schema validation integration
- **connect-pg-simple**: PostgreSQL session store for Express

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Integrates Zod with React Hook Form

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library

### Server Infrastructure
- **Express**: Web application framework
- **Node.js**: JavaScript runtime environment

The application is configured to run in both development (with Vite HMR) and production modes, with environment-specific optimizations and tooling.