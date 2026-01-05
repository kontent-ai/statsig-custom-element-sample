import type { Handler, HandlerEvent } from "@netlify/functions";
import { cleanupEnvVars } from "./cleanup-experiment.ts";
import { checkEnvVarsExist, handleCorsRequests, responses } from "./utils/http.ts";

const allowedMethods = ["GET"] as const;

export const handler: Handler = (event: HandlerEvent) => {
  const corsResponse = handleCorsRequests(event, allowedMethods);
  if (corsResponse) {
    return Promise.resolve(corsResponse);
  }

  const cleanupCheck = checkEnvVarsExist(cleanupEnvVars);

  if (!cleanupCheck.allExist) {
    console.warn(
      `[capabilities] Cleanup disabled - missing env vars: ${cleanupCheck.missing.join(", ")}`,
    );
  }

  return Promise.resolve(
    responses.ok(
      {
        cleanup: { enabled: cleanupCheck.allExist },
      },
      allowedMethods,
    ),
  );
};
