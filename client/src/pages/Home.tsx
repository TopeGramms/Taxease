import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TaxCalculatorForm from "@/components/TaxCalculatorForm";
import { Menu } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"2025" | "legacy">("2025");

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar mode={mode} onModeChange={setMode} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="lg:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
            <h1 className="text-xl font-bold text-primary">TaxEase</h1>
            <SidebarTrigger data-testid="button-sidebar-toggle">
              <Menu className="w-6 h-6" />
            </SidebarTrigger>
          </header>
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
              <div className="hidden lg:block mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Tax Calculator
                </h2>
                <p className="text-sm text-muted-foreground">
                  Calculate your tax obligations based on the selected reform
                </p>
              </div>

              <TaxCalculatorForm mode={mode} />

              <footer className="text-center mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  💼 Built by <span className="font-semibold">Topegramms</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last checked: October 6, 2025
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xl mx-auto">
                  TaxEase uses 2025 Nigeria Tax Reform Act logic (effective Jan 2026).
                  Consult a tax professional for specific cases.
                </p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
