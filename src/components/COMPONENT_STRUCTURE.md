# Component Structure

This document outlines the organized component structure for the Boutique app.

## Organization

Components are now organized into four logical groups:

### 1. **layout/** - Layout & Navigation

Structural components used throughout the entire app:

- **Navbar.tsx** - Navigation header with search, cart, and user menu
- **Footer.tsx** - Footer with CTA, links, and bespoke creation form

**Usage:**

```typescript
import { Navbar, Footer } from "@/components";
```

---

### 2. **sections/** - Page Sections & Content

Major content sections typically used on homepage:

- **Hero.tsx** - Hero banner with call-to-action
- **FeatureStrip.tsx** - Feature highlights (eco-friendly, handcrafted, etc.)
- **Testimonials.tsx** - Customer reviews and testimonials
- **Newsletter.tsx** - Newsletter subscription form
- **WhyPipeCleaners.tsx** - Philosophy section explaining pipe cleaner flowers

**Usage:**

```typescript
import {
  Hero,
  FeatureStrip,
  Testimonials,
  Newsletter,
  WhyPipeCleaners,
} from "@/components";
```

---

### 3. **products/** - Product-Related Components

Components for displaying and browsing products:

- **ProductGrid.tsx** - Main product grid with filtering
- **CategorySection.tsx** - Category browsing tiles

**Usage:**

```typescript
import { ProductGrid, CategorySection } from "@/components";
```

---

### 4. **checkout/** - Checkout & Order Components

Components related to the checkout and order process:

- **OrderConfirmation.tsx** - Order confirmation modal

**Usage:**

```typescript
import { OrderConfirmation } from "@/components";
```

---

## Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Navbar.scss
│   │   ├── Footer.tsx
│   │   ├── Footer.scss
│   │   └── index.ts
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Hero.scss
│   │   ├── FeatureStrip.tsx
│   │   ├── FeatureStrip.scss
│   │   ├── Testimonials.tsx
│   │   ├── Testimonials.scss
│   │   ├── Newsletter.tsx
│   │   ├── Newsletter.scss
│   │   ├── WhyPipeCleaners.tsx
│   │   └── index.ts
│   ├── products/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGrid.scss
│   │   ├── CategorySection.tsx
│   │   ├── CategorySection.scss
│   │   └── index.ts
│   ├── checkout/
│   │   ├── OrderConfirmation.tsx
│   │   ├── OrderConfirmation.scss
│   │   └── index.ts
│   └── index.ts
```

---

## Import Examples

### Import from main components index

```typescript
import { Navbar, Footer, Hero, ProductGrid } from "@/components";
```

### Import specific group

```typescript
import { Navbar, Footer } from "@/components/layout";
import { Hero, Newsletter } from "@/components/sections";
```

### Import individual component

```typescript
import Navbar from "@/components/layout/Navbar";
```

---

## Best Practices

1. **Always use the group index** (`@/components/layout`, `@/components/sections`, etc.) for better maintainability
2. **Keep SCSS files adjacent** to their TSX components
3. **Update the main index.ts** when adding new components
4. **Use type-safe imports** from the centralized export

---

## Benefits

- ✅ **Better Organization** - Components grouped by functionality
- ✅ **Easier Navigation** - Find components faster
- ✅ **Scalability** - Easy to add new component groups
- ✅ **Maintenance** - Clear separation of concerns
- ✅ **Collaboration** - Developers know where to find/add components
