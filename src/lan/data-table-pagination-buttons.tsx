import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";

type DataTablePaginationButtonsProps<TData> = {
  table: Table<TData>;
};

export default function DataTablePaginationButtons<TData>({
  table,
}: DataTablePaginationButtonsProps<TData>) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
}
