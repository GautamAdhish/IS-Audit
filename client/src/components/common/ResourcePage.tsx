import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import Badge from "./Badge";
import Button from "./Button";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { resourceApi } from "../../lib/api";

type Field = {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
  selectResource?: string;
  selectLabel?: string;
  placeholder?: string;
  hiddenInTable?: boolean;
  hiddenInForm?: boolean;
  multiline?: boolean;
  accept?: string;
};

type Props = {
  title: string;
  subtitle: string;
  resource: string;
  fields: Field[];
  searchKeys: string[];
  filters?: { key: string; label: string; values: string[] }[];
  transform?: (row: any) => any;
  canDelete?: boolean;
  canCreate?: boolean;
  renderCell?: (row: any, field: Field) => React.ReactNode;
  rowActions?: (row: any) => React.ReactNode;
};

const display = (value: any) =>
  typeof value === "object" && value
    ? value.name || value.title || value.code || "—"
    : (value ?? "—");

export default function ResourcePage({
  title,
  subtitle,
  resource,
  fields,
  searchKeys,
  filters = [],
  transform = (value) => value,
  canDelete = true,
  canCreate = true,
  renderCell,
  rowActions,
}: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState<Record<string, any[]>>({});
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const api = useMemo(() => resourceApi(resource), [resource]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.list("limit=100&sort=-createdAt");
      const nextRows = Array.isArray(response.data)
        ? response.data.map(transform)
        : [];
      setRows(nextRows);
    } catch (exception: any) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [resource]);

  useEffect(() => {
    const targets = fields.filter((field) => field.selectResource);
    Promise.all(
      targets.map(async (field) => {
        try {
          const response = await resourceApi(field.selectResource!).list(
            "limit=100",
          );
          return [field.key, response.data || []] as const;
        } catch {
          return [field.key, []] as const;
        }
      }),
    ).then((entries) => setSelectOptions(Object.fromEntries(entries)));
  }, [resource]);

  const filtered = rows.filter((row) => {
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      searchKeys.some((key) =>
        String(display(row[key])).toLowerCase().includes(query),
      );
    const matchesFilters = filters.every((currentFilter) => {
      const selected = filter[currentFilter.key];
      return (
        !selected ||
        selected === "All" ||
        String(display(row[currentFilter.key])) === selected
      );
    });
    return matchesSearch && matchesFilters;
  });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(event.currentTarget as HTMLFormElement);
    const useMultipart = fields.some((field) => field.type === "file");
    const body: any = useMultipart ? new FormData() : {};

    fields.forEach((field) => {
      if (field.hiddenInForm || field.key === "code") return;

      const value = form.get(field.key);

      if (field.type === "file") {
        if (value instanceof File && value.size > 0) {
          body.append(field.key, value);
        }
        return;
      }

      if (value === null || value === "") return;

      if (body instanceof FormData) {
        body.append(field.key, String(value));
      } else {
        body[field.key] = value;
      }
    });

    if (!(body instanceof FormData)) {
      fields
        .filter((field) => field.type === "number")
        .forEach((field) => {
          if (body[field.key] !== undefined)
            body[field.key] = Number(body[field.key]);
        });
    }

    try {
      if (editing?.mode === "edit") {
        await api.update(editing._id, body);
      } else {
        await api.create(body);
      }
      setEditing(null);
      await load();
    } catch (exception: any) {
      setError(exception.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this record? This action cannot be undone.")) return;
    try {
      await api.remove(id);
      setRows((current) => current.filter((row) => row._id !== id));
    } catch (exception: any) {
      setError(exception.message);
    }
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          canCreate ? (
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setEditing({ mode: "create" })}
            >
              New
            </Button>
          ) : undefined
        }
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
          />
        </div>

        {filters.map((currentFilter) => (
          <select
            key={currentFilter.key}
            value={filter[currentFilter.key] || "All"}
            onChange={(event) =>
              setFilter({ ...filter, [currentFilter.key]: event.target.value })
            }
            className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
          >
            <option>All</option>
            {currentFilter.values.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                {fields
                  .filter((field) => !field.hiddenInTable)
                  .map((field) => (
                    <th key={field.key} className="px-4 py-3 font-medium">
                      {field.label}
                    </th>
                  ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="p-10 text-center text-slate-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-50">
                    {fields
                      .filter((field) => !field.hiddenInTable)
                      .map((field) => (
                        <td
                          key={field.key}
                          className="px-4 py-3 text-slate-600"
                        >
                          {renderCell ? (
                            renderCell(row, field)
                          ) : [
                              "status",
                              "severity",
                              "level",
                              "priority",
                              "role",
                              "type",
                            ].includes(field.key) ? (
                            <Badge label={display(row[field.key])} />
                          ) : (
                            display(row[field.key])
                          )}
                        </td>
                      ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {rowActions?.(row)}
                        <button
                          onClick={() => setEditing({ ...row, mode: "edit" })}
                          className="p-2 text-slate-400 hover:text-ink-700 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => remove(row._id)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && !filtered.length && (
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="p-10 text-center text-slate-400"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={submit}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {editing.mode === "edit" ? "Edit" : "Create"}{" "}
                  {title.replace(/s$/, "")}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changes are saved directly to MongoDB.
                </p>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields
                .filter((field) => !field.hiddenInForm && field.key !== "code")
                .map((field) => (
                  <div
                    key={field.key}
                    className={field.multiline ? "md:col-span-2" : ""}
                  >
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {field.label}
                    </label>

                    {field.type === "file" ? (
                      <input
                        name={field.key}
                        type="file"
                        accept={field.accept}
                        required={field.required && editing.mode === "create"}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                      />
                    ) : field.options || field.selectResource ? (
                      <select
                        name={field.key}
                        defaultValue={
                          editing.mode === "edit"
                            ? editing[field.key]?._id ||
                              editing[field.key] ||
                              ""
                            : ""
                        }
                        required={field.required}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                      >
                        <option value="">Select…</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                        {selectOptions[field.key]?.map((option) => (
                          <option key={option._id} value={option._id}>
                            {field.selectLabel
                              ? option[field.selectLabel]
                              : option.name}
                          </option>
                        ))}
                      </select>
                    ) : field.multiline ? (
                      <textarea
                        name={field.key}
                        defaultValue={display(editing[field.key])}
                        required={field.required}
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                      />
                    ) : (
                      <input
                        name={field.key}
                        defaultValue={
                          editing.mode === "edit"
                            ? typeof editing[field.key] === "string"
                              ? editing[field.key]
                              : display(editing[field.key])
                            : ""
                        }
                        type={field.type || "text"}
                        required={
                          field.required &&
                          !(editing.mode === "edit" && field.key === "password")
                        }
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                      />
                    )}
                  </div>
                ))}
            </div>

            <div className="px-5 py-4 border-t flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
