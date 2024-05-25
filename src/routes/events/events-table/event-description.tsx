import PortBadge from "@/components/shared/port-badge";
import { EventType } from "@/types/event-type";
import type { Host } from "@/types/host";

type EventDescriptionProps = {
  eventType: EventType;
  children: React.ReactNode;
  hosts: Host[];
};

type PortScanProps = {
  scanType: string;
  host: Host;
  children: React.ReactNode;
};

export default function EventDescription({
  eventType,
  children,
  hosts,
}: EventDescriptionProps) {
  const PortScan: React.FC<PortScanProps> = ({ scanType, host, children }) => (
    <>
      <span>Port{host.open_ports && host.open_ports?.length > 1 && "s"} </span>
      <span className="space-x-1">
        {host.open_ports?.map((port) => (
          <PortBadge key={port.port} port={port} />
        ))}
      </span>
      <span>
        {" "}
        detected from {children} using {scanType} scan.
      </span>
    </>
  );

  return (
    <div className="m-1">
      {eventType === EventType.HOST_NEW ? (
        <p>New host discovered: {children}</p>
      ) : eventType === EventType.HOST_SEEN ? (
        <p>Activity captured from {children}</p>
      ) : eventType === EventType.HOST_CONNECTED ? (
        <p>{children} is back online.</p>
      ) : eventType === EventType.HOST_DISCONNECTED ? (
        <p>{children} has shown no recent activity.</p>
      ) : eventType === EventType.SCAN_SYN ? (
        <PortScan scanType="TCP SYN" host={hosts[0]}>
          {children}
        </PortScan>
      ) : eventType === EventType.SCAN_TCP ? (
        <PortScan scanType="TCP connect" host={hosts[0]}>
          {children}
        </PortScan>
      ) : eventType === EventType.SCAN_UDP ? (
        <PortScan scanType="UDP" host={hosts[0]}>
          {children}
        </PortScan>
      ) : eventType === EventType.OS_DETECTED ? (
        <p>
          OS detected from {children} as {hosts[0].os}.
        </p>
      ) : eventType === EventType.ARP_SPOOF_STARTED ? (
        <span>
          Started ARP Spoofing target{hosts.length > 1 && "s"} {children}
        </span>
      ) : eventType === EventType.ARP_SPOOF_STOPPED ? (
        <p>Stopped ARP Spoof module. ARP tables have been restored.</p>
      ) : null}
    </div>
  );
}
