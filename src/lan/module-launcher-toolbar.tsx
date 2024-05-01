import ModuleLauncherButton from "./module-launcher-button";

type ModuleLauncherToolbarProps = {
  monitor: any;
  probe: any;
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
