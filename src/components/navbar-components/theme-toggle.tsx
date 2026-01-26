"use client";

import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      className="border rounded-full h-8 [&>button]:rounded-full! [&>button]:size-8 [&>button]:p-0 [&>button]:text-muted-foreground [&>button]:hover:bg-transparent [&>button]:hover:text-primary [&>button]:data-[state=on]:bg-transparent"
      value={[theme]}
      onValueChange={(value) => setTheme(value[0])}
    >
      <ToggleGroupItem
        value="system"
        aria-label="Switch to system mode"
        className={cn("-ml-px", {
          border: theme === "system",
        })}
      >
        <LaptopIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="light"
        aria-label="Switch to light mode"
        className={cn({ border: theme === "light" })}
      >
        <SunIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Switch to dark mode"
        className={cn("-mr-px", {
          border: theme === "dark",
        })}
      >
        <MoonIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
