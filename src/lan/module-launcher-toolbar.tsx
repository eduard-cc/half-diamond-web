import ModuleLauncherButton from "./module-launcher-button";

export type Module = {
  isRunning: boolean;
  isPending: boolean;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  setRunning: (running: boolean) => void;
};

type ModuleLauncherToolbarProps = {
  monitor: Module;
  probe: Module;
};

export default function ModuleLauncherToolbar({
  monitor,
  probe,
}: ModuleLauncherToolbarProps) {
  const handleMonitorClick = async () => {
    if (monitor.isRunning) {
      await monitor.stop();
    } else {
      await monitor.start();
    }
  };

  const handleProbeClick = async () => {
    if (probe.isRunning) {
      await probe.stop();
    } else {
      await probe.start();
    }
  };

  return (
    <div className="flex gap-2">
      <ModuleLauncherButton
        module={monitor}
        onClick={handleMonitorClick}
        moduleName="Monitor"
      />
      <ModuleLauncherButton
        module={probe}
        onClick={handleProbeClick}
        moduleName="Probe"
        monitorIsRunning={monitor.isRunning}
      />
    </div>
  );
}
