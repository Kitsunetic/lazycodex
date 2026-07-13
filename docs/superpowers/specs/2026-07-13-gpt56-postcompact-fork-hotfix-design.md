# GPT-5.6 PostCompact Fork Hotfix Design

## Goal

Ship a temporary LazyCodex fork release that gives the GPT-5.6 Sol, Terra, and Luna models their 372,000-token PostCompact budget, makes the installed hotfix version visible, and leaves a documented path back to the official marketplace once upstream includes the fix.

## Release identity

- Base release: official LazyCodex `4.17.0`.
- Fork release: `4.17.1-gpt56.1`.
- The root `lazycodex-ai` npm wrapper remains `0.2.2` because this fork is distributed through the Codex marketplace, not npm.
- `4.17.1-gpt56.1` is newer than `4.17.0` but older than a future stable `4.17.1`, so users can upgrade to the fork now and later return to the official stable release without a version collision.

## Runtime change

Add explicit 372,000-token context-window entries for:

- `gpt-5.6-sol`
- `gpt-5.6-terra`
- `gpt-5.6-luna`

The existing provider-prefix matching remains unchanged, so dotted and slash-prefixed model identifiers continue to resolve by suffix. Unknown models continue to use the conservative 200,000-token fallback.

## Verification

Add a table-driven regression test showing that all three GPT-5.6 models retain the configured PostCompact cap for a transcript that would force an unknown 200,000-token model down to the 500-character minimum. Keep the generated rules CLI table in lockstep with the source table and run focused Biome, regression, package-smoke, and real bundled-hook checks. This generated distribution mirror cannot run its complete upstream build graph standalone because the pinned source package does not expose the `rules-engine/engine` subpath and several generated workspaces are intentionally absent; those baseline failures must be reported rather than repaired as part of this hotfix.

Use an isolated temporary Codex home to verify that:

1. the fork marketplace installs the prerelease version;
2. the installed hook uses the 372,000-token mapping;
3. switching the marketplace source back to the official repository remains possible.

## Documentation

Add a README section that identifies this branch as a temporary GPT-5.6 hotfix based on official `4.17.0`. It must give an agent an executable checklist when a user supplies `https://github.com/Kitsunetic/lazycodex` and asks to update:

1. inspect the current `sisyphuslabs` marketplace;
2. replace its source with the fork;
3. install or refresh `omo@sisyphuslabs`;
4. verify `4.17.1-gpt56.1` and run the doctor;
5. explain that hooks require re-approval.

The same section must document the reverse operation. Users return to `https://github.com/code-yeongyu/lazycodex` only after issue #125 is included in an official release, then refresh the marketplace, verify the official version, and re-approve hooks.

## Generated release changes

The plugin version synchronization workflow updates the aggregate and component manifests, lockfile, and hook status messages. The rules component runtime bundle receives the GPT-5.6 table entries. The top-level installer CLI bundles retain their embedded official `4.17.0` npm and platform-binary metadata because those artifacts are the unchanged upstream base, not the fork marketplace release identity.

## Out of scope

- Publishing or changing the `lazycodex-ai` npm wrapper.
- Renaming the `sisyphuslabs` marketplace or plugin identifier.
- Automatically switching users back to upstream without confirming that the official release contains the fix.
- Changing Codex authentication, model configuration, or permission settings.
