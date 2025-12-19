import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TaxCalculatorForm from "@/components/TaxCalculatorForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Menu, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [mode, setMode] = useState<"2026" | "legacy">("2026");
  const [, navigate] = useLocation();

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar mode={mode} onModeChange={setMode} />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile Header with back link and mode badge */}
          <header className="lg:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Home</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Mode Badge */}
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                {mode === "2026" ? "2026 Reform" : "Legacy"}
              </span>
              <SidebarTrigger data-testid="button-sidebar-toggle">
                <Menu className="w-6 h-6" />
              </SidebarTrigger>
            </div>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:flex items-center justify-between p-6 border-b bg-background">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6 lg:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  Tax Calculator
                </h2>
              </div>

              <TaxCalculatorForm mode={mode} />

              <footer className="text-center mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  💼 Built by <span className="font-semibold">Topegramms</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-xl mx-auto">
                  Uses {mode === "2026" ? "2026 Tax Reform" : "Legacy (Pre-2025)"} calculations. Consult a tax professional for specific cases.
                </p>
              </footer>
            </div>
          </main>
        </div>
      </div>
      <WhatsAppButton />
    </SidebarProvider>
  );
}
