# Tienne Orca Plugins

## Shared instructions

This file is the source of truth for repository instructions. Edit `AGENTS.md`; `CLAUDE.md` imports it with `@AGENTS.md` and must not contain a second copy of these rules.

## Repository

- Use pnpm and Nx. Each `plugins/*` directory is an independently installable Orca plugin.
- Git Logs is implemented in `plugins/git-logs`. Its plugin and Nx project ID is `git-logs`.
- `scripts/build-plugin.mjs` creates self-contained artifacts in `dist/plugins/*`. Do not commit generated builds to the development branch unless preparing an authorized release.
- Read `README.md` for setup, `plugins/git-logs/README.md` for user behavior, and `docs/development.md` for integration contracts and limits.

## Development and verification

- Run tasks through Nx with pnpm. For Git Logs, use `pnpm nx run git-logs:<target>`.
- Run checks appropriate to the change. Build and typecheck through Nx; use `test` for Git/worker behavior and `ui-test` for UI behavior.
- Validate the built artifact with `pnpm validate`. Source manifests refer to packaged entries, not source files.
- Generate English demo screenshots with `pnpm nx run git-logs:screenshots`. Keep the DEMO label and use fixture data, not private repository data.

## Orca plugin work: read first

- Before creating, changing, debugging, or releasing an Orca plugin, read the installed CLI's version-matched guide with `skills get orca-plugin-authoring`. Use `ORCA_CLI_COMMAND` when set; otherwise resolve the executable through the orca-cli skill.
- Read the relevant bundled references before implementation: manifest, host API, events, recipes, and workflow. Confirm API `Since` versions, minimum host version, capabilities, execution profiles, worker/frame boundaries, persistence, event delivery, and packaging limits. Do not assume APIs exist for panel placement or replacing the built-in diff.
- Before publication, check the current official catalog and public-directory requirements, including permitted file types and sizes, root manifest layout, and version tags. Local CLI validation and public-directory acceptance are separate checks.

## Orca and Git boundaries

- Keep Node, filesystem, and Git operations in the trusted worker. Frames use bundled local assets and communicate with their own worker.
- Run Git with argument arrays. Validate repository boundaries, paths, and refs before access or execution.
- Preserve action preparation, confirmation, state rechecks, and backup behavior when changing Git actions. Test mutations in disposable repositories.
- Follow the user's authorization for plugin loading and execution access. Do not approve a code-executing plugin, publish a release, create a remote repository, or push without authorization for that action.
- A plugin identity change can require separate execution approval. Follow the installed CLI approval result instead of assuming an old identity's approval transfers.

## User documentation

- English is the default. Keep Korean in matching `.ko.md` files, with reciprocal language links near the top.
- Update both language versions when changing behavior. Keep repository links within the selected language where a translation exists.
- The build includes both plugin README files. Their relative links must work in the installed artifact as well as the source tree.
- Use plain, factual prose. Distinguish implemented features, browser fixtures, local verification, and unpublished release plans.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
