import ModuleLauncherButton from "./module-launcher-button";
import type { Module } from "./use-module";

type ModuleLauncherToolbarProps = {
  monitor: Module;
  probe: Module;
};

export default function ModuleLauncherToolbar({
  monitor,
  probe,
}: ModuleLauncherToolbarProps) {
  const handleModuleClick = async (module: Module) => {
    module.isRunning ? await module.stop() : await module.start();
  };

  return (
    <>
      <ModuleLauncherButton
        module={monitor}
        onClick={() => handleModuleClick(monitor)}
        moduleName="Monitor"
      />
      <ModuleLauncherButton
        module={probe}
        onClick={() => handleModuleClick(probe)}
        moduleName="Probe"
        monitorIsRunning={monitor.isRunning}
      />
    </>
  );
}
