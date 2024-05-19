import PortBadge from "@/components/port-badge";
import { EventType, Host } from "@/lan/types";

type EventDescriptionProps = {
  eventType: EventType;
  children: React.ReactNode;
  host: Host;
};

type PortScanProps = {
  scanType: string;
  host: Host;
  children: React.ReactNode;
};

export default function EventDescription({
  eventType,
  children,
  host,
}: EventDescriptionProps) {
  const PortScan: React.FC<PortScanProps> = ({ scanType, host, children }) => (
    <>
      <span>Ports </span>
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
        <PortScan scanType="TCP SYN" host={host}>
          {children}
        </PortScan>
      ) : eventType === EventType.SCAN_TCP ? (
        <PortScan scanType="TCP connect" host={host}>
          {children}
        </PortScan>
      ) : eventType === EventType.SCAN_UDP ? (
        <PortScan scanType="UDP" host={host}>
          {children}
        </PortScan>
      ) : eventType === EventType.OS_DETECTED ? (
        <p>
          OS detected from {children} as {host.os}.
        </p>
      ) : null}
    </div>
  );
}
