# AI Agent Directives

## Purpose

This file is the authoritative safety and execution contract for AI agents,
coding assistants, and automation tools in this repository.

Replace every project placeholder during initialization. Placeholders may remain
only while the repository is used as a template.

## Environment Context

| Field              | Value                                         |
| ------------------ | --------------------------------------------- |
| Project name       | Nexa 主站                                     |
| Project root       | `/Users/fireparty/zfus/servers/nexa_mainsite` |
| Primary repository | `https://github.com/zfusx/nexa`（Private）    |
| Production domain  | `https://main.zfis.net`（计划）               |
| Human owner        | Nexa 团队                                     |
| Current stage      | prototype                                     |

## Required Record Set

Agents use these root records as durable memory:

| Record               | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `PROJECT_CONTEXT.md` | Product, architecture, ownership, constraints, risks     |
| `GOALS.md`           | Active objectives, acceptance criteria, completion state |
| `CURRENT_TASKS.md`   | Tasks, backlog, blockers, done criteria                  |
| `WORKLOG.md`         | Session checkpoints and verification history             |
| `DECISIONS.md`       | Durable decisions and rationale                          |
| `RESEARCH.md`        | Findings, sources, assumptions, and unknowns             |
| `HANDOFF.md`         | Resume state for the next session                        |
| `API_CONTRACT.md`    | API, event, schema, and compatibility contracts          |
| `DEPLOYMENT.md`      | Environments, runtime, deploy, rollback, health checks   |
| `SECRETS_POLICY.md`  | Secret inventory, handling rules, scanners, rotation     |
| `TOOLING_GUIDE.md`   | Toolchain, CI, scanners, verification matrix             |

## Mandatory Pre-Flight

Before architecture recommendations, code edits, deployment work, release work,
or PR creation:

1. Read `AGENTS.md` and this file.
2. Read `PROJECT_CONTEXT.md`, `GOALS.md`, `CURRENT_TASKS.md`, `WORKLOG.md`,
   `DECISIONS.md`, `RESEARCH.md`, and `HANDOFF.md`.
3. Read relevant contract and operations docs: `API_CONTRACT.md`,
   `DEPLOYMENT.md`, `SECRETS_POLICY.md`, `TOOLING_GUIDE.md`.
4. Inspect local code and docs before proposing new abstractions.
5. Run CodeGraph for the task area when available. If unavailable, use `rg`,
   `rg --files`, language-aware search, and local tests.
6. Run `git status --short --branch` when the project is in Git.
7. Identify risk tier and impacted records.
8. Confirm the active goal or create a clear goal record for substantial work.

## Tool Authority

Use tools in this order when available:

1. CodeGraph for architecture, symbol, dependency, and blast-radius context.
2. `rg` and `rg --files` for fast local discovery.
3. Language-native tools for formatting, linting, type checking, testing, and
   building.
4. `git` and `gh` for branch, diff, PR, issue, workflow, and release context.
5. Security scanners from `TOOLING_GUIDE.md` for secret and policy checks.
6. Remote agents or cloud coding tools only for low-risk draft work with human
   review and CI gates.

## Risk Tiers

| Tier | Examples                                                                                                           | Agent Behavior                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| P0   | secrets, destructive Git, production deploy, credential rotation, public breaking API change, database migration   | Stop for explicit approval; write rollback and verification plan         |
| P1   | API additions, auth changes, CI changes, dependency changes, multi-file code changes, user-facing behavior changes | Plan briefly; checkpoint after bounded passes; run targeted verification |
| P2   | docs polish, small local refactor, styling, naming, comments                                                       | Proceed directly; keep scope tight; run lightweight verification         |

## Execution Protocol

During implementation:

- Keep changes scoped to the active goal.
- Prefer existing project conventions over new frameworks.
- Use interface-first planning for public, breaking, protocol, event, schema,
  database, cross-service, and cross-client changes.
- Update `API_CONTRACT.md` before or with endpoint, schema, event, auth, or
  status-code changes.
- Update `DEPLOYMENT.md` before or with port, domain, service, runtime,
  infrastructure, deployment, rollback, or health-check changes.
- Update `SECRETS_POLICY.md` when secret names, storage, scanners, or key
  management rules change.
- Update tests or verification scripts when behavior changes.
- Do not leave placeholder code, partial functions, fake tests, or dummy
  handlers in production code.
- Do not modify more than 3 hand-edited code files in one pass without a
  verification checkpoint or explicit human approval.
- Use structural tools such as ast-grep for large mechanical code rewrites.
- Do not stage, commit, tag, push, release, or deploy unless the user asks.

## Record-Keeping Protocol

For substantial work:

- `GOALS.md`: keep the active goal, acceptance criteria, and status current.
- `WORKLOG.md`: record checkpoints, changed areas, commands, and results.
- `RESEARCH.md`: record sources and findings that future agents should not
  rediscover.
- `DECISIONS.md`: record durable tradeoffs and accepted direction.
- `CURRENT_TASKS.md`: keep active tasks, blockers, and follow-ups current.
- `HANDOFF.md`: summarize what is complete, what remains, verification status,
  risks, and the next best action.

## Interface Freeze Rule

When a feature affects external or cross-module contracts:

1. Define the interface first in `API_CONTRACT.md` or the relevant contract
   document.
2. Include types, routes or events, auth rules, request and response examples,
   error behavior, versioning, compatibility, and migration notes.
3. Present the structure for human approval when the change is public, breaking,
   database-backed, protocol-level, or spans multiple clients or services.
4. Implement only after approval for P0 cases. For P1 internal additions, update
   the contract and implementation in the same bounded pass.

## Zero Placeholder Rule

Agents must not add:

- `TODO: implement`, `stub`, `not implemented`, `rest of code`
- Ellipsis placeholders, fake tests, empty handlers, dummy return values

Scope:

- Strictly applies to production code, tests, migrations, CI, deployment
  scripts, and security config.
- Placeholders are allowed in reusable templates, examples, backlog notes, and
  explicit scaffolding docs when clearly marked as template content.

If implementation context is insufficient, halt and report the missing
information instead of creating incomplete code.

## Secret Boundary

Agents must not:

- Request, print, store, or summarize plaintext secrets.
- Edit production secret stores.
- Deploy to production without explicit human instruction.
- Rotate credentials without explicit human instruction and a written rollback
  plan.
- Disable scanners, branch protection, CI gates, audit logging, or deployment
  safeguards to make a task pass.
- Grant AI tools broad access to production secrets, private customer data, or
  privileged infrastructure.

If a secret appears in chat, logs, diffs, terminal output, or generated files:

1. Stop normal work.
2. Redact the value in all responses.
3. Record the issue in `CURRENT_TASKS.md` without the plaintext value.
4. Follow `SECRETS_POLICY.md` for rotation and cleanup.

## Error Recovery

### Leaked Secret

1. Stop all other work immediately.
2. Redact the secret from all outputs and responses.
3. Record the leak in `CURRENT_TASKS.md` as a P0 task without the plaintext.
4. Follow `SECRETS_POLICY.md` rotation procedures.
5. Check whether the secret was committed — if so, treat the entire Git history
   as compromised and plan a force-push or history rewrite with human approval.

### Broken Build or Failing Tests

1. Do not push forward with more changes on top of a broken state.
2. Identify the breaking change by reviewing `git diff` and `WORKLOG.md`.
3. Revert or fix the smallest possible change to restore green.
4. Record the incident and root cause in `WORKLOG.md`.

### Agent Going Off-Track

1. If the current changes no longer match the active goal in `GOALS.md`, stop.
2. Review `GOALS.md` acceptance criteria and `HANDOFF.md` context.
3. Discard or stash unrelated changes.
4. Record what happened in `WORKLOG.md` and resume from the goal.

### Conflicting Instructions

1. `AI_DIRECTIVES.md` overrides all other instruction sources.
2. `AGENTS.md` overrides `.cursor/rules/*.mdc` and inline comments.
3. If two root docs conflict, follow the more restrictive rule and record the
   conflict in `CURRENT_TASKS.md` for human resolution.

## Agent Delegation Policy

Cloud coding agents, including Copilot coding agent, may be used for:

- Documentation drafts.
- Low-risk tests.
- Mechanical refactors with clear acceptance criteria.
- Draft PRs for non-secret, non-production code paths.

They must not be used for:

- Secret handling.
- Production deployment.
- Database migration execution.
- Incident response.
- Privileged infrastructure changes.

All agent-authored PRs must be treated as untrusted until reviewed, tested, and
scanned.

## Mandatory Post-Flight

Before marking a task done:

1. Run proportional verification from `TOOLING_GUIDE.md`.
2. Run secret scanning when files, docs, config, CI, env examples, signing,
   deployment, or credentials are touched.
3. Run `git diff --check` when the project is in Git.
4. Run `git status --short --branch` when the project is in Git.
5. Update `CURRENT_TASKS.md`, `WORKLOG.md`, and `HANDOFF.md`.
6. Update all impacted root docs and records.

## Final Response Requirements

When work is complete, report:

- What changed.
- Which verification commands ran.
- Which docs and records were updated.
- Any skipped checks and why.
- Remaining risks or follow-up tasks.
