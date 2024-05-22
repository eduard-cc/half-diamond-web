import { Port } from "./port";

export type Host = {
  ip: string;
  mac: string;
  vendor: string;
  last_seen: string;
  status: "Online" | "Offline";
  name?: string;
  os?: string;
  open_ports?: Port[];
};
