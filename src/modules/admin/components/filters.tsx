"use client";

import { SearchIcon } from "lucide-react";
import { debounce } from "nuqs";
import { useTransition } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useFilters } from "../search-params";

export function Filters() {
  const [isPending, startTransition] = useTransition();
  const [{ query }, setSearchParams] = useFilters();

  return (
    <div className="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            startTransition(async () => {
              await setSearchParams(
                { query: e.target.value },
                {
                  limitUrlUpdates: e.target.value ? debounce(250) : undefined,
                },
              );
            });
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {isPending ? <Spinner /> : ""}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
