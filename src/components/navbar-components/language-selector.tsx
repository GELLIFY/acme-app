"use client";

import { useId } from "react";
import { GlobeIcon } from "lucide-react";

import { useChangeLocale, useCurrentLocale } from "@/shared/locales/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Language options
const languages = [
  { value: "en", label: "En" },
  { value: "it", label: "It" },
];

export default function LanguageSelector() {
  const id = useId();
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  return (
    <Select
      defaultValue={locale}
      onValueChange={(value) => {
        changeLocale(value as "it" | "en");
      }}
    >
      <SelectTrigger
        id={`language-${id}`}
        className="h-8 border-none px-2 shadow-none hover:bg-accent hover:text-accent-foreground [&>svg]:shrink-0 [&>svg]:text-muted-foreground/80"
        aria-label="Select language"
      >
        <GlobeIcon size={16} aria-hidden="true" />
        <SelectValue className="hidden sm:inline-flex" />
      </SelectTrigger>
      <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <span className="flex items-center gap-2">
              <span className="truncate">{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
