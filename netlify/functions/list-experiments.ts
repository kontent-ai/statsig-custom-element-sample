import type { Handler, HandlerEvent } from '@netlify/functions';
import { expectEnvVars, handleCorsRequests, responses } from './utils/http';
import { listExperiments } from './utils/statsig';

const allowedMethods = ["GET"] as const;

export const handler: Handler = async (event: HandlerEvent) => {
  const corsResponse = handleCorsRequests(event, allowedMethods);
  if (corsResponse) {
    return corsResponse;
  }

  const varsRes = expectEnvVars(allowedMethods, ["STATSIG_CONSOLE_KEY"]);
  if (!varsRes.success) {
    return varsRes.response;
  }
  const [apiKey] = varsRes.result;
  
  const result = await listExperiments(apiKey);

  if (!result.success) {
    return responses.internalError(`Statsig API error: ${result.error}`, allowedMethods);
  }

  return responses.ok(result.result, allowedMethods);
};
