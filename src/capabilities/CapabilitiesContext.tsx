import { useQuery } from "@tanstack/react-query";
import { createContext, type FC, type ReactNode, useContext, useMemo } from "react";
import { getCapabilities } from "../api/statsig.ts";
import type { Capabilities } from "../types/index.ts";

const defaultCapabilities: Capabilities = {
  cleanup: { enabled: true },
};

type CapabilitiesContext = {
  readonly capabilities: Capabilities;
  readonly isLoading: boolean;
};

const Context = createContext<CapabilitiesContext>({
  capabilities: defaultCapabilities,
  isLoading: true,
});

type CapabilitiesProviderProps = {
  readonly children: ReactNode;
};

export const CapabilitiesProvider: FC<CapabilitiesProviderProps> = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["capabilities"],
    queryFn: getCapabilities,
    staleTime: Number.POSITIVE_INFINITY, // env vars don't change at runtime
    retry: false, // fail open - if the endpoint fails, we default to all enabled
  });

  const value = useMemo(
    (): CapabilitiesContext => ({
      capabilities: data ?? defaultCapabilities,
      isLoading,
    }),
    [data, isLoading],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useCapabilities = (): Capabilities => useContext(Context).capabilities;

export const useCapabilitiesLoading = (): boolean => useContext(Context).isLoading;

export const useCleanupEnabled = (): boolean => useContext(Context).capabilities.cleanup.enabled;
