# AI Development Guidelines

## Phase 1: Foundation (The "Strict Foundation")

### Linting & Formatting
- Strict linting rules are enforced (no unused vars, explicit types).
- Prettier is used for consistent formatting.
- Run `npm run lint` to check for issues.

### Testing Infrastructure
- Karma and Jasmine are configured.
- Run `npm run test` to execute tests.
- Ensure all new features have accompanying tests.

### Structured Logging
- Use `LoggerService` for all logging.
- Format: `domain.component.action`.
- Do NOT use `console.log` directly.

### CI/CD & Scripts
- Use `npm run validate` before committing.
- This runs Lint -> Build -> Test.

## Phase 2: PIV Loop Enablement

### Prompt Structure
1. **Plan**: Understand requirements, outline features.
2. **Implement**: Write code, strictly following guidelines.
3. **Validate**: Run `npm run validate`.

### Vibe Planning
- Prioritize visual excellence and "wow" factor.
- Use modern aesthetics.
