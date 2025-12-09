import type { StatsigExperiment, CreateExperimentParams } from '../types';

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

export const getExperiment = async (name: string): Promise<StatsigExperiment | null> => {
  const response = await fetch(`${getBaseUrl()}/get-experiment?name=${encodeURIComponent(name)}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error ?? `Failed to get experiment: ${response.status}`);
  }

  return response.json();
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
