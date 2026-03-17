"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Toggle
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className="group size-8 min-w-8 rounded-full border-none text-muted-foreground shadow-none transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none dark:bg-transparent dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
        onPressedChange={() =>
          setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }
        pressed={theme === "dark"}
        variant="outline"
      >
        {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
        <MoonIcon
          aria-hidden="true"
          className="shrink-0 -rotate-6 scale-95 opacity-0 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none dark:rotate-0 dark:scale-100 dark:opacity-100"
          size={16}
        />
        <SunIcon
          aria-hidden="true"
          className="absolute shrink-0 rotate-0 scale-100 opacity-100 transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none dark:rotate-6 dark:scale-95 dark:opacity-0"
          size={16}
        />
      </Toggle>
    </div>
  );
}
