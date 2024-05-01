import { useState, ReactNode } from "react";
import { HostCountContext } from "./use-host-count";

export function HostCountProvider({ children }: { children: ReactNode }) {
  const [hostCount, setHostCount] = useState(0);

  const value = {
    hostCount,
    setHostCount,
  };

  return (
    <HostCountContext.Provider value={value}>
      {children}
    </HostCountContext.Provider>
  );
}
