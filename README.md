# Claude Code Project Template

Reusable project scaffold with Claude Code autonomous governance, TDD pipeline, and CI.

## What's Included

| Component | Tool | Purpose |
|---|---|---|
| Build | Vite | Dev server + production bundler |
| Language | TypeScript | Type safety |
| Lint/Format | Biome | Fast linter + formatter |
| Unit tests | Vitest | Fast test runner |
| E2E tests | Playwright | Browser automation |
| Git hooks | Husky + lint-staged | Pre-commit quality gates |
| CI | GitHub Actions | PR checks |
| AI review | claude-code-action | @claude PR review + fixes |
| Governance | CLAUDE.md + Constitution | Autonomous dev loop with TDD |

## Quick Start

### 1. Create from template

Click **"Use this template"** on GitHub, or:

```bash
gh repo create my-project --template morgan8889/claude-code-template
cd my-project
```

### 2. Customize placeholders

Search and replace these in the codebase:

| Placeholder | File(s) | Replace with |
|---|---|---|
| `[PROJECT_NAME]` | CLAUDE.md, constitution.md | Your project name |
| `[PROJECT_DESCRIPTION]` | CLAUDE.md | One-line project description |
| `[TARGET_USERS]` | constitution.md | Your target users (e.g., "small business owners") |
| `[DOMAIN_DATA]` | constitution.md | Your core data types (e.g., "inventory records, pricing data") |
| `my-project` | package.json | Your package name (kebab-case) |
| `My Project` | index.html | Your page title |

### 3. Install and verify

```bash
npm install
npm run typecheck    # TypeScript
npm run lint         # Biome
npm run test         # Vitest
npm run build        # Vite production build
npm run test:e2e     # Playwright (installs browser on first run)
```

### 4. Set up GitHub

Add `ANTHROPIC_API_KEY` to your repo secrets for the @claude review workflow:
**Settings > Secrets and variables > Actions > New repository secret**

### 5. Start building

```bash
# Use speckit commands to drive the spec > plan > implement cycle:
claude /speckit.specify    # Write feature spec
claude /speckit.plan       # Design implementation
claude /speckit.tasks      # Generate task list
claude /speckit.implement  # Execute tasks with TDD
```

## Pre-commit Hooks

Every commit runs:
1. **lint-staged** — Biome check + format on staged files
2. **typecheck** — `tsc --noEmit`
3. **unit tests** — `vitest run`

## CI Pipeline

Runs on PRs to `main`:
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`

## Project Structure

```
.claude/
  commands/          # Speckit slash commands
  settings.json      # Claude Code permissions
.github/workflows/
  ci.yml             # PR quality checks
  claude-review.yml  # @claude AI review
.husky/
  pre-commit         # Git hooks
.specify/
  memory/
    constitution.md  # Project principles + quality gates
  templates/         # Spec, plan, task templates
src/
  main.ts            # App entry point
  main.test.ts       # Unit tests
e2e/
  smoke.spec.ts      # E2E smoke test
CLAUDE.md            # Autonomous dev loop instructions
```

## Customizing the Stack

The default stack (Vite + TS + Biome + Vitest + Playwright) is lightweight and fast. To swap components:

1. Update `package.json` scripts to match your new tools
2. Update `.claude/settings.json` permissions to allow the new commands
3. Update `.husky/pre-commit` to run the right checks
4. Update `.github/workflows/ci.yml` to match

## License

MIT
