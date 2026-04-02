# Claude Code Project Template

Reusable project scaffold with autonomous governance, TDD pipeline, review enforcement, and CI. Designed for fully autonomous Claude Code development with human oversight only at PR review.

## What's Included

| Layer | Components | Purpose |
|-------|-----------|---------|
| **Build** | Vite, TypeScript, Biome | Dev server, type safety, fast lint/format |
| **Testing** | Vitest, Playwright, visual regression | Unit tests, E2E, screenshot baselines |
| **Git hooks** | Husky, lint-staged | Pre-commit quality gates |
| **Claude hooks** | 9 hooks (4 blocking, 5 informational) | Commit gate, circuit breaker, review enforcement, audit log |
| **CI** | GitHub Actions | PR quality checks + E2E |
| **AI review** | claude-code-action | Automatic PR review with inline comments |
| **Governance** | CLAUDE.md, Constitution, Speckit | Autonomous dev loop with TDD + review enforcement |

## Quick Start

### 1. Create from template

Click **"Use this template"** on GitHub, or:

```bash
gh repo create my-project --template morgan8889/claude-code-template
cd my-project
```

### 2. Customize placeholders

| Placeholder | File(s) | Replace with |
|---|---|---|
| `[PROJECT_NAME]` | CLAUDE.md, constitution.md | Your project name |
| `[PROJECT_DESCRIPTION]` | CLAUDE.md | One-line description |
| `[TARGET_USERS]` | constitution.md | Your target users |
| `[DOMAIN_DATA]` | constitution.md | Your core data types |
| `my-project` | package.json | Your package name |
| `My Project` | index.html | Your page title |

### 3. Install and verify

```bash
npm install
npm run typecheck       # TypeScript
npm run lint            # Biome
npm run test            # Vitest unit tests
npm run test:coverage   # With coverage thresholds
npm run build           # Vite production build
npm run test:e2e        # Playwright E2E + visual regression
```

### 4. Set up GitHub

1. Add `ANTHROPIC_API_KEY` to repo secrets (Settings > Secrets > Actions)
2. Enable branch protection on `main`:
   - Require CI to pass
   - Require 1 approving review
   - Dismiss stale reviews on push

### 5. Start building

```bash
claude /speckit.specify    # Write feature spec
claude /speckit.plan       # Design implementation
claude /speckit.tasks      # Generate task list
claude /speckit.implement  # Execute tasks with TDD
```

## Automation Architecture

### Hook Enforcement Chain

```
Implementation commit (feat:/fix:/refactor:)
  --> post-commit-review.sh AUTO-QUEUES for review
  --> review-enforcer.sh BLOCKS next task until reviews done
  --> review-gate.sh BLOCKS PR until all review artifacts exist

git commit (any)
  --> verify-before-commit.sh BLOCKS unless tests/types/lint pass
  --> Husky pre-commit runs lint-staged + typecheck + test

Every Bash command
  --> circuit-breaker.sh BLOCKS after 3 identical retries

Every file edit
  --> post-edit-format.sh auto-formats + invalidates pre-commit cache

Every tool call
  --> audit-log.sh logs to ~/.claude/audit/ (user-level only)
```

### 9 Hooks

| Hook | Event | Blocks? | Purpose |
|------|-------|---------|---------|
| `verify-before-commit.sh` | PreToolUse | **Yes** | Tests, typecheck, lint, E2E before commit |
| `circuit-breaker.sh` | PreToolUse | **Yes** | Prevents infinite retry loops |
| `review-enforcer.sh` | PreToolUse | **Yes** | Blocks implementation until reviews done |
| `review-gate.sh` | PreToolUse | **Yes** | Blocks PR without review artifacts |
| `post-edit-format.sh` | PostToolUse | No | Auto-format with Biome |
| `post-commit-review.sh` | PostToolUse | No | Queues impl commits for review |
| `audit-log.sh` | PostToolUse | No | JSONL audit trail (user-level) |
| `on-stop.sh` | Stop | Conditional | Prevents premature stop during autonomous work |
| `notify.sh` | Notification | No | Desktop notification |

### GitHub Workflows

**CI** (`ci.yml`) — runs on PRs to main:
- Biome lint
- TypeScript type check
- Vitest with coverage thresholds
- Playwright E2E + visual regression

**Claude Code** (`claude-review.yml`) — two jobs:
- `auto-review`: runs on every PR, posts inline comments
- `claude-respond`: runs on `@claude` mentions in comments

### CLAUDE.md Autonomous Loop

```
Phase -1: PREFLIGHT   — enumerate blockers, signal session start
Phase  0: ORIENT      — read spec/plan/tasks, identify next task
Phase  1: RED         — write failing test
Phase  2: GREEN       — minimum implementation
Phase  3: REFACTOR    — improve clarity, stay green
Phase  4: VERIFY      — full test suite + typecheck + lint + browser
Phase  5: REVIEW      — spec review + quality review + simplifier (HOOK-ENFORCED)
Phase  6: COMMIT      — atomic commit (pre-commit hooks run)
Phase  7: PR          — final review + verification (HOOK-ENFORCED)
```

## Review Enforcement

After every `feat:/fix:/refactor:` commit, the review hooks enforce:

1. **post-commit-review.sh** creates `.reviews/pending/<sha>.pending`
2. **review-enforcer.sh** blocks the next implementation command until:
   - `.reviews/completed/<sha>-spec.md` exists (spec compliance review)
   - `.reviews/completed/<sha>-quality.md` exists (code quality review)
3. **review-gate.sh** blocks `gh pr create` until:
   - All pending reviews completed
   - `.reviews/completed/final-review.md` exists
   - `.reviews/completed/final-simplifier.md` exists
   - `.reviews/verification-pass.md` exists

Infrastructure commits (`chore:`, or only touching `.claude/`, `.github/`, config files) skip the review queue.

## Visual Regression

Playwright `toHaveScreenshot()` tests tagged with `@visual`:

```bash
# Run visual tests
npx playwright test --grep @visual

# Update baselines after intentional UI changes
npx playwright test --grep @visual --update-snapshots
```

Baselines stored in `screenshots/baseline/` (committed to git).

The commit hook (`verify-before-commit.sh`) automatically runs visual regression when UI files are staged and baselines exist.

## Project Structure

```
.claude/
  commands/             # 9 speckit slash commands
  hooks/                # 9 automation hooks
  settings.json         # Permissions + hook configuration
  HOOK_PROTOCOL.md      # Hook JSON format + upgrade checklist
.github/
  workflows/
    ci.yml              # PR quality checks
    claude-review.yml   # Automatic AI review
  pull_request_template.md
.husky/
  pre-commit            # lint-staged + typecheck + test
.specify/
  memory/
    constitution.md     # Project principles + quality gates
  templates/            # Spec, plan, task, checklist templates
  scripts/              # Feature branch + prerequisite scripts
screenshots/
  baseline/             # Visual regression baselines
src/
  main.ts               # App entry point
  main.test.ts          # Unit tests
e2e/
  smoke.spec.ts         # E2E smoke test
  visual.spec.ts        # Visual regression tests
CLAUDE.md               # Autonomous dev loop (9 phases)
```

## Key Design Decisions

### Advisory instructions get skipped

CLAUDE.md text and skill conventions are advisory — Claude can and does skip them under pressure. Only **blocking hooks** (exit code 2) are reliable enforcement. That's why 4 of the 9 hooks are blocking.

### Artifact-based > signal-based enforcement

A "touch a pass file" pattern is gameable. The review hooks check for actual review content files that must be written by review subagents, not just signal files.

### CI must mirror local environment

If a feature needs environment variables (like API tokens), CI must set them too — even as placeholders. Otherwise E2E tests fail in CI but pass locally.

### Version pins: tilde not caret

Critical dependencies (Biome, Vite, Vitest, Mapbox) use `~` (patch-only updates) instead of `^` (minor updates) to prevent surprise breaking changes.

## Plane Integration (Optional)

Track work items in [Plane](https://plane.so) automatically. Hooks inject context at session start, commit, PR, and stop events.

### Setup

1. **Configure env var** — add to `~/.claude/settings.json`:
   ```json
   {
     "env": {
       "PLANE_ENABLED": "1",
       "PLANE_API_KEY": "<your-api-key>",
       "PLANE_WORKSPACE_SLUG": "<your-workspace>"
     }
   }
   ```
   Or export in your shell profile.

2. **Add the Plane MCP server** — configure in `.mcp.json` or your MCP settings:
   ```json
   {
     "mcpServers": {
       "plane": {
         "command": "python",
         "args": ["-m", "plane_mcp", "stdio"],
         "env": {
           "PLANE_API_KEY": "<your-api-key>",
           "PLANE_WORKSPACE_SLUG": "<your-workspace>"
         }
       }
     }
   }
   ```

3. **Populate project registry** — run `/speckit.specify` on your first feature. The skill auto-creates a Plane project and populates `.claude/skills/plane-dev/references/projects.md`.

### What it does

| Event | Plane Action |
|-------|-------------|
| Session start | Detects ticket from branch name, loads ticket state |
| `feat:` commit | Adds commit comment to ticket, marks child tasks Done |
| PR gate passes | Links PR to parent ticket, moves to In Review |
| PR created | Moves parent ticket to Done |
| `/speckit.specify` | Creates Plane project + parent ticket |
| `/speckit.taskstoissues --plane` | Creates child tickets from tasks.md |

Without `PLANE_ENABLED=1`, all Plane integration is silently skipped.

## Customizing the Stack

1. Update `package.json` scripts to match your tools
2. Update `.claude/settings.json` permissions
3. Update `.claude/hooks/verify-before-commit.sh` to run your checks
4. Update `.claude/hooks/post-edit-format.sh` for your formatter
5. Update `.husky/pre-commit` to match
6. Update `.github/workflows/ci.yml` to match
7. Review `.claude/HOOK_PROTOCOL.md` for hook format reference

## License

MIT
