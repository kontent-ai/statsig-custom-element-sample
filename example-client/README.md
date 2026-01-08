# Statsig Experiment Resolution Example

Minimal example demonstrating how to resolve A/B test variants using the Statsig SDK with Kontent.ai. Shows two patterns:

1. **Component in Rich Text** - Experiments embedded inline within rich text content
2. **Linked Items** - Experiments as linked items in a content type

> [!WARNING]
> This example is intended for **test/temporary Kontent.ai projects only**. The sync scripts will create content types and items in your environment. Do not run these scripts on production projects.

## Prerequisites

- **Kontent.ai account** with a test environment
  - Environment ID (from Environment settings)
  - Management API Key (for importing content)
- **Statsig account** with:
  - Client SDK Key (from Project Settings → Keys & Environments)
  - An experiment to test with

## Quick Start

### 1. Deploy the Custom Element

First, deploy the Statsig custom element. See the [main project README](../README.md) for deployment instructions.

### 2. Configure Environment Variables

```bash
cp .env.template .env
```

Edit `.env` and configure:
- `VITE_STATSIG_CLIENT_KEY` - Your Statsig Client SDK Key
- `VITE_KONTENT_ENVIRONMENT_ID` - Your Kontent.ai environment ID
- `KONTENT_MANAGEMENT_API_KEY` - Your Management API key (for import only, not exposed to browser)

### 3. Update Custom Element URL

Edit `kontent-ai-data/contentTypes.json`, find the `statsig_experiment` entry, and replace `YOUR_DEPLOYED_URL_HERE` in `source_url` with your deployed custom element URL.

### 4. Sync Content to Kontent.ai

Install dependencies and sync all content types and sample content:

```bash
pnpm install
pnpm sync:all
```

This creates:
- **Content types**: text_block, statsig_experiment, landing_page, article_page
- **Content items**: Sample text blocks, experiment, landing page, and article page

> [!NOTE]
> The sync command uses [@kontent-ai/data-ops](https://github.com/kontent-ai/data-ops) for content types and [@kontent-ai/migration-toolkit](https://github.com/kontent-ai/migration-toolkit) for content items. It works safely on non-empty projects - only the specified types are synced, existing types are not affected.

### 5. Create a Statsig Experiment

1. In Kontent.ai, open the **Homepage CTA Experiment** content item
2. In the Statsig A/B Testing custom element, click **Create New** to create an experiment
3. In Statsig, start the experiment
4. **Publish** the Homepage CTA Experiment content item in Kontent.ai

### 6. Run the Example

```bash
pnpm dev
```

Open http://localhost:5173 to see the experiment in action.

> [!TIP]
> To see different variants, clear your browser's localStorage to get a new user ID, or manually change the user ID.

## Integrating into Your Project

Follow these steps to add experiment resolution to your existing frontend:

### 1. Install Dependencies

```bash
npm install @statsig/react-bindings
# If using rich text with experiment components:
npm install @kontent-ai/rich-text-resolver @kontent-ai/rich-text-resolver-react
```

### 2. Set Up Statsig Provider

Wrap your app with `StatsigProvider` to initialize the Statsig SDK.

```tsx
import { StatsigProvider } from "@statsig/react-bindings";

<StatsigProvider
  sdkKey="your-statsig-client-key"
  user={{ userID: "unique-user-id" }}
>
  <App />
</StatsigProvider>
```

See [`src/main.tsx`](./src/main.tsx) for the full implementation.

### 3. Generate Types

Use the [Kontent.ai model generator](https://github.com/kontent-ai/model-generator-js) to generate TypeScript types for your content model:

```bash
pnpm generate:types
```

See [`package.json`](./package.json) for the script configuration.

### 4. Implement Variant Resolution

Use the Statsig client to get the assigned variant for each experiment:

```tsx
import { useStatsigClient } from "@statsig/react-bindings";

const { client } = useStatsigClient();

const getWinningVariant = (experimentId: string) => {
  const experiment = client.getExperiment(experimentId);
  return experiment.get("variant", "control"); // Returns "control" or "test"
};
```

See [`src/LinkedItemExample.tsx`](./src/LinkedItemExample.tsx) and [`src/RichTextExample.tsx`](./src/RichTextExample.tsx) for how this is used in practice.

### 5. Render Experiment Content

Choose the pattern that fits your use case and implement the rendering logic. See [Resolving Rich Text](#resolving-rich-text) and [Resolving Linked Items](#resolving-linked-items) below for details.

The core rendering logic is in [`src/experimentResolver.tsx`](./src/experimentResolver.tsx).

## How Variant Resolution Works

Both patterns use the same underlying resolution logic:

1. `StatsigProvider` initializes the SDK with a user ID (persisted in localStorage)
2. Extract the experiment ID from `statsig_a_b_testing.value`
3. Call `client.getExperiment(id)` to get the assigned variant
4. Statsig returns `control` or `test` based on user ID
5. Render content from the winning variant's linked items

> [!TIP]
> **Terminology note**: The term "winning variant" refers to the variant assigned to the current user during an active experiment. Statsig deterministically assigns each user to a variant based on their user ID, ensuring they always see the same experience. This is different from Kontent.ai language variants - here "variant" refers to the experiment groups (control/test).

### Resolving Rich Text

Use when experiments are embedded inline within article content.

**Resolution:**
1. Transform rich text to portable text using `transformToPortableText()`
2. Use `createExperimentAwareResolvers()` to create custom resolvers
3. The resolver detects experiment components and resolves them via Statsig

### Resolving Linked Items

Use when experiments are part of a structured page layout and may be reused.

**Resolution:**
1. When iterating over the linked items, get the winning variant for each experiment from Statsig and only render the content from the winning variant

## Troubleshooting

### "Error loading content" message

- Make sure you ran `pnpm sync:all` successfully
- Verify the **Homepage CTA Experiment** content item is **published** in Kontent.ai (other items are auto-published during import)
- Check that `VITE_KONTENT_ENVIRONMENT_ID` is correct

### "Missing environment variable" error

- Ensure `.env` file exists and all required variables are set
- The app requires both `VITE_STATSIG_CLIENT_KEY` and `VITE_KONTENT_ENVIRONMENT_ID`

### Sync fails

- Verify your `KONTENT_MANAGEMENT_API_KEY` has write permissions
- Make sure the custom element URL is updated in `statsig_experiment.json`

### Variant not changing

- Statsig assigns variants deterministically by user ID
- Clear localStorage to reset user ID: `localStorage.removeItem('statsig_user_id')`
- Verify the experiment is running in Statsig (not paused or stopped)
