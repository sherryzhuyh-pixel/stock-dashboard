# AGENTS.md

## Project Overview

TypeScript/Node.js project for daily development and learning.

---

## Build/Lint/Test Commands

### Development
```bash
npm run dev          # Start dev server with hot reload (Vitest)
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled code from dist/
```

### Code Quality
```bash
npm run lint         # Run ESLint on src/
npm run lint:fix     # Auto-fix ESLint issues
npm run typecheck    # TypeScript type checking (no emit)
```

### Testing
```bash
npm test             # Run all tests (watch mode)
npm run test:run     # Run tests once (no watch)

# Run single test file
npm test -- run src/utils/math.test.ts

# Run single test case by name
npm test -- run -t "add should return sum"

# Run tests with coverage
npm test -- run --coverage
```

---

## Code Style Guidelines

### 1. Naming Conventions

- **Files**: kebab-case (e.g., `user.service.ts`)
- **Classes/Interfaces/Types**: PascalCase (e.g., `UserService`)
- **Variables/Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Booleans**: Use `is`/`has`/`can` prefix (e.g., `isActive`, `hasPermission`)

### 2. TypeScript Rules

- **Explicit types**: Always declare parameter and return types
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions/aliases **No `any`**: Use `unknown` instead of `any`
- **Optional properties**: Use `?` (e.g., `name?: string`)

```typescript
// Good
interface User {
  id: number;
  name: string;
  email?: string;
}

function getUser(id: number): Promise<User> {
  // ...
}

// Bad
function getUser(id: any): any {
  // ...
}
```

### 3. Import Order

1. External libraries (e.g., `import { Router } from 'express'`)
2. Internal modules using `@/` alias (e.g., `import { UserService } from '@/services'`)
3. Relative imports (e.g., `import { ApiError } from '../errors'`)
4. Type imports using `import type`

### 4. Formatting

- **Indentation**: 2 spaces
- **Quotes**: Single quotes (double quotes in strings)
- **Semicolons**: Required
- **Line endings**: LF
- **Max line width**: 100 characters

### 5. Error Handling

- **Sync errors**: Use try/catch
- **Async errors**: Use try/catch or `.catch()`
- **Custom errors**: Extend Error class
- **Logging**: Log error stack and context

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchData() {
  try {
    const result = await api.call();
    return result;
  } catch (error) {
    logger.error('Failed to fetch data', { error, context });
    throw error;
  }
}
```

### 6. Best Practices

- **Single responsibility**: One function, one job
- **Early return**: Reduce nesting, use guard clauses
- **DRY**: Extract common logic into reusable functions
- **Comments**: Explain "why", not "what"
- **Tests**: New features must include tests for core logic

### 7. Directory Structure

```
src/
├── api/              # API routes
├── config/           # Configuration files
├── errors/           # Custom error classes
├── hooks/            # Custom hooks
├── services/         # Business logic
├── types/            # Type definitions
├── utils/            # Utility functions
├── index.ts          # Entry point
└── app.ts            # Main app file
tests/
└── *.test.ts         # Test files
```

---

## Notes

1. Run `npm run lint` and `npm test` before committing
2. New dependencies must be justified in PR description
3. Keep commit messages clear and descriptive
