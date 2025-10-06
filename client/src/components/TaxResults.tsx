import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";

interface TaxResultsProps {
  totalTax: number;
  afterTaxIncome: number;
  mode: "2025" | "legacy";
  onDownloadPDF: () => void;
}

export default function TaxResults({
  totalTax,
  afterTaxIncome,
  mode,
  onDownloadPDF,
}: TaxResultsProps) {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border-l-4 border-l-primary rounded-lg p-8 shadow-md">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Total Tax Owed</p>
            <p className="text-4xl font-bold text-primary" data-testid="text-total-tax">
              {formatCurrency(totalTax)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">After-Tax Income</p>
            <p className="text-3xl font-semibold text-foreground" data-testid="text-after-tax">
              {formatCurrency(afterTaxIncome)}
            </p>
          </div>
          <p className="text-sm italic text-muted-foreground pt-4 border-t border-border">
            Congrats! FG just took {formatCurrency(totalTax)} from your hustle 💸
          </p>
        </div>
      </div>

      <div className="bg-accent/20 border border-accent-border rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          Based on Nigeria's 2025 Tax Reform Act (effective Jan 2026). For estimates only.
        </p>
      </div>

      <Button
        onClick={onDownloadPDF}
        variant="outline"
        className="w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        data-testid="button-download-pdf"
      >
        <Download className="w-5 h-5 mr-2" />
        Download as PDF
      </Button>
    </div>
  );
}
