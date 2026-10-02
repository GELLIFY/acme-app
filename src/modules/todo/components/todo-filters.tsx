"use client";

import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useScopedI18n } from "@/shared/locales/client";
import { useTodoFilters } from "../search-params";

export function TodoFilters() {
  const t = useScopedI18n("todo");
  const id = useId();

  const [filter, setFilter] = useTodoFilters();

  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={filter.completed ?? false}
          onCheckedChange={(value) => {
            const newValue = value.valueOf();
            void setFilter({
              completed: typeof newValue === "boolean" ? newValue : false,
            });
          }}
          id={id}
        />
        <Label htmlFor={id}>{t("filter")}</Label>
      </div>
    </div>
  );
}
