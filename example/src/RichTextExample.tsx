import { useCallback, useMemo } from 'react';
import { useStatsigClient } from '@statsig/react-bindings';
import { transformToPortableText } from '@kontent-ai/rich-text-resolver';
import { PortableText } from '@kontent-ai/rich-text-resolver/utils/react';
import { createExperimentAwareResolvers } from './experimentResolver';
import { mockRichTextValue, mockLinkedItems, type ExperimentVariant } from './mockData';

export const RichTextExample = () => {
  const { client } = useStatsigClient();

  const getWinningVariant = useCallback(
    (experimentId: string): ExperimentVariant => {
      const experiment = client.getExperiment(experimentId);
      return experiment.get('variant', 'control') as ExperimentVariant;
    },
    [client],
  );

  const resolvers = useMemo(
    () => createExperimentAwareResolvers(mockLinkedItems, getWinningVariant),
    [getWinningVariant],
  );

  const portableText = useMemo(() => transformToPortableText(mockRichTextValue), []);

  return (
    <div>
      <h2>Rich Text Component Example</h2>
      <PortableText value={portableText} components={resolvers} />

      <hr />
      <details>
        <summary>How this works</summary>
        <ol style={{ lineHeight: 1.8 }}>
          <li>
            Rich text contains an experiment as a component:{' '}
            <code>&lt;object data-type="component" data-id="..."&gt;</code>
          </li>
          <li>
            We transform the rich text to portable text using{' '}
            <code>transformToPortableText()</code>
          </li>
          <li>
            Custom resolvers from <code>createExperimentAwareResolvers()</code> handle experiment
            components
          </li>
          <li>The resolver looks up the winning variant from Statsig and renders the correct content</li>
        </ol>
      </details>
    </div>
  );
};
