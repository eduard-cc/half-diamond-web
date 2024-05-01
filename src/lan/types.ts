export type Host = {
  ip: string;
  mac: string;
  vendor: string;
  name: string;
  last_seen: string;
  status: "Online" | "Offline";
  os?: string;
  open_ports?: Port[];
};

export type Port = {
  port: number;
  protocol: string;
  state: string;
  name?: string;
  product?: string;
  extrainfo?: string;
  reason?: string;
  version?: string;
  conf?: string;
};
