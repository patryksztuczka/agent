# Agent Development Guidelines

## Build/Lint/Test Commands

### Backend (apps/backend)

- `pnpm build` - Full build (ESM + CJS)
- `pnpm test` - Run all tests
- `pnpm test <filename>` - Run single test file
- `pnpm lint` - Lint code
- `pnpm check` - Type check
- `pnpm tsx ./file.ts` - Execute TypeScript file

### Web (apps/web)

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run lint` - Lint code

## Code Style Guidelines

### Import Patterns

- Backend: Namespace imports for Effect (`import * as Effect from "effect/Effect"`)
- Web: Named imports with path aliases (`import { Component } from "@/components/component"`)

### Formatting (Backend)

- 2-space indentation, 80-char line width
- Single quotes, no trailing commas
- Use dprint formatter via ESLint

### TypeScript

- Strict mode enabled everywhere
- PascalCase for components/interfaces, camelCase for functions
- Kebab-case for files (`component-name.tsx`)
- Unused vars prefixed with underscore allowed

### Component Patterns (Web)

- Use shadcn/ui patterns with data attributes
- Class Variance Authority for variants
- Tailwind utility-first styling with `cn()` helper

### Testing

- Backend: Vitest with Effect integration
- Test files: `test/**/*.test.ts`
- Use `describe/it/expect` structure
