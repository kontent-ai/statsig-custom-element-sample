import { Fragment, useCallback } from 'react';
import { useStatsigClient } from '@statsig/react-bindings';
import { renderContentItem } from './experimentResolver';
import {
  mockLandingPage,
  type ExperimentVariant,
  type LandingPageElements,
} from './mockData';

export const LinkedItemExample = () => {
  const { client } = useStatsigClient();

  const getWinningVariant = useCallback(
    (experimentId: string): ExperimentVariant => {
      const experiment = client.getExperiment(experimentId);
      return experiment.get('variant', 'control') as ExperimentVariant;
    },
    [client],
  );

  const pageElements = mockLandingPage.elements as LandingPageElements;

  return (
    <div>
      <h2>Linked Item Example</h2>
      <p>
        <strong>Content Type:</strong> <code>{mockLandingPage.system.type}</code>
      </p>
      <p>
        <strong>Page Title:</strong> {pageElements.title.value}
      </p>
      <hr />

      <h3>Experiments (from linked items element)</h3>
      {pageElements.experiments.linkedItems.map((item) => (
        <Fragment key={item.system.id}>{renderContentItem(item, getWinningVariant)}</Fragment>
      ))}

      <hr />
      <details>
        <summary>How this works</summary>
        <ol style={{ lineHeight: 1.8 }}>
          <li>
            The parent content item (<code>landing_page</code>) has an <code>experiments</code>{' '}
            linked items element
          </li>
          <li>This element contains references to experiment content items</li>
          <li>
            We get the winning variant for each experiment from Statsig and only render the content from the winning variant
          </li>
        </ol>
      </details>
    </div>
  );
};
