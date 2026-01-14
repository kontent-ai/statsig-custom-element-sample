import "dotenv/config";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { migrateContentRun } from "@kontent-ai/data-ops";
import JSZip from "jszip";

const __dirname = dirname(fileURLToPath(import.meta.url));

const environmentId = process.env.VITE_KONTENT_ENVIRONMENT_ID;
const apiKey = process.env.KONTENT_MANAGEMENT_API_KEY;

if (!(environmentId && apiKey)) {
  console.error("Missing required environment variables:");
  if (!environmentId) {
    console.error("  - VITE_KONTENT_ENVIRONMENT_ID");
  }
  if (!apiKey) {
    console.error("  - KONTENT_MANAGEMENT_API_KEY");
  }
  console.error("\nPlease copy .env.template to .env and configure the values.");
  process.exit(1);
}

type ContentItem = { readonly system: { readonly codename: string } };
type ContentData = {
  readonly items: ReadonlyArray<ContentItem>;
  readonly assets: ReadonlyArray<unknown>;
};

const contentItemsPath = resolve(__dirname, "../kontent-ai-data/contentItems.json");
const contentData = JSON.parse(readFileSync(contentItemsPath, "utf-8")) as ContentData;

console.log("Importing content items to Kontent.ai...");
console.log(`Items to import: ${contentData.items.map((item) => item.system.codename).join(", ")}`);

// Create ZIP with items.json and assets.json for migrateContentRun
const zip = new JSZip();
zip.file("items.json", JSON.stringify(contentData.items));
zip.file("assets.json", JSON.stringify(contentData.assets));

const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
const tempZipPath = resolve(__dirname, "../temp-content.zip");
writeFileSync(tempZipPath, zipBuffer);

// migrateContentRun expects a relative path (it prepends './')
const relativeZipPath = "temp-content.zip";

try {
  await migrateContentRun({
    targetEnvironmentId: environmentId,
    targetApiKey: apiKey,
    filename: relativeZipPath,
  });

  console.log("Content items imported successfully!");
  console.log(
    '\nNote: Most content items are automatically published. The "Homepage CTA Experiment" item remains in draft - publish it after configuring the Statsig experiment.',
  );
} finally {
  unlinkSync(tempZipPath);
}
