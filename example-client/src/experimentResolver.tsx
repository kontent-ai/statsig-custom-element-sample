import type { IContentItem } from "@kontent-ai/delivery-sdk";
import type { PortableTextReactResolvers } from "@kontent-ai/rich-text-resolver-react";
import { Fragment, type JSX } from "react";
import { DEFAULT_EXPERIMENT_TYPE_CODENAME } from "./constants.ts";
import type { StatsigExperimentType, TextBlockType } from "./models/index.ts";
import { type ExperimentVariant, parseExperimentId } from "./types.ts";

const experimentTypeCodename =
  (import.meta.env.VITE_CONTENT_TYPE_CODENAME as string | undefined) ??
  DEFAULT_EXPERIMENT_TYPE_CODENAME;

type GetWinningVariant = (experimentId: string) => ExperimentVariant;

type ContentItem = IContentItem;

const renderTextBlock = (item: TextBlockType): JSX.Element => {
  return <p>{item.elements.text.value}</p>;
};

export const renderContentItem = (
  item: ContentItem,
  getWinningVariant: GetWinningVariant,
): JSX.Element | null => {
  if (item.system.type === "text_block") {
    return renderTextBlock(item as TextBlockType);
  }
  if (item.system.type === experimentTypeCodename) {
    return renderExperiment(item as StatsigExperimentType, getWinningVariant);
  }
  return <div>Unknown content type: {item.system.type}</div>;
};

const renderExperiment = (
  item: StatsigExperimentType,
  getWinningVariant: GetWinningVariant,
): JSX.Element => {
  const experimentId = parseExperimentId(item.elements.statsig_a_b_testing.value);

  if (!experimentId) {
    return <div>Error: Missing experiment ID in content item: {item.system.codename}</div>;
  }

  const variant = getWinningVariant(experimentId);
  const winningItems = item.elements[variant].linkedItems;

  return (
    <div className="experiment-content">
      <span className={`variant-badge variant-${variant}`}>{variant.toUpperCase()}</span>
      {winningItems.map((contentItem) => (
        <Fragment key={contentItem.system.id}>
          {renderContentItem(contentItem, getWinningVariant)}
        </Fragment>
      ))}
    </div>
  );
};

export const createExperimentAwareResolvers = (
  linkedItems: ReadonlyArray<ContentItem>,
  getWinningVariant: GetWinningVariant,
): PortableTextReactResolvers => ({
  types: {
    componentOrItem: ({ value }) => {
      const item = linkedItems.find((i) => i.system.id === value.componentOrItem._ref);

      if (!item) {
        return <div>Content item not found: {value.componentOrItem._ref}</div>;
      }

      return renderContentItem(item, getWinningVariant);
    },
  },
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
});
