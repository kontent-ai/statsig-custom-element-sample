import type { StatsigExperiment, CleanupResult } from '../types';

const getBaseUrl = (): string => {
  // In development with Netlify Dev, functions are at /.netlify/functions/
  // In production, they're at the same path
  return '/.netlify/functions';
};

export const listExperiments = async (): Promise<ReadonlyArray<StatsigExperiment>> => {
  const response = await fetch(`${getBaseUrl()}/list-experiments`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error ?? `Failed to list experiments: ${response.status}`);
  }

  return response.json();
};

export const getExperiment = async (id: string): Promise<StatsigExperiment | null> => {
  const response = await fetch(`${getBaseUrl()}/get-experiment?id=${encodeURIComponent(id)}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error ?? `Failed to get experiment: ${response.status}`);
  }

  return response.json();
};

type CreateExperimentParams = {
  readonly name: string;
  readonly hypothesis?: string;
  readonly description?: string;
};

export const createExperiment = async (params: CreateExperimentParams): Promise<StatsigExperiment> => {
  const response = await fetch(`${getBaseUrl()}/create-experiment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error ?? `Failed to create experiment: ${response.status}`);
  }

  return response.json();
};

export const getExperimentConsoleUrl = (experimentName: string): string =>
  `https://console.statsig.com/experiments/${encodeURIComponent(experimentName)}`;

type CleanupExperimentParams = {
  readonly experimentId: string;
  readonly experimentItemId: string;
  readonly experimentItemCodename: string;
  readonly environmentId: string;
  readonly winningVariant: 'control' | 'test';
  readonly variantGroupId: string;
  readonly decisionReason: string;
};

export const cleanupExperiment = async (params: CleanupExperimentParams): Promise<CleanupResult> => {
  const response = await fetch(`${getBaseUrl()}/cleanup-experiment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? `Failed to cleanup experiment: ${response.status}`);
  }

  return data;
};
