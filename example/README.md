# Statsig Experiment Resolution Example

Minimal example demonstrating how to resolve A/B test variants using the Statsig SDK with Kontent.ai. Shows two patterns:

1. **Component in Rich Text** - Experiments embedded inline within rich text content
2. **Linked Items** - Experiments as linked items in a content type

## Prerequisites

- Statsig account with a **Client SDK Key** (from Project Settings → Keys & Environments)
- An existing experiment in Statsig to test with

## Quick Start

```bash
cp .env.template .env
# Edit .env and add your VITE_STATSIG_CLIENT_KEY and VITE_EXPERIMENT_ID
pnpm i
pnpm dev
```

## Pattern 1: Component in Rich Text

Use when experiments are embedded inline within article content.

**Resolution:**
1. Transform rich text to portable text using `transformToPortableText()`
2. Use `createExperimentAwareResolvers()` to create custom resolvers
3. The resolver detects experiment components and resolves them via Statsig

## Pattern 2: Linked Items

Use when experiments are part of a structured page layout and may be reused.

**Resolution:**
1. When iterating over the linked items, get the winning variant for each experiment from Statsig and only render the content from the winning variant

## How Variant Resolution Works

Both patterns use the same underlying resolution logic:

1. `StatsigProvider` initializes the SDK with a user ID (persisted in localStorage)
2. Extract the experiment ID from `statsig_a_b_testing.value`
3. Call `client.getExperiment(id)` to get the assigned variant
4. Statsig returns `control` or `test` based on user ID
5. Render content from the winning variant's linked items
