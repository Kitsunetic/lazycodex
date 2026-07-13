# Luna Default Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace active GPT-5.4 mini routing choices with GPT-5.6 Luna at low reasoning effort.

**Architecture:** Treat the two checked-in CLI bundles as the executable routing source for this generated fork. Protect the intended routing with an aggregate Node test that distinguishes active selections from compatibility metadata.

**Tech Stack:** Node.js test runner, generated JavaScript CLI bundles, TOML agent configuration.

## Global Constraints

- Preserve all existing PostCompact hotfix changes.
- Preserve GPT-5.4 catalog entries, migration records, PostCompact compatibility budgets, and GPT-5.4 nano fallbacks.
- Keep `plugins/omo/dist/cli/index.js` and `plugins/omo/dist/cli-node/index.js` behaviorally equivalent.

---

### Task 1: Lock Luna routing with a regression test

**Files:**
- Create: `plugins/omo/test/luna-default-routing.test.mjs`

- [ ] Write a Node test that reads both CLI bundles.
- [ ] Assert that quick, Explore, and Librarian active OpenAI routes select `gpt-5.6-luna` with `low` effort.
- [ ] Assert that the previous active GPT-5.4 mini route expressions are absent.
- [ ] Run the focused test and confirm it fails on the existing routes.

### Task 2: Replace active routing selections

**Files:**
- Modify: `plugins/omo/dist/cli/index.js`
- Modify: `plugins/omo/dist/cli-node/index.js`

- [ ] Replace the affected fallback-chain, built-in category, OpenAI-only override, and provider-availability selections.
- [ ] Update the quick-category caller warning to identify Luna.
- [ ] Run the focused test and confirm it passes.

### Task 3: Verify the fork package

**Files:**
- Verify: `plugins/omo/test/*.test.mjs`

- [ ] Run the aggregate test suite.
- [ ] Run JavaScript syntax checks on both CLI bundles.
- [ ] Run formatting/diff checks and confirm no unrelated files were overwritten.
