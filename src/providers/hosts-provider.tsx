import React, { createContext, useState, useContext, useMemo } from "react";
import type { Host } from "@/lan/types";

type HostsProviderState = {
  hosts: Host[];
  setHosts: React.Dispatch<React.SetStateAction<Host[]>>;
  onlineHostsCount: number;
};

type HostsProviderProps = {
  children: React.ReactNode;
};

const initialState: HostsProviderState = {
  hosts: [],
  setHosts: () => null,
  onlineHostsCount: 0,
};

const HostsContext = createContext<HostsProviderState>(initialState);

export function HostsProvider({ children }: HostsProviderProps) {
  const [hosts, setHosts] = useState<Host[]>([]);

  const onlineHostsCount = useMemo(() => {
    return hosts.filter((host) => host.status === "Online").length;
  }, [hosts]);

  return (
    <HostsContext.Provider value={{ hosts, setHosts, onlineHostsCount }}>
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
