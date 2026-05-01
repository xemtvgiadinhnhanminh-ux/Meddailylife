import { deleteCollectionItemAction, saveCollectionItemAction } from "@/app/admin/actions";

function stringifyJson(value) {
  return JSON.stringify(value ?? [], null, 2);
}

function normalizeFieldValue(item, collection, field) {
  const sourceValue = item?.[field.name];
  if (sourceValue === undefined || sourceValue === null) {
    if (field.type === "json") {
      return stringifyJson(collection.emptyValue[field.name]);
    }
    return collection.emptyValue[field.name];
  }

  if (field.type === "json") {
    return stringifyJson(sourceValue);
  }

  return sourceValue;
}

function renderInput(field, value, readOnly) {
  const commonProps = {
    id: field.name,
    name: field.name,
    disabled: readOnly,
    className:
      "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100",
  };

  if (field.type === "textarea" || field.type === "json") {
    return (
      <textarea
        {...commonProps}
        defaultValue={String(value ?? "")}
        rows={field.type === "json" ? 10 : 5}
        className={`${commonProps.className} font-mono`}
      />
    );
  }

  if (field.type === "number") {
    return <input {...commonProps} type="number" defaultValue={Number(value || 0)} />;
  }

  if (field.type === "boolean") {
    return (
      <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input
          id={field.name}
          name={field.name}
          type="checkbox"
          defaultChecked={Boolean(value)}
          disabled={readOnly}
          className="h-4 w-4 rounded border-slate-300 text-emerald-600"
        />
        Kich hoat
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select {...commonProps} defaultValue={String(value ?? "")}>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return <input {...commonProps} type="text" defaultValue={String(value ?? "")} />;
}

export function ContentForm({
  collection,
  item,
  routeId,
  readOnly = false,
  error = "",
  message = "",
}) {
  const saveAction = saveCollectionItemAction.bind(null, collection.key, routeId);
  const deleteAction = deleteCollectionItemAction.bind(null, collection.key, routeId);

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {message}
        </div>
      ) : null}

      {readOnly ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Dang o che do xem truoc. Ket noi Supabase de bat tinh nang luu va xoa.
        </div>
      ) : null}

      <form action={readOnly ? undefined : saveAction} className="space-y-6">
        {collection.fields.map((field) => {
          const value = normalizeFieldValue(item, collection, field);

          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm font-semibold text-slate-800"
              >
                {field.label}
              </label>
              {renderInput(field, value, readOnly)}
              {field.helper ? (
                <p className="text-xs leading-5 text-slate-500">{field.helper}</p>
              ) : null}
            </div>
          );
        })}

        <div className="flex flex-wrap gap-3 pt-2">
          {!readOnly ? (
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Luu noi dung
            </button>
          ) : null}

          {!readOnly && routeId !== "new" ? (
            <button
              formAction={deleteAction}
              type="submit"
              className="rounded-full border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Xoa ban ghi
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

