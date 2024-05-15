import React, { createContext, useState, useContext } from "react";
import type { Host } from "@/lan/types";

type HostsProviderState = {
  hosts: Host[];
  setHosts: React.Dispatch<React.SetStateAction<Host[]>>;
};

type HostsProviderProps = {
  children: React.ReactNode;
};

const initialState: HostsProviderState = {
  hosts: [],
  setHosts: () => null,
};

const HostsContext = createContext<HostsProviderState>(initialState);

export function HostsProvider({ children }: HostsProviderProps) {
  const [hosts, setHosts] = useState<Host[]>([]);

  return (
    <HostsContext.Provider value={{ hosts, setHosts }}>
      {children}
    </HostsContext.Provider>
  );
}

export const useHosts = (): HostsProviderState => {
  const context = useContext(HostsContext);
  if (!context) {
    throw new Error("useHosts must be used within a HostsProvider");
  }
  return context;
};
