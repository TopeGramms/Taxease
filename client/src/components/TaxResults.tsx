import { Button } from "@/components/ui/button";
import { Download, Info, RotateCcw, MessageCircle } from "lucide-react";
import { jsPDF } from "jspdf";

interface TaxResultsProps {
  totalTax: number;
  afterTaxIncome: number;
  mode: "2026" | "legacy";
  onDownloadPDF?: () => void;
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
  taxableIncome,
  effectiveRate,
  breakdown,
  income,
  totalDeductions,
}: TaxResultsProps) {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const whatsappNumber = "2348073562745";
  const whatsappMessage = encodeURIComponent(
    `Hi! I just calculated my tax on TaxEase.\n\nMy total tax is ${formatCurrency(Math.round(totalTax))} on income of ${formatCurrency(income || 0)}.\n\nI'd like help with tax filing or have some questions.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // --- Header Branding ---
    // Load Logo
    const logoImg = new Image();
    logoImg.src = "/Minimalist_Taxease_Logo_with_Growth_Symbols-removebg-preview.png";

    // Add Logo (top left)
    doc.addImage(logoImg, "PNG", margin, yPos - 5, 25, 25);

    // Right side Header Info
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55); // #1f2937 - Dark Charcoal
    doc.text("Personal Income Tax Assessment", pageWidth - margin, yPos + 5, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("times", "normal");
    const date = new Date().toLocaleDateString("en-NG", {
      year: "numeric", month: "long", day: "numeric"
    });
    doc.text(`Computation Date: ${date}`, pageWidth - margin, yPos + 12, { align: "right" });
    const refId = `TXE-${Math.random().toString(36).substring(7).toUpperCase()}`;
    doc.text(`Report Reference: ${refId}`, pageWidth - margin, yPos + 17, { align: "right" });

    yPos += 30;

    // --- Divider ---
    doc.setDrawColor(31, 41, 55);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 15;

    // --- Executive Summary ---
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("1. TAXPAYER INCOME SUMMARY", margin, yPos);
    yPos += 10;

    doc.setFont("times", "normal");
    doc.setFontSize(11);

    const summaryData = [
      { label: "Gross Annual Income", value: formatCurrency(income || 0) },
      { label: "Allowable Deductions & Reliefs", value: formatCurrency(totalDeductions || 0) },
      { label: "Net Chargeable Income", value: formatCurrency(taxableIncome || 0) },
    ];

    summaryData.forEach((item, idx) => {
      doc.text(item.label, margin + 5, yPos + (idx * 8));
      doc.text(item.value, pageWidth - margin - 5, yPos + (idx * 8), { align: "right" });
    });

    yPos += 30;

    // --- Final Calculation Box ---
    doc.setFillColor(249, 250, 251);
    doc.setDrawColor(31, 41, 55);
    doc.rect(margin, yPos, contentWidth, 25, "FD");

    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("TOTAL ESTIMATED TAX PAYABLE:", margin + 5, yPos + 16);
    doc.text(formatCurrency(Math.round(totalTax)), pageWidth - margin - 5, yPos + 16, { align: "right" });

    yPos += 40;

    // --- Detailed Bracket Breakdown ---
    if (breakdown && breakdown.length > 0) {
      doc.setFontSize(12);
      doc.setFont("times", "bold");
      doc.text("2. COMPUTATION BREAKDOWN (BRACKETED)", margin, yPos);
      yPos += 10;

      // Header Row
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, yPos, contentWidth, 10, "F");
      doc.setFontSize(10);
      doc.text("Taxable Income Bracket", margin + 5, yPos + 7);
      doc.text("Amount in Bracket", margin + 70, yPos + 7);
      doc.text("Rate (%)", margin + 115, yPos + 7);
      doc.text("Tax Owed", pageWidth - margin - 5, yPos + 7, { align: "right" });

      yPos += 10;
      doc.setFont("times", "normal");

      breakdown.forEach((bracket, idx) => {
        if (yPos > pageHeight - 40) { doc.addPage(); yPos = 20; }

        doc.text(bracket.range, margin + 5, yPos + 7);
        doc.text(formatCurrency(Math.round(bracket.amount)), margin + 70, yPos + 7);
        doc.text(`${(bracket.rate * 100).toFixed(0)}%`, margin + 115, yPos + 7);
        doc.text(formatCurrency(Math.round(bracket.tax)), pageWidth - margin - 5, yPos + 7, { align: "right" });

        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.1);
        doc.line(margin, yPos + 10, pageWidth - margin, yPos + 10);
        yPos += 10;
      });
    }

    // --- Footer & Advisory ---
    yPos = pageHeight - 55;

    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("3. ADVISORY NOTES", margin, yPos);
    yPos += 6;
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("• This estimate is generated based on current 2026 Nigerian Tax Laws.", margin + 5, yPos);
    doc.text("• For official filing, ensure all non-taxable allowances are documented.", margin + 5, yPos + 5);

    yPos += 15;
    doc.setDrawColor(31, 41, 55);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    doc.setFontSize(8);
    doc.setFont("times", "italic");
    doc.setTextColor(107, 114, 128);
    const disclaimer = "This report is an automated estimate for tax planning and assessment. While every effort is made to ensure accuracy, this is NOT a legal tax document. Please consult the FIRS or your State IRS for final assessment.";

    const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
    doc.text(splitDisclaimer, margin, yPos + 7);

    doc.setFont("times", "bold");
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.text("taxease.com.ng — Nigeria's Digital Tax Companion", pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`TaxEase_Report_${refId}.pdf`);
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
            Your tax breakdown is ready. Download the PDF to keep a copy.
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

      {/* Premium Service CTA */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 px-2 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded tracking-wider">
            Premium Support
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2">Need Expert Help with Your Taxes?</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Avoid errors and maximize your returns. Connect with a professional to help you file correctly with the FIRS or your State IRS.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-all hover:shadow-lg active:scale-95"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          Chat with a Tax Consultant
        </a>
      </div>
    </div>
  );
}
