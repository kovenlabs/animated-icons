# AGENTS.md

<!-- ab-method:start -->
## AB Method

This project uses the AB Method. Before running any AB Method workflow,
check `.ab-method/structure/index.yaml` — it defines where each workflow
reads from and writes to. Paths are user-configurable; never hardcode them.

Workflows are available as skills (prefix `ab-`). Invoke one explicitly
with `/skills` or `$ab-<name>`, or describe your intent and Codex will
match it:

- `ab-mastermind` — intelligent entry point: routes your intent to the right workflow, helps decide goal vs task vs roadmap, explains the method
- `ab-analyze-project` — full architecture sweep
- `ab-analyze-frontend` / `ab-analyze-backend` — refresh one layer's patterns doc
- `ab-create-roadmap` — turn a bigger idea into a dependency-ordered DAG of tasks; plan each via ab-create-task
- `ab-start-roadmap` — execute a planned roadmap in dependency order (independent tasks optionally parallel)
- `ab-create-task` — define a task, break it into TDD missions (roadmap-aware: syncs its roadmap entry)
- `ab-create-task-from-handoff` — resume a handoff spun off mid-grill into a task
- `ab-create-goal` — produce a prompt for an autonomous /goal loop
- `ab-extend-goal` — extend an existing goal
- `ab-resume-task` — continue an existing task, one mission at a time
- `ab-start-task` — run an existing task autonomously to completion (subagent per mission, commit per green mission)
- `ab-extend-task` — append missions to a task
- `ab-test-mission` — backfill tests for code written without them
- `ab-update-architecture` — refresh architecture docs

Principles: always grill before defining work (`grill-with-docs`); every
mission runs through `tdd` (red → green); `progress-tracker.md` is
the single source of truth per task.

Critics bracket every implementation, and all of them stay silent unless
there is a real problem. Before implementing, `critique-plan` stress-tests
the drafted plan against the domain model; for a whole roadmap,
`reconcile-roadmap` checks the finished plans cohere with each other. After
implementing, `review-implementation` runs three critics on the diff
(cleaner-architecture, slop-defender, reusability-inspector), then
`sync-architecture` finds what the change introduced that the docs do not
yet capture. Autonomous runs apply only safe fixes / append-only doc adds
and write the rest to `review.md` next to the tracker.

`change-map` runs on BOTH sides, as one artifact per task
(`docs/tasks/<slug>/change-map.md`). Before implementing it predicts which
modules the missions will add, change or touch; after the reviewers pass it
derives the same map from the real commit range, and reports the DRIFT —
modules the task reached that nobody planned for, modules the plan named
that it never touched, verdicts heavier than predicted. Rows are modules as
`CONTEXT.md` names them, not directories. The planned map is never edited to
match reality and never back-filled from a diff: being wrong on the page is
what makes the drift measurable. The map reports and routes; it never edits
code or docs.

Two things a grill must never do silently. When a tangent surfaces that
deserves its own task, capture it with the `handoff` skill under
`docs/handoffs/` instead of derailing — resume it later with
`ab-create-task-from-handoff`. When a question cannot be answered yet
(blocked on a person, a contract, data that does not exist), park it in
`unresolved-questions.md` with an agreed placeholder behind a `TODO(UQ-n)`
seam and mark the missions that build on it `⚠️ UQ-n` — never guess the
answer. Both are rare; guessing is never the alternative.

A roadmap may be deliberately incomplete: `roadmap.md` can carry
`## Open decisions` (answerable questions that block planning),
`## Not yet specified` (fog you cannot phrase sharply yet) and
`## Out of scope`. Fog graduates into tasks during planning only —
`ab-start-roadmap` reports candidates and never reshapes the map.

Architecture vocabulary (module, interface, depth, seam, adapter, leverage,
locality, the deletion test) has one source: the `codebase-design` skill.
<!-- ab-method:end -->

## Icons

Adding or changing an icon: use the `new-icon` skill (`.agents/skills/new-icon/SKILL.md`) and follow
`packages/animated-icons/STYLE.md`. Contributor-facing version: `CONTRIBUTING.md`.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
