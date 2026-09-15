## Current State

| Field | Value |
| --- | --- |
| Last updated | `<YYYY-MM-DD HH:MM TZ>` |
| Current goal | `<goal-id>` |
| Current task | `<task-id>` |
| Status | `<in-progress/blocked/completed>` |
| Current branch | `<branch-name-or-not-in-git>` |
| Last verification | `<what-was-checked>` |
| Next best action | `<next-action>` |

## What Is Done

- `<completed-item>`

## What Remains

- `<remaining-item>`

## Important Context

- `<context-that-a-new-agent-needs>`

## Files Changed Recently

| Path | Why It Changed |
| --- | --- |
| `<path>` | `<reason>` |

## Commands Already Run

| Command | Result | Notes |
| --- | --- | --- |
| `<command>` | `<pass/fail/skipped>` | `<notes>` |

## Known Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| `<risk>` | `<P0/P1/P2>` | `<mitigation>` |

## Resume Prompt

```text
Read AGENTS.md, AI_DIRECTIVES.md, PROJECT_CONTEXT.md, GOALS.md,
CURRENT_TASKS.md, WORKLOG.md, DECISIONS.md, RESEARCH.md, and HANDOFF.md.
The current goal is <goal-id>. Resume from <next-action>.
```
