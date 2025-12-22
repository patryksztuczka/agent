# Agent Development Guidelines

## Project Structure & Commands
- **Backend (`apps/server`)**: Bun + Hono. Run: `bun run dev`. Database: `bunx prisma migrate dev`.
- **Frontend (`apps/web`)**: Bun + Vite + React. Run: `bun run dev`, `bun run build`, `bun run lint`.
- **Package Manager**: Always use `bun`.

## Code Style & Conventions
- **Naming**: PascalCase for components/interfaces, camelCase for functions, kebab-case for filenames.
- **Web Imports**: Use `@/` path alias (e.g., `@/components/ui/button`).
- **Formatting**: 2-space indentation, 80-char width, single quotes, semicolons (Prettier/ESLint).
- **UI (Web)**: Use shadcn/ui patterns and Tailwind CSS with `cn()` helper from `@/lib/utils`.
- **TypeScript**: Strict mode enabled. Use functional components with explicit types.

## Logic & Patterns
- **Server**: Hono for API routes. Bun for runtime. Prisma for ORM.
- **Web**: React hooks for state. Tailwind for styling.
- **Testing**: No tests currently; use `bun test` for any new tests in `**/*.test.ts`.
