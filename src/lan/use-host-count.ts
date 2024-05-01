import { createContext, useContext } from "react";

interface HostCountContextValue {
  hostCount: number;
  setHostCount: (count: number) => void;
}

export const HostCountContext = createContext<
  HostCountContextValue | undefined
>(undefined);

export function useHostCount() {
  const context = useContext(HostCountContext);
  if (!context) {
    throw new Error("useHostCount must be used within a HostCountProvider");
  }
  return context;
}
