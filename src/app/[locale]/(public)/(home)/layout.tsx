import LanguageSelector from "@/components/navbar-components/language-selector";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <LanguageSelector />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
