import type { Handler, HandlerEvent } from '@netlify/functions';
import { expectEnvVars, handleCorsRequests, parseJsonBody, responses } from './utils/http';
import { createExperiment } from './utils/statsig';
import { z } from 'zod';

const allowedMethods = ["POST"] as const;

const CreateExperimentBodySchema = z.object({
  name: z.string().min(1, 'Missing name parameter'),
  hypothesis: z.string().optional(),
  description: z.string().optional(),
});

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

  const parseResult = CreateExperimentBodySchema.safeParse(parseJsonBody(event.body));

  if (!parseResult.success) {
    return responses.badRequest(parseResult.error.message, allowedMethods);
  }

  const result = await createExperiment(apiKey, parseResult.data);

  if (!result.success) {
    return responses.internalError(`Failed to create experiment. Statsig error: ${result.error}`, allowedMethods);
  }

  return responses.ok(result.result, allowedMethods);
};