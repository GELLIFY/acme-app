"use client";

import { useTodoFilterParams } from "@/hooks/use-todo-filter-params";
import { useScopedI18n } from "@/shared/locales/client";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function TodoFilters() {
  const t = useScopedI18n("todo");

  const { filter, setFilter } = useTodoFilterParams();

  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={filter.deleted}
          onCheckedChange={(value) => {
            const newValue = value.valueOf();
            void setFilter({
              deleted: typeof newValue === "boolean" ? newValue : false,
            });
          }}
          id="todo-state"
        />
        <Label htmlFor="todo-state">{t("filter")}</Label>
      </div>
    </div>
  );
}
