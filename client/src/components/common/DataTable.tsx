import React from "react";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import Alert from "./Alert";
import { cn } from "../../utils/cn";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  loadingMessage?: string;
  error?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  renderActions?: (row: T) => React.ReactNode;
  className?: string;
}

const alignClass = (align?: "left" | "right" | "center") =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "";

function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  loadingMessage = "Loading…",
  error,
  emptyTitle = "No records found",
  emptyDescription,
  renderActions,
  className,
}: DataTableProps<T>) {
  const colSpan = columns.length + (renderActions ? 1 : 0);

  return (
    <div
      className={cn(
        "bg-white rounded-3xl shadow-[0_1px_3px_rgba(16,26,46,0.06),0_1px_2px_rgba(16,26,46,0.04)] overflow-hidden",
        className,
      )}
    >
      {error ? (
        <div className="p-4">
          <Alert variant="error">{error}</Alert>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-slate-400 uppercase tracking-wide">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-5 py-4 font-semibold",
                      alignClass(col.align),
                      col.className,
                    )}
                  >
                    {col.label}
                  </th>
                ))}
                {renderActions && (
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={colSpan}>
                    <LoadingState message={loadingMessage} />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={colSpan}>
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={rowKey(row)} className="hover:bg-slate-50 transition-colors">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-5 py-4 text-slate-600",
                          alignClass(col.align),
                          col.className,
                        )}
                      >
                        {col.render ? col.render(row) : (row as any)[col.key]}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {renderActions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DataTable;
