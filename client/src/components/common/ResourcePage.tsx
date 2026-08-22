import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "./PageHeader";
import Badge, { statusVariant } from "./Badge";
import Button from "./Button";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import DataTable, { type DataTableColumn } from "./DataTable";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import FormField from "./FormField";
import Alert from "./Alert";
import StatTile from "./StatTile";
import IconChip from "./IconChip";
import { Pencil, Plus, Search, Trash2, type LucideIcon } from "lucide-react";
import { resourceApi } from "../../lib/api";

const BADGE_FIELD_KEYS = [
  "status",
  "severity",
  "level",
  "priority",
  "role",
  "type",
];

// statusVariant() returns "gray" for unrecognised strings; StatTile/IconChip
// use "neutral" for the same idea, so this is the one place that translates.
const toTileTone = (value: string) => {
  const variant = statusVariant(value);
  return variant === "gray" ? "neutral" : variant;
};

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
  icon?: LucideIcon;
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
  icon,
  renderCell,
  rowActions,
}: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectOptions, setSelectOptions] = useState<Record<string, any[]>>({});
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
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
    const nextSearch = searchParams.get("q") || "";
    setSearch(nextSearch);
  }, [searchParams]);

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

  const confirmRemove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.remove(deleteTarget._id);
      setRows((current) =>
        current.filter((row) => row._id !== deleteTarget._id),
      );
      setDeleteTarget(null);
    } catch (exception: any) {
      setError(exception.message);
    } finally {
      setDeleting(false);
    }
  };

  const tableFields = fields.filter((field) => !field.hiddenInTable);
  const formFields = fields.filter(
    (field) => !field.hiddenInForm && field.key !== "code",
  );

  // The field already driving auto-badges (status/severity/level/...) also
  // decides the tone of the identity-column icon chip and the summary tiles.
  const toneFieldKey = fields.find((field) =>
    BADGE_FIELD_KEYS.includes(field.key),
  )?.key;

  const summaryTiles = filters.length
    ? [
        { label: `Total ${title}`, value: rows.length, tone: "blue" as const },
        ...filters[0].values.map((value) => ({
          label: value,
          value: rows.filter(
            (row) => String(display(row[filters[0].key])) === value,
          ).length,
          tone: toTileTone(value),
        })),
      ]
    : [];

  const columns: DataTableColumn<any>[] = tableFields.map((field, index) => ({
    key: field.key,
    label: field.label,
    render: (row) => {
      const content = renderCell ? (
        renderCell(row, field)
      ) : BADGE_FIELD_KEYS.includes(field.key) ? (
        <Badge label={display(row[field.key])} />
      ) : (
        display(row[field.key])
      );

      if (index !== 0 || !icon) return content;

      const tone = toneFieldKey
        ? toTileTone(display(row[toneFieldKey]))
        : "neutral";
      return (
        <div className="flex items-center gap-3">
          <IconChip icon={icon} tone={tone as any} />
          <div className="min-w-0 truncate">{content}</div>
        </div>
      );
    },
  }));

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
        <div className="mb-4">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {summaryTiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-5">
          {summaryTiles.map((tile) => (
            <StatTile
              key={tile.label}
              variant="card"
              icon={icon}
              label={tile.label}
              value={tile.value}
              tone={tile.tone as any}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex-1 max-w-sm">
          <Input
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
              const nextParams = new URLSearchParams(searchParams);
              if (value.trim()) {
                nextParams.set("q", value.trim());
              } else {
                nextParams.delete("q");
              }
              setSearchParams(nextParams, { replace: true });
            }}
            placeholder={`Search ${title.toLowerCase()}…`}
          />
        </div>

        {filters.map((currentFilter) => (
          <Select
            key={currentFilter.key}
            value={filter[currentFilter.key] || "All"}
            onChange={(event) =>
              setFilter({ ...filter, [currentFilter.key]: event.target.value })
            }
            className="md:w-48"
          >
            <option>All</option>
            {currentFilter.values.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row._id}
        loading={loading}
        emptyTitle="No records found"
        renderActions={(row) => (
          <>
            {rowActions?.(row)}
            <button
              onClick={() => setEditing({ ...row, mode: "edit" })}
              className="p-2 text-slate-400 hover:text-ink-700 rounded"
              aria-label={`Edit ${display(row[tableFields[0]?.key])}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            {canDelete && (
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-2 text-slate-400 hover:text-red-600 rounded"
                aria-label={`Delete ${display(row[tableFields[0]?.key])}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      />

      <Modal
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        title={`${editing?.mode === "edit" ? "Edit" : "Create"} ${title.replace(/s$/, "")}`}
        description="Changes are saved directly to MongoDB."
        footer={
          editing ? (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit" form="resource-page-form" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </>
          ) : null
        }
      >
        {editing && (
          <form id="resource-page-form" onSubmit={submit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map((field) => (
                <FormField
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  className={field.multiline ? "md:col-span-2" : ""}
                >
                  {field.type === "file" ? (
                    <input
                      name={field.key}
                      type="file"
                      accept={field.accept}
                      required={field.required && editing.mode === "create"}
                      className="w-full text-sm text-slate-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-ink-800 file:text-white hover:file:bg-ink-900"
                    />
                  ) : field.options || field.selectResource ? (
                    <Select
                      name={field.key}
                      defaultValue={
                        editing.mode === "edit"
                          ? editing[field.key]?._id || editing[field.key] || ""
                          : ""
                      }
                      required={field.required}
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
                    </Select>
                  ) : field.multiline ? (
                    <Textarea
                      name={field.key}
                      defaultValue={
                        editing.mode === "edit"
                          ? display(editing[field.key])
                          : ""
                      }
                      required={field.required}
                    />
                  ) : (
                    <Input
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
                    />
                  )}
                </FormField>
              ))}
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete record"
        description="Delete this record? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        busy={deleting}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
