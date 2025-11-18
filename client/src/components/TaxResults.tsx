import { Button } from "@/components/ui/button";
import { Download, Info, RotateCcw, UserPlus, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";

interface TaxResultsProps {
  totalTax: number;
  afterTaxIncome: number;
  mode: "2026" | "legacy";
  onDownloadPDF?: () => void; // Optional, PDF generation handled internally
  onRecalculate?: () => void;
  onSave?: () => Promise<void>;
  taxableIncome?: number;
  effectiveRate?: number;
  breakdown?: Array<{ range: string; amount: number; rate: number; tax: number }>;
  income?: number;
  totalDeductions?: number;
}

export default function TaxResults({
  totalTax,
  afterTaxIncome,
  mode,
  onRecalculate,
  onSave,
  taxableIncome,
  effectiveRate,
  breakdown,
  income,
  totalDeductions,
}: TaxResultsProps) {
  const { user, subscription, startCheckout } = useAuth();
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = margin;

    // App name
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Taxease – Personal income tax calculator", pageWidth / 2, yPos, { align: "center" });
    yPos += 15;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Tax Calculation Summary", pageWidth / 2, yPos, { align: "center" });
    yPos += 20;

    // Data rows
    doc.setFontSize(12);
    const lineHeight = 8;
    const labelWidth = 80;

    if (income !== undefined) {
      doc.text("Income:", margin, yPos);
      doc.text(formatCurrency(income), margin + labelWidth, yPos);
      yPos += lineHeight;
    }

    if (totalDeductions !== undefined) {
      doc.text("Total Deductions:", margin, yPos);
      doc.text(formatCurrency(totalDeductions), margin + labelWidth, yPos);
      yPos += lineHeight;
    }

    if (taxableIncome !== undefined) {
      doc.text("Taxable Income:", margin, yPos);
      doc.text(formatCurrency(taxableIncome), margin + labelWidth, yPos);
      yPos += lineHeight;
    }

    yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Total Tax:", margin, yPos);
    doc.text(formatCurrency(Math.round(totalTax)), margin + labelWidth, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text("After-Tax Income:", margin, yPos);
    doc.text(formatCurrency(afterTaxIncome), margin + labelWidth, yPos);
    yPos += lineHeight;

    if (effectiveRate !== undefined) {
      doc.text("Effective Tax Rate:", margin, yPos);
      doc.text(`${effectiveRate.toFixed(2)}%`, margin + labelWidth, yPos);
      yPos += lineHeight;
    }

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Calculated under 2026 Tax reform (effective Jan 1, 2026)", pageWidth / 2, yPos, { align: "center" });

    // Save PDF
    doc.save("taxease-calculation.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border-l-4 border-l-primary rounded-lg p-8 shadow-md">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Total Tax Owed</p>
            <p className="text-4xl font-bold text-primary" data-testid="text-total-tax">
              {formatCurrency(Math.round(totalTax))}
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

      {mode === "2026" && taxableIncome !== undefined && effectiveRate !== undefined && (
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Taxable Income</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(taxableIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Effective Tax Rate</p>
              <p className="text-xl font-semibold text-foreground">
                {effectiveRate.toFixed(2)}%
              </p>
            </div>
          </div>
          {breakdown && breakdown.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-3">Tax Breakdown by Bracket</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold text-foreground">Bracket</th>
                      <th className="text-right py-2 px-2 font-semibold text-foreground">Taxable in Bracket</th>
                      <th className="text-right py-2 px-2 font-semibold text-foreground">Rate</th>
                      <th className="text-right py-2 px-2 font-semibold text-foreground">Tax in Bracket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((bracket, idx) => (
                      <tr key={idx} className="border-b border-border">
                        <td className="py-2 px-2 text-foreground">{bracket.range}</td>
                        <td className="py-2 px-2 text-right text-foreground">
                          {formatCurrency(Math.round(bracket.amount))}
                        </td>
                        <td className="py-2 px-2 text-right text-foreground">
                          {(bracket.rate * 100).toFixed(0)}%
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-foreground">
                          {formatCurrency(Math.round(bracket.tax))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-accent/20 border border-accent-border rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          Based on Nigeria's 2026 Tax reform (effective Jan 1, 2026). For estimates only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          data-testid="button-download-pdf"
        >
          <Download className="w-5 h-5 mr-2" />
          Download as PDF
        </Button>

        {onRecalculate && (
          <Button
            onClick={onRecalculate}
            className="w-full h-12 text-base font-semibold"
            data-testid="button-recalculate"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Recalculate
          </Button>
        )}
      </div>

      {!user && (
        <Button
          onClick={() => (window.location.href = "/account")}
          variant="secondary"
          className="w-full h-12 text-base font-semibold"
          data-testid="button-create-account"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Create Account to Save Results
        </Button>
      )}

      {user && subscription?.status !== "active" && (
        <Button
          onClick={() => startCheckout()}
          className="w-full h-12 text-base font-semibold"
          data-testid="button-upgrade"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Upgrade to Save Results
        </Button>
      )}

      {user && subscription?.status === "active" && onSave && (
        <Button
          onClick={() => onSave()}
          className="w-full h-12 text-base font-semibold"
          data-testid="button-save-results"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Results
        </Button>
      )}
    </div>
  );
}
