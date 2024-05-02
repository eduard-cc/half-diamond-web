import { columns } from "./columns";
import { DataTable } from "./data-table";
import ModuleLauncherToolbar from "./module-launcher-toolbar";
import useFetchHosts from "./use-fetch-hosts";

export default function Hosts() {
  const { data, isPending, error, monitor, probe } = useFetchHosts();

  return (
    <div className="container mx-auto py-2">
      <ModuleLauncherToolbar monitor={monitor} probe={probe} />
      <DataTable
        columns={columns}
        data={data}
        isPending={isPending}
        error={error}
      />
    </div>
  );
}
