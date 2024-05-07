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

export type Event = {
  type: EventType;
  data: Host;
};

export enum PortScanType {
  SYN = "-sS",
  TCP = "-sT",
  UDP = "-sU",
}

export enum EventType {
  HOST_NEW = "host.new",
  HOST_SEEN = "host.seen",
  HOST_CONNECTED = "host.connected",
  HOST_DISCONNECTED = "host.disconnected",
  SCAN_TCP = "scan.tcp",
  SCAN_SYN = "scan.syn",
  SCAN_UDP = "scan.udp",
}
