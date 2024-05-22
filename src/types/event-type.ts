export enum EventType {
  HOST_NEW = "host.new",
  HOST_SEEN = "host.seen",
  HOST_CONNECTED = "host.connected",
  HOST_DISCONNECTED = "host.disconnected",
  SCAN_SYN = "scan.syn",
  SCAN_TCP = "scan.tcp",
  SCAN_UDP = "scan.udp",
  OS_DETECTED = "os.detected",
  ARP_SPOOF_STARTED = "arp.spoof.started",
  ARP_SPOOF_STOPPED = "arp.spoof.stopped",
}
