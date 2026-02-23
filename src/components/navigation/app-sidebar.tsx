import { HomeIcon, ListTodoIcon } from "lucide-react";
import type * as React from "react";
import { OrganizationSwitcher } from "@/components/auth/organization/organization-switcher";
import { NavMain } from "@/components/navigation/nav-main";
import { NavUser } from "@/components/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getCachedSession } from "@/libs/better-auth/get-cached-session";
import { NavSecondary } from "./nav-secondary";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HomeIcon />,
      isActive: true,
    },
    {
      title: "Todo",
      url: "/todo",
      icon: <ListTodoIcon />,
    },
  ],
  navSecondary: [
    // {
    //   title: "Settings",
    //   url: "/organization",
    //   icon: CogIcon,
    // },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await getCachedSession();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session!.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
