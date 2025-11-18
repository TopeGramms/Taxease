# AGENTS.md - TaxEase Development History

## Project Overview

**TaxEase** is a responsive web application designed to help Nigerian citizens calculate their personal income and digital asset taxes under the 2025 Nigeria Tax Reform Act (effective January 2026). The application provides dual-mode calculations supporting both the new 2025 reform rules and legacy pre-2025 Finance Act rules for comparison.

**Live URL**: https://taxease-lemon.vercel.app

## Initial Project Setup

### Commit: Added .env
**Author**: Adekalu Temitope (hardekhalu@gmail.com)  
**Date**: November 10, 2025  
**Commit Hash**: 6f49b197d5c9a5d5b9235e4f81d88e3ef3e70097

This initial commit established the complete foundation for the TaxEase application, implementing a full-stack React + Express architecture with comprehensive UI components and tax calculation logic.

#### Core Features Implemented

**Tax Calculation Modes**:
- 2025 Reform Tax System with progressive brackets (7% to 25%)
- Legacy tax calculation system for comparison
- Support for multiple income sources: employment, business/freelance, cryptocurrency gains
- Comprehensive deductions and reliefs system including rent relief, pension contributions, NHF contributions
- Small company exemption (turnover ≤ ₦100m)

**User Interface Components**:
- Responsive sidebar navigation with mode toggle (2025 Reform vs Legacy)
- Custom currency input component with Nigerian Naira (₦) formatting
- Cryptocurrency transaction input form (buy price, sell price, quantity)
- Tax results display with breakdown of total tax owed and after-tax income
- WhatsApp support button integration
- Mobile-optimized layout with collapsible sidebar

**Tax Calculation Logic**:

*2025 Reform System*:
- Tax-free threshold: ₦800,000 per annum
- Progressive tax brackets:
  - 0-300k: 7%
  - 300k-600k: 11%
  - 600k-1.1m: 15%
  - 1.1m-1.6m: 19%
  - 1.6m-3.2m: 21%
  - 3.2m-6.4m: 24%
  - Above 6.4m: 25%
- Rent relief: 20% of rent paid, capped at ₦500,000
- Full deductibility for pension, NHF, and other allowable contributions

*Legacy System*:
- Flat rates: 10% salary, 15% business, 10% crypto
- No exemptions or progressive structure

#### Technical Stack

**Frontend**:
- React 18.3.1 with TypeScript
- Vite 5.4.20 for build tooling
- Tailwind CSS 3.4.17 for styling
- shadcn/ui component library (new-york style)
- Radix UI primitives for accessibility
- Wouter 3.3.5 for routing
- TanStack Query 5.60.5 for state management
- React Hook Form 7.55.0 with Zod validation

**Backend**:
- Express 4.21.2 server
- Node.js runtime
- PostgreSQL 16 with Drizzle ORM 0.39.1
- Neon Database serverless connector
- Express session management with connect-pg-simple

**UI Component Library**:
- Complete shadcn/ui implementation with 40+ components
- Lucide React 0.453.0 for icons
- Framer Motion 11.13.1 for animations
- Recharts 2.15.2 for potential data visualization
- Embla Carousel for sliders

**Development Tools**:
- TypeScript 5.6.3
- Drizzle Kit for database migrations
- ESBuild for server bundling
- Replit-specific plugins for development environment

#### File Structure

```
/client
  /src
    /components
      - AppSidebar.tsx (navigation)
      - TaxCalculatorForm.tsx (main form logic)
      - TaxResults.tsx (results display)
      - CurrencyInput.tsx (formatted input)
      - CryptoInputs.tsx (crypto transaction form)
      - WhatsAppButton.tsx (support integration)
      - ModeToggle.tsx (2025 vs Legacy toggle)
      - FormSection.tsx (reusable section wrapper)
      /ui (40+ shadcn components)
    /pages
      - Home.tsx (main calculator page)
      - not-found.tsx (404 page)
    /hooks
      - use-toast.ts
      - use-mobile.tsx
    /lib
      - utils.ts
      - queryClient.ts
    - App.tsx (root component)
    - main.tsx (entry point)
    - index.css (global styles)

/server
  - index.ts (Express server setup)
  - routes.ts (API routes)
  - storage.ts (storage interface)
  - vite.ts (Vite middleware integration)

/shared
  - schema.ts (Drizzle ORM schema definitions)

Configuration Files:
  - vite.config.ts
  - tailwind.config.ts
  - drizzle.config.ts
  - tsconfig.json
  - components.json (shadcn config)
  - .replit (Replit environment config)
```

#### Design System

The application follows comprehensive design guidelines documented in `design_guidelines.md`:

**Color Palette**:
- Primary: Nigerian Green (HSL 152 100% 27% / #008751)
- Dark mode neutrals with backgrounds at 7%, 11% lightness
- Semantic colors for success (green), warning (amber), error (red)

**Typography**:
- Font families: Inter, Poppins, system-ui
- Heading scale: H1 32px, H2 24px, Body 15px
- Large numbers for tax results: 40px bold

**Component Styling**:
- Minimum touch target: 44px for mobile
- Border radius: 8px (inputs/buttons), 12px (cards)
- Consistent spacing: Tailwind units of 2, 4, 6, 8
- Container max-width: 500px for forms, 768px for main content

**Responsive Design**:
- Mobile-first approach
- Collapsible sidebar navigation
- Full-width buttons on mobile
- Optimized font scaling for small screens

#### Data Persistence

**LocalStorage Integration**:
- Form data automatically saved to `taxease-data` localStorage key
- Persists user inputs across browser sessions
- Loads previous form state on page refresh
- Privacy-focused: no server-side data storage of calculations

**Database Schema** (prepared but not yet used for tax calculations):
- Users table with UUID, username, password
- PostgreSQL connection configured via Neon Database
- Session storage configured for future authentication

#### Development Environment

**Replit Configuration**:
- Node.js 20 module
- PostgreSQL 16 module
- Web module for deployment
- Development port: 5000 (mapped to external 80)
- HMR port: 45583 (mapped to external 3000)

**Build Process**:
- Client: Vite builds to `dist/public`
- Server: esbuild bundles to `dist/index.js`
- Combined build script: `npm run build`
- Development: `npm run dev` with hot reload

**Deployment**:
- Vercel deployment configured (`.vercelignore`)
- Autoscale deployment target in Replit
- Production builds optimized for serverless environments

#### Documentation

**Project Documentation**:
- `README.md` - Public-facing project description
- `README-VERCEL.md` - Vercel deployment instructions
- `design_guidelines.md` - Complete design system specification
- `replit.md` - Comprehensive technical architecture documentation
- `attached_assets/` - Original project requirements document

#### Features Roadmap

**Implemented**:
- ✅ Dual-mode tax calculation (2025 Reform vs Legacy)
- ✅ Employment income tax calculation
- ✅ Business/freelance income support
- ✅ Cryptocurrency capital gains calculation
- ✅ Deductions and reliefs (rent, pension, NHF)
- ✅ Small company exemption
- ✅ LocalStorage data persistence
- ✅ Responsive mobile-first design
- ✅ Dark mode UI
- ✅ WhatsApp support integration
- ✅ Real-time calculation results

**Planned** (indicated by TODOs/alerts in code):
- 📋 PDF export functionality (button implemented, logic pending)
- 📋 Enhanced error handling and validation
- 📋 Tax calculation history tracking
- 📋 User authentication system (schema prepared)
- 📋 Multi-year tax comparison
- 📋 Tax planning recommendations

## Tax Calculation Details

### 2025 Reform Tax Brackets

```javascript
const brackets = [
  { limit: 300000, rate: 0.07 },    // ₦0 - ₦300,000
  { limit: 300000, rate: 0.11 },    // ₦300,001 - ₦600,000
  { limit: 500000, rate: 0.15 },    // ₦600,001 - ₦1,100,000
  { limit: 500000, rate: 0.19 },    // ₦1,100,001 - ₦1,600,000
  { limit: 1600000, rate: 0.21 },   // ₦1,600,001 - ₦3,200,000
  { limit: 3200000, rate: 0.24 },   // ₦3,200,001 - ₦6,400,000
  { limit: Infinity, rate: 0.25 },  // Above ₦6,400,000
];
```

### Deductions and Reliefs

- **Tax-free threshold**: ₦800,000 per annum
- **Rent relief**: 20% of annual rent paid, maximum ₦500,000
- **Pension contributions**: Fully deductible
- **NHF contributions**: Fully deductible
- **Other deductions**: User-defined allowable deductions
- **Small company exemption**: Zero tax for companies with turnover ≤ ₦100m

### Cryptocurrency Taxation

Capital gains calculated as: `(Sell Price - Buy Price) × Quantity`
- Only positive gains are taxed
- Integrated into total taxable income
- Same progressive rates apply in 2025 Reform mode
- Flat 10% rate in Legacy mode

## Technical Notes

### State Management Strategy

The application uses a hybrid state management approach:
- **Local component state**: React hooks for form inputs and UI state
- **Persistent state**: LocalStorage for user data across sessions
- **Server state**: TanStack Query configured (prepared for future API integration)

### Form Validation

Currently implements basic numeric validation with string-to-number conversion. Form validation uses React Hook Form with optional Zod schemas for future enhancement.

### Build Optimization

The project includes custom build scripts:
- `maybe-bundle-server.js` conditionally bundles the server for production
- Vite builds client with code splitting and tree shaking
- ESBuild provides fast server-side bundling with minimal configuration

### Environment Configuration

- Development mode uses Vite middleware with HMR
- Production mode serves static files from Express
- Environment variables managed via `.env` file (not tracked in git)
- Replit-specific configuration in `.replit` file

## Dependencies Summary

**Core Runtime** (23 dependencies):
- React ecosystem: react, react-dom, react-hook-form
- UI framework: 25+ @radix-ui/* packages, lucide-react
- Routing: wouter
- State: @tanstack/react-query
- Validation: zod, zod-validation-error
- Styling: tailwind-merge, class-variance-authority, clsx
- Backend: express, drizzle-orm, @neondatabase/serverless

**Development** (20 devDependencies):
- TypeScript compilation and type definitions
- Build tools: vite, esbuild, tsx
- CSS processing: tailwindcss, postcss, autoprefixer
- Database: drizzle-kit
- Replit plugins: vite-plugin-cartographer, dev-banner, runtime-error-modal

Total package count: 107+ including all sub-dependencies in package-lock.json

## Project Metadata

**Repository**: https://github.com/topegramms/TaxEase  
**Primary Author**: Topegramms (Adekalu Temitope)  
**License**: MIT  
**Node Version**: 20.x  
**Package Manager**: npm  
**Last Updated**: November 10, 2025  

---

*This document tracks AI-assisted and human development contributions to the TaxEase project. All commits should reference this file for historical context.*
