AGENTS.md
=================================

Overview
- This document defines agent-oriented conventions used by automated coding agents operating in this repository.
- It covers build, lint, test commands; code style guidelines; error handling; naming and typing norms; and how to apply Cursor and Copilot rules if present.

Scope
- Focus on TypeScript/JavaScript projects in this repo (e.g. stock-dashboard).
- Adapt commands to the local package.json scripts when available.
- When in doubt, prefer explicit, observable actions and fail fast with useful error messages.

1. Build / Lint / Test Commands
- Build (local):
  - Primary: npm run build
  - Fallback: tsc -p tsconfig.json && vite build
- Lint (if configured):
  - Primary: npm run lint
  - If no script exists: eslint --ext .ts,.tsx .
- Test (general guidance):
  - If a test script exists: npm test
  - If using Vitest: npx vitest run
    - Single test: npx vitest run -t "test name"  OR  npx vitest run --testNamePattern="^MyTest$"
  - If using Jest: npm test -t "test name"
- CI tips:
  - Install deps: npm ci
  - Run build and tests: npm run build && npm test
- Quick one-off test: for a single test, always try to use a targeted test selector (name or pattern) to limit scope.

2. Code Style Guidelines
- General philosophy: write clear, maintainable code with minimal, explicit side effects.
- Imports
  - Group in this order: external modules, absolute imports, relative imports.
  - Avoid wildcard imports; prefer named imports where possible.
  - Unused imports must be removed; enable lint rule if available.
- Formatting
  - Use Prettier with a shared configuration; respect existing project formatting.
  - Indentation: 2 spaces (common in TS projects); align with existing codebase.
  - End-of-line: LF.
- Typing and Types
  - Prefer explicit types; avoid any; use unknown when appropriate if type safety is uncertain.
  - Use interfaces for props and API responses; prefer type aliases for complex unions only when helpful.
  - Use Readonly<T> where appropriate to prevent accidental mutations.
- Naming conventions
  - Variables and functions: camelCase.
  - Types and classes: PascalCase.
  - Constants: UPPER_SNAKE_CASE; boolean flags prefixed with is/has/should.
- Error handling
  - Do not swallow errors; wrap and annotate with context.
  - Use custom error classes for domain-specific errors.
  - When propagating, preserve original error as cause if supported.
- Async patterns
  - Prefer async/await; handle errors with try/catch.
  - Parallelize independent promises with Promise.all; guard with error handling.
- API and data layer
  - Validate inputs/outputs; fail fast on invalid data.
  - Do not leak implementation details through the API surface.
- Testing
  - Write unit tests for core logic; aim for >70% coverage where feasible.
  - Tests should be deterministic and fast.
  - Use descriptive test names; group related tests in describe blocks.
- Documentation and comments
  - Use JSDoc/TSdoc where helpful for public APIs.
  - Comments should explain why, not what; avoid redundant comments.
- Performance and security
  - Avoid premature optimization; profile before optimizing.
  - Be mindful of security boundaries when handling user input.

3. Cursor Rules (if present)
- If a .cursor/rules directory exists, always load and apply it before writing code.
- Respect gating rules: do not bypass required prompts or checks.
- Where multiple Cursor rules conflict, prefer the most restrictive rule and log the decision.

4. Copilot Rules (if present)
- If .github/copilot-instructions.md exists, follow its directives for code generation:
  - Do not introduce patterns that violate the repo's security or licensing constraints.
  - Include explicit code comments per Copilot guidance when generating non-obvious logic.
- Prefer to surface a minimal, correct solution first, then iterate with improvements.

5. Agent Interaction and Workflow
- The AGENTS.md is the canonical reference for agent behavior in this repo.
- When a task is ambiguous, agents should ask 1 targeted clarification question and await answer.
- Use the agent skill system (when available) to guide complex workflows rather than ad-hoc steps.
- Always include a concise rationale in commit messages when introducing changes to AGENTS.md.

6. Versioning and Maintainer Notes
- This file lives at the repository root as AGENTS.md.
- Changes should be reviewed with a short rationale and linked to a PR if used in a team setting.
- Update the document whenever project conventions diverge from this baseline.

7. Example Commands (for quick copy-paste)
- Build: npm run build
- Lint: npm run lint || eslint --ext .ts,.tsx .
- Test (single): npx vitest run -t "should render home"  OR  npm test -t "home renders"
- Type check: npm run build --silent  (tsc -p tsconfig.json)

Notes
- If you add tests or additional tooling later, add corresponding sections in this document.
- For any project using a different test runner, adapt the commands accordingly.
