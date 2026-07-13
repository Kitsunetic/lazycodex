# GPT-5.6 PostCompact Fork Hotfix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a reversible `4.17.1-gpt56.1` marketplace hotfix that budgets GPT-5.6 Sol, Terra, and Luna against their 372,000-token context window.

**Architecture:** Extend the existing static model-budget table and lock the behavior with one table-driven Vitest regression test. Use the repository's version and build scripts to regenerate manifests, hook messages, lock data, and runtime bundles, then document fork installation and official-source restoration in the root README.

**Tech Stack:** TypeScript 6, Vitest 4, Bun bundler targeting Node.js, npm workspaces, Codex plugin marketplace CLI.

## Global Constraints

- Fork version is exactly `4.17.1-gpt56.1` and is based on official LazyCodex `4.17.0`.
- Root npm wrapper version remains exactly `0.2.2`.
- Marketplace and plugin identifiers remain `sisyphuslabs` and `omo@sisyphuslabs`.
- TypeScript stays strict: no `any`, suppressions, enums, or Bun runtime APIs.
- Runtime imports retain ESM `.js` suffixes, tabs, and double-quoted strings.
- Generated bundles and hook metadata must be committed with their sources in a release change.
- No Git credentials may appear in documentation, commands, diffs, or verification output.

---

### Task 1: Lock the GPT-5.6 budget behavior

**Files:**
- Modify: `plugins/omo/components/rules/test/post-compact-budget.test.ts`
- Modify: `plugins/omo/components/rules/src/post-compact-budget.ts`
- Generated: `plugins/omo/components/rules/dist/cli.js`

**Interfaces:**
- Consumes: `withPostCompactBudget(config: PiRulesConfig, context?: PostCompactBudgetContext): PiRulesConfig`.
- Produces: three additional `MODEL_CONTEXT_BUDGETS` entries with a 372,000-token context window.

- [ ] **Step 1: Write the failing table-driven regression test**

Add this test after the existing known-model pressure test:

```ts
	it.each(["gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna"])(
		"#given GPT-5.6 model %s #when resolving a large post-compact transcript #then uses the 372K context window",
		(model) => {
			// given
			const transcriptPath = writeCompactedTranscript("A".repeat(990_000));

			// when
			const budget = withPostCompactBudget(CONFIG, { model, transcriptPath });

			// then
			expect(budget.maxRuleChars).toBe(11_450);
			expect(budget.maxResultChars).toBe(11_450);
		},
	);
```

- [ ] **Step 2: Run the focused test and verify RED**

Provision the plugin's lockfile-pinned dev dependencies once from `plugins/omo`:

```bash
npm ci --ignore-scripts
```

Then run:

```bash
npx vitest --run --no-file-parallelism test/post-compact-budget.test.ts
```

from `plugins/omo/components/rules`.

Expected: the three new cases fail because each model uses the 200,000-token fallback and returns the 500-character minimum. `npm ci` can expose mode-only workspace-bin drift in this generated mirror; inspect `git diff --summary` and restore only those mode bits before final review.

- [ ] **Step 3: Add the minimal budget entries**

Insert at the start of `MODEL_CONTEXT_BUDGETS`:

```ts
	{
		slug: "gpt-5.6-sol",
		contextWindowTokens: 372_000,
		effectivePercent: DEFAULT_EFFECTIVE_CONTEXT_WINDOW_PERCENT,
	},
	{
		slug: "gpt-5.6-terra",
		contextWindowTokens: 372_000,
		effectivePercent: DEFAULT_EFFECTIVE_CONTEXT_WINDOW_PERCENT,
	},
	{
		slug: "gpt-5.6-luna",
		contextWindowTokens: 372_000,
		effectivePercent: DEFAULT_EFFECTIVE_CONTEXT_WINDOW_PERCENT,
	},
```

- [ ] **Step 4: Run focused verification and update the committed runtime bundle**

Run from `plugins/omo/components/rules`:

```bash
npx vitest --run --no-file-parallelism test/post-compact-budget.test.ts
npx --yes @biomejs/biome@2.4.16 check src/post-compact-budget.ts test/post-compact-budget.test.ts
```

Expected: both commands exit zero. Add the same three entries to the committed `dist/cli.js` model table, run `node --check dist/cli.js`, and exercise its real PostCompact hook in Task 4. The metadata-only `test/package-smoke.test.ts` remains useful for package contents but is not evidence that the bundle executes. Do not attempt to repair the distribution mirror's missing `rules-engine/engine` export or absent generated workspaces in this hotfix.

### Task 2: Stamp the reversible fork release

**Files:**
- Modify: `plugins/omo/package.json`
- Modify: `plugins/omo/.codex-plugin/plugin.json`
- Modify: every `plugins/omo/components/*/package.json` containing the aggregate release version
- Modify: `plugins/omo/package-lock.json`
- Generated: `plugins/omo/components/*/hooks/hooks.json`
- Generated: `plugins/omo/hooks/*.json`

**Interfaces:**
- Consumes: `LAZYCODEX_RELEASE_VERSION` in `plugins/omo/scripts/sync-version.mjs`.
- Produces: one consistent plugin release identity, `4.17.1-gpt56.1`.

- [ ] **Step 1: Run the repository version synchronizer**

Run from `plugins/omo`:

```bash
LAZYCODEX_RELEASE_VERSION=4.17.1-gpt56.1 npm run sync:version
npm install --package-lock-only --ignore-scripts
```

Expected: aggregate, plugin, component, and lock manifests use `4.17.1-gpt56.1`; the repository-root `package.json` remains `0.2.2`.

- [ ] **Step 2: Regenerate versioned hook messages**

Run from `plugins/omo`:

```bash
node scripts/sync-hook-status-messages.mjs
```

Expected: hook status messages report `4.17.1-gpt56.1`. The top-level installer CLI bundles keep their official `4.17.0` npm and platform-binary metadata because the root npm wrapper is not part of this fork release.

- [ ] **Step 3: Verify version consistency**

Run from the repository root:

```bash
test "$(node -p "require('./package.json').version")" = "0.2.2"
test -z "$(rg -l '4\.17\.0' plugins/omo --hidden --glob '!node_modules/**' --glob '!**/dist/cli/index.js' --glob '!**/dist/cli-node/index.js')"
rg -n '4\.17\.1-gpt56\.1' plugins/omo/.codex-plugin/plugin.json plugins/omo/package.json plugins/omo/package-lock.json
```

Expected: all commands exit zero; no stale aggregate release version remains.

### Task 3: Document fork installation and upstream restoration

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Codex marketplace commands and fixed marketplace identity `sisyphuslabs`.
- Produces: an agent-executable update checklist and a human-readable upstream restoration procedure.

- [ ] **Step 1: Add a temporary fork hotfix section**

Place the section immediately after the experimental marketplace installation section. State that this fork is based on official `4.17.0`, fixes issue #125, and identifies itself as `4.17.1-gpt56.1`. Tell an agent given the fork URL to inspect `codex plugin marketplace list`, replace the existing `sisyphuslabs` source with `https://github.com/Kitsunetic/lazycodex`, add or refresh `omo@sisyphuslabs`, verify the installed version, run `npx lazycodex-ai doctor`, and tell the user to re-approve modified hooks.

- [ ] **Step 2: Add the official-source restoration procedure**

Document that restoration is allowed only after issue #125 appears in an official release. The procedure must replace the marketplace source with `https://github.com/code-yeongyu/lazycodex`, refresh `omo@sisyphuslabs`, verify the official version, run the doctor, and re-approve hooks.

- [ ] **Step 3: Check documentation commands and links**

Run:

```bash
rg -n 'Kitsunetic/lazycodex|4\.17\.1-gpt56\.1|issues/125|code-yeongyu/lazycodex' README.md
```

Expected: every fork, version, issue, and restoration reference is present; no credential-bearing URL is present.

### Task 4: Verify the release payload and transition paths

**Files:**
- Verify only: all files changed by Tasks 1-3.

**Interfaces:**
- Consumes: generated `plugins/omo` release and the Codex plugin marketplace CLI.
- Produces: test and installation evidence for the hotfix and its rollback path.

- [ ] **Step 1: Run component and aggregate quality gates**

Run:

```bash
(cd plugins/omo/components/rules && node --check dist/cli.js && npm pack --dry-run)
(cd plugins/omo && node --test test/sync-version.test.mjs test/aggregate-hooks.test.mjs test/aggregate-manifest.test.mjs test/component-hook-contract-cases.mjs)
npm test
```

Expected: every clean-mirror scoped command exits zero. The source regression test is run during Task 1 in a dependency-provisioned workspace; the clean distribution-mirror final gate relies on bundle syntax, the real hook exercise in Step 2, package dry-run, metadata tests, and root tests. Record known standalone mirror failures separately if full component or aggregate suites are attempted; they are not caused by this hotfix and must not be fixed by expanding scope.

- [ ] **Step 2: Verify the packaged hook budget**

Run the built `plugins/omo/components/rules/dist/cli.js` against a temporary compacted transcript for each of `gpt-5.6-sol`, `gpt-5.6-terra`, and `gpt-5.6-luna`.

Expected: all three emit the configured PostCompact limits rather than the conservative 500-character fallback.

- [ ] **Step 3: Exercise fork install and official restoration in isolation**

Create a temporary `CODEX_HOME`, add the local repository as the `sisyphuslabs` marketplace, install `omo@sisyphuslabs`, and verify `4.17.1-gpt56.1`. Then replace the marketplace with an isolated official-source fixture or perform a non-mutating remote availability check proving that the documented remove/add/upgrade sequence is valid.

Expected: the real user installation and `~/.codex/config.toml` remain unchanged.

- [ ] **Step 4: Review the final diff and working tree**

Run:

```bash
git diff --check
git status --short
git diff --stat
```

Expected: only the approved GPT-5.6 hotfix, release version, generated payload, README, design, and plan files are modified.
