export type ExperimentVariant = "control" | "test";

/**
 * Parse experiment ID from custom element JSON value
 */
export const parseExperimentId = (value: string | null): string | null => {
  if (!value) {
    return null;
  }
  try {
    const parsed = JSON.parse(value) as { experimentId?: string };
    return parsed.experimentId ?? null;
  } catch {
    return null;
  }
};
