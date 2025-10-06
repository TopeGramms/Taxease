import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  mode: "2025" | "legacy";
  onModeChange: (mode: "2025" | "legacy") => void;
}

export default function AppSidebar({ mode, onModeChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary" data-testid="text-sidebar-title">
            TaxEase
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nigeria Tax Calculator<br />2025 Reform Ready
          </p>
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
              data-testid="button-sidebar-mode-2025"
              onClick={() => onModeChange("2025")}
              className={`w-full px-4 py-3 rounded-lg text-sm font-semibold text-left transition-all ${
                mode === "2025"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-foreground hover-elevate active-elevate-2 border border-border"
              }`}
            >
              2025 Reform
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
