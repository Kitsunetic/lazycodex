import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const bundlePaths = ["dist/cli/index.js", "dist/cli-node/index.js"];

test("#given bundled OpenAI routes #when lightweight model selections are inspected #then GPT-5.6 Luna replaces active GPT-5.4 mini routes", async () => {
	// Given
	const bundles = await Promise.all(
		bundlePaths.map(async (relativePath) => ({
			relativePath,
			content: await readFile(
				new URL(`../${relativePath}`, import.meta.url),
				"utf8",
			),
		})),
	);

	// When / Then
	for (const { relativePath, content } of bundles) {
		assert.match(
			content,
			/librarian:\s*\{[\s\S]*?fallbackChain:\s*\[\s*\{ providers: \["openai"\], model: "gpt-5\.6-luna", variant: "low" \}/,
			`${relativePath}: librarian fallback should prefer Luna low`,
		);
		assert.match(
			content,
			/explore:\s*\{[\s\S]*?fallbackChain:\s*\[\s*\{ providers: \["openai"\], model: "gpt-5\.6-luna", variant: "low" \}/,
			`${relativePath}: explore fallback should prefer Luna low`,
		);
		assert.match(
			content,
			/name: "quick",\s*config: \{ model: "openai\/gpt-5\.6-luna", variant: "low" \}/,
			`${relativePath}: quick category should use Luna low`,
		);
		assert.match(
			content,
			/quick:\s*\{[\s\S]*?fallbackChain:\s*\[\s*\{\s*providers: \["openai", "github-copilot", "opencode", "vercel"\],\s*model: "gpt-5\.6-luna",\s*variant: "low"/,
			`${relativePath}: quick fallback should prefer Luna low`,
		);
		assert.match(
			content,
			/explore: \{ model: "openai\/gpt-5\.6-luna", variant: "low" \},\s*librarian: \{ model: "openai\/gpt-5\.6-luna", variant: "low" \}/,
			`${relativePath}: OpenAI-only agents should use Luna low`,
		);
		assert.match(
			content,
			/quick: \{ model: "openai\/gpt-5\.6-luna", variant: "low" \}/,
			`${relativePath}: OpenAI-only quick override should use Luna low`,
		);
		assert.match(
			content,
			/agentConfig = \{ model: "openai\/gpt-5\.6-luna", variant: "low" \}/,
			`${relativePath}: provider availability should choose Luna low`,
		);

		assert.doesNotMatch(
			content,
			/model: "gpt-5\.4-mini-fast"/,
			`${relativePath}: no mini-fast active route`,
		);
		assert.doesNotMatch(
			content,
			/config: \{ model: "openai\/gpt-5\.4-mini" \}/,
			`${relativePath}: no GPT-5.4 mini category route`,
		);
		assert.doesNotMatch(
			content,
			/model: "openai\/gpt-5\.4-mini-fast"/,
			`${relativePath}: no GPT-5.4 mini-fast override`,
		);
		assert.doesNotMatch(
			content,
			/GPT-5\.4 for Oracle/,
			`${relativePath}: no stale GPT-5.4 install guidance`,
		);
		assert.match(
			content,
			/GPT-5\.6 family with Luna for lightweight tasks/,
			`${relativePath}: install guidance should describe Luna routing`,
		);
	}
});
