import TaxCalculatorForm from "@/components/TaxCalculatorForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-[500px] mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary" data-testid="text-app-title">
            TaxEase
          </h1>
          <p className="text-base text-muted-foreground">
            Nigeria Tax Calculator (2025 Reform Ready)
          </p>
        </header>

        <TaxCalculatorForm />

        <footer className="text-center space-y-2 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Last checked: October 6, 2025
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            TaxEase uses 2025 Nigeria Tax Reform Act logic (effective Jan 2026).
            Consult a tax professional for specific cases.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ by <span className="font-semibold text-foreground">Topegramms</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
