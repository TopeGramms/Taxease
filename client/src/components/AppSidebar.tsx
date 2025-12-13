import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

interface AppSidebarProps {
  mode: "2026" | "legacy";
  onModeChange: (mode: "2026" | "legacy") => void;
}

export default function AppSidebar({ mode, onModeChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6 space-y-6">
        <div className="flex items-center justify-center">
          <Logo className="w-24 h-24 flex-shrink-0" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-6 pt-0">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Tax Mode
          </p>
          <div className="space-y-2">
            <button
              type="button"
              data-testid="button-sidebar-mode-2026"
              onClick={() => onModeChange("2026")}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${
                mode === "2026"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-foreground hover-elevate active-elevate-2 border border-border"
              }`}
            >
              2026 Tax reform
            </button>
            <button
              type="button"
              data-testid="button-sidebar-mode-legacy"
              onClick={() => onModeChange("legacy")}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${
                mode === "legacy"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-foreground hover-elevate active-elevate-2 border border-border"
              }`}
            >
              Legacy (Pre-2025)
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
