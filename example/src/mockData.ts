const experimentId = import.meta.env.VITE_EXPERIMENT_ID || 'homepage_cta_test';

export type ExperimentVariant = 'control' | 'test';

export type ContentItem = {
  readonly system: {
    readonly id: string;
    readonly codename: string;
    readonly type: string;
  };
  readonly elements: Record<string, unknown>;
};

// =============================================================================
// Component Example: Experiment embedded as a component in rich text
// =============================================================================

export const mockRichTextValue = `
<p>Welcome to our website!</p>
<object type="application/kenticocloud" data-type="component" data-id="exp_001"></object>
<p>Thank you for visiting.</p>
`;

export const mockLinkedItems: ReadonlyArray<ContentItem> = [
  {
    system: {
      id: 'exp_001',
      codename: 'homepage_cta_experiment',
      type: 'experiment',
    },
    elements: {
      statsig_a_b_testing: {
        value: JSON.stringify({ experimentId }),
      },
      control: {
        linkedItems: [
          {
            system: {
              id: 'control_001',
              codename: 'control_content',
              type: 'text_block',
            },
            elements: {
              text: { value: 'Sign up for our newsletter!' },
            },
          },
        ],
      },
      test: {
        linkedItems: [
          {
            system: {
              id: 'test_001',
              codename: 'test_content',
              type: 'text_block',
            },
            elements: {
              text: { value: 'Get 20% off when you subscribe today!' },
            },
          },
        ],
      },
    },
  },
];

// =============================================================================
// Linked Item Example: Experiment as a linked item in a linked items element
// =============================================================================

export type LinkedItemsElement = {
  readonly linkedItems: ReadonlyArray<ContentItem>;
};

export type LandingPageElements = {
  readonly title: { readonly value: string };
  readonly experiments: LinkedItemsElement;
};

export const mockLandingPage: ContentItem = {
  system: {
    id: 'landing_001',
    codename: 'homepage',
    type: 'landing_page',
  },
  elements: {
    title: { value: 'Welcome to Our Store' },
    experiments: {
      linkedItems: [
        {
          system: {
            id: 'exp_002',
            codename: 'hero_banner_experiment',
            type: 'experiment',
          },
          elements: {
            statsig_a_b_testing: {
              value: JSON.stringify({ experimentId }),
            },
            control: {
              linkedItems: [
                {
                  system: {
                    id: 'hero_control',
                    codename: 'hero_control_content',
                    type: 'text_block',
                  },
                  elements: {
                    text: { value: 'Discover our latest collection' },
                  },
                },
              ],
            },
            test: {
              linkedItems: [
                {
                  system: {
                    id: 'hero_test',
                    codename: 'hero_test_content',
                    type: 'text_block',
                  },
                  elements: {
                    text: { value: 'Shop now and save 25% on everything!' },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  } satisfies LandingPageElements,
};
