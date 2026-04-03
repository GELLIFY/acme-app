import { FileTextIcon, ListTodoIcon } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/navbar-components/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { authClient } from "@/libs/better-auth/auth-client";
import { UserMenu } from "../auth/user-menu";
import LanguageSelector from "./language-selector";
import ThemeToggle from "./theme-toggle";

// Navigation links with icons for desktop icon-only navigation
const navigationLinks = [
  { href: "/todo", icon: ListTodoIcon, label: "Todos" },
  { href: "#", icon: FileTextIcon, label: "Documentation" },
];

type User = typeof authClient.$Infer.Session.user;

export default function Navbar({ user }: { user?: User }) {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  className="group size-8 md:hidden"
                  size="icon"
                  variant="ghost"
                />
              }
            >
              <svg
                className="pointer-events-none"
                fill="none"
                height={16}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width={16}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="-translate-y-[7px] origin-center transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                  d="M4 12L20 12"
                />
                <path
                  className="origin-center transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none group-aria-expanded:rotate-45"
                  d="M4 12H20"
                />
                <path
                  className="origin-center translate-y-[7px] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                  d="M4 12H20"
                />
              </svg>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, _index) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem className="w-full" key={link.label}>
                        <NavigationMenuLink
                          className="flex-row items-center gap-2 py-1.5"
                          href={link.href}
                        >
                          <Icon
                            aria-hidden="true"
                            className="text-muted-foreground"
                            size={16}
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link className="text-primary hover:text-primary/90" href="/">
              <Logo />
            </Link>
            {/* Desktop navigation - icon only */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2">
                <TooltipProvider>
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.label}>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <NavigationMenuLink
                              className="flex size-8 items-center justify-center p-1.5"
                              href={link.href}
                            />
                          }
                        >
                          <link.icon aria-hidden="true" size={20} />
                          <span className="sr-only">{link.label}</span>
                        </TooltipTrigger>
                        <TooltipContent
                          className="px-2 py-1 text-xs"
                          side="bottom"
                        >
                          <p>{link.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </NavigationMenuItem>
                  ))}
                </TooltipProvider>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle />
          {/* Language selector */}
          <LanguageSelector />
          {/* User menu */}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button
              className="text-sm"
              size="sm"
              variant="ghost"
              render={<Link href="/sign-in" />}
              nativeButton={false}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
