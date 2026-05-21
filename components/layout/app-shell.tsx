"use client";

import { PanelLeftOpen } from "lucide-react";

interface AppShellProps {
  sidebar: React.ReactNode;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  children: React.ReactNode;
}

export function AppShell({
  sidebar,
  sidebarOpen,
  onOpenSidebar,
  children,
}: AppShellProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {sidebarOpen && sidebar}

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="absolute left-3 top-3 z-10 text-muted-foreground hover:text-foreground"
            aria-label="Abrir barra lateral"
          >
            <PanelLeftOpen className="size-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
