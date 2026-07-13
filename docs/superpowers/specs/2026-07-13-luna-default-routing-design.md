# Luna Default Routing Design

## Goal

Move LazyCodex's active GPT-5.4 and GPT-5.4 mini routing choices to GPT-5.6 Luna while preserving catalog metadata and historical migration rules for backward compatibility.

## Routing policy

- `quick` uses `gpt-5.6-luna` with `low` reasoning effort.
- OpenAI-only `explore` and `librarian` overrides use `gpt-5.6-luna` with `low` reasoning effort.
- OpenAI fallback chains for `explore` and `librarian` prefer `gpt-5.6-luna` with `low` reasoning effort.
- Provider-availability fallback for `explore` uses `gpt-5.6-luna` with `low` reasoning effort.
- Existing Luna worker, QA, Explorer, and Librarian TOMLs remain unchanged.
- GPT-5.4 model capability entries, GPT-5.4 nano fallbacks, PostCompact budgets, and migration records remain available because they are compatibility data rather than active GPT-5.4/mini routing choices.

## Distribution boundary

The generated LazyCodex mirror does not include the upstream TypeScript source for these OMO routing tables. The two checked-in runtime bundles, `plugins/omo/dist/cli/index.js` and `plugins/omo/dist/cli-node/index.js`, are therefore the executable source of truth for this fork hotfix and must remain byte-for-byte equivalent apart from their known one-line offset.

## Verification

Add an aggregate Node test that checks both runtime bundles. It must prove that every affected route selects Luna at low effort and that the previous active `gpt-5.4-mini` and `gpt-5.4-mini-fast` route expressions are absent.
