import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CurrencyInput from "./CurrencyInput";
import TaxResults from "./TaxResults";
import FormSection from "./FormSection";
import { Calculator, X, ChevronDown, ChevronUp } from "lucide-react";
import { calculate2026Tax, calculateLegacyTax, type TaxFormData, type TaxResult } from "@/utils/calculator";

interface TaxCalculatorFormProps {
  mode: "2026" | "legacy";
}

export default function TaxCalculatorForm({ mode }: TaxCalculatorFormProps) {
  const [formData, setFormData] = useState<TaxFormData>({
    employmentIncome: "",
    businessIncome: "",
    cryptoBuyPrice: "",
    cryptoSellPrice: "",
    cryptoQuantity: "",
    rentPaid: "",
    pensionContribution: "",
    nhfContribution: "",
    lifeInsurance: "",
    otherDeductions: "",
    isSmallCompany: false,
  });
  const [results, setResults] = useState<TaxResult | null>(null);

  // Collapsible section states
  const [showCrypto, setShowCrypto] = useState(false);
  const [showDeductions, setShowDeductions] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("taxease-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const numericFields: Array<keyof typeof parsed> = [
          "employmentIncome",
          "businessIncome",
          "cryptoBuyPrice",
          "cryptoSellPrice",
          "cryptoQuantity",
          "rentPaid",
          "pensionContribution",
          "nhfContribution",
          "lifeInsurance",
          "otherDeductions",
        ];

        const sanitized: any = {};
        for (const f of numericFields) {
          const v = parsed[f];
          if (v === undefined || v === null || v === "") {
            sanitized[f] = "";
          } else if (typeof v === "number") {
            sanitized[f] = String(v);
          } else if (typeof v === "string") {
            sanitized[f] = v;
          } else {
            sanitized[f] = "";
          }
        }

        sanitized.isSmallCompany = parsed.isSmallCompany === true;

        setFormData((prev) => ({ ...prev, ...sanitized }));

        // Auto-expand sections if they have saved data
        if (sanitized.cryptoBuyPrice || sanitized.cryptoSellPrice) setShowCrypto(true);
        if (sanitized.rentPaid || sanitized.pensionContribution || sanitized.nhfContribution ||
          sanitized.lifeInsurance || sanitized.otherDeductions) setShowDeductions(true);
      } catch (e) {
        console.error("Failed to load saved data, clearing corrupt storage key", e);
        try {
          localStorage.removeItem("taxease-data");
        } catch (_) {
          // ignore
        }
      }
    }
  }, []);

  const saveToLocalStorage = (data: TaxFormData) => {
    try {
      localStorage.setItem("taxease-data", JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save taxease-data to localStorage", e);
    }
  };

  const updateField = (field: keyof TaxFormData, value: string | boolean) => {
    let normalizedValue: string | boolean = value as string | boolean;

    if (field === "isSmallCompany") {
      normalizedValue = Boolean(value) as boolean;
    } else if (typeof value === "string") {
      if (value === "") {
        normalizedValue = "";
      } else {
        const coerced = Number(value);
        normalizedValue = Number.isFinite(coerced) ? String(coerced) : value;
      }
    }

    const newData = { ...formData, [field]: normalizedValue } as TaxFormData;
    setFormData(newData);
    saveToLocalStorage(newData);
  };

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleCalculate = () => {
    const result = mode === "2026" ? calculate2026Tax(formData) : calculateLegacyTax(formData);
    setResults(result);

    try {
      localStorage.setItem("taxease-last-result", JSON.stringify(result));
    } catch (e) {
      console.error("Failed to save result to localStorage", e);
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleRecalculate = () => {
    setResults(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    const defaultFormData: TaxFormData = {
      employmentIncome: "",
      businessIncome: "",
      cryptoBuyPrice: "",
      cryptoSellPrice: "",
      cryptoQuantity: "",
      rentPaid: "",
      pensionContribution: "",
      nhfContribution: "",
      lifeInsurance: "",
      otherDeductions: "",
      isSmallCompany: false,
    };
    setFormData(defaultFormData);
    setResults(null);
    setShowCrypto(false);
    setShowDeductions(false);

    try {
      localStorage.removeItem("taxease-data");
      localStorage.removeItem("taxease-last-result");
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Collapsible section component
  const CollapsibleSection = ({
    title,
    subtitle,
    isOpen,
    onToggle,
    children
  }: {
    title: string;
    subtitle: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="text-left">
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-sm text-muted-foreground ml-2">{subtitle}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );

  // Check if form is empty
  const isFormEmpty = !formData.employmentIncome && !formData.businessIncome;

  return (
    <div className="space-y-6">
      {/* Empty state hint */}
      {isFormEmpty && (
        <div className="text-center py-4 px-6 bg-muted/30 rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">
            Start by entering your annual income below to calculate your tax
          </p>
        </div>
      )}

      {/* Income Section - Always visible, highlighted */}
      <FormSection
        title="Income"
        description="Enter your annual earnings"
        highlight={true}
      >
        <div className="space-y-4">
          <CurrencyInput
            id="employment-income"
            label="Employment/Salary Income (₦)"
            value={formData.employmentIncome}
            onChange={(val) => updateField("employmentIncome", val)}
            helperText="Your total annual salary before deductions. Multiply monthly by 12."
          />
          <CurrencyInput
            id="business-income"
            label="Business/Freelance Income (₦)"
            value={formData.businessIncome}
            onChange={(val) => updateField("businessIncome", val)}
            helperText="Income from side business, consulting, or freelance work (optional)"
          />
        </div>
      </FormSection>

      {/* Collapsible: Crypto */}
      <CollapsibleSection
        title="Crypto Gains"
        subtitle="(If you sold crypto this year)"
        isOpen={showCrypto}
        onToggle={() => setShowCrypto(!showCrypto)}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Enter details if you sold cryptocurrency at a profit. Capital gains are taxed at 10%.
          </p>
          <CurrencyInput
            id="crypto-buy-price"
            label="Buy Price (₦)"
            value={formData.cryptoBuyPrice}
            onChange={(val) => updateField("cryptoBuyPrice", val)}
            placeholder="0"
          />
          <CurrencyInput
            id="crypto-sell-price"
            label="Sell Price (₦)"
            value={formData.cryptoSellPrice}
            onChange={(val) => updateField("cryptoSellPrice", val)}
            placeholder="0"
          />
          <CurrencyInput
            id="crypto-quantity"
            label="Quantity"
            value={formData.cryptoQuantity}
            onChange={(val) => updateField("cryptoQuantity", val)}
            placeholder="1"
            helperText="Number of units sold (default: 1)"
          />
        </div>
      </CollapsibleSection>

      {/* Collapsible: Deductions (only for 2026 mode) */}
      {mode === "2026" && (
        <CollapsibleSection
          title="Deductions & Reliefs"
          subtitle="(Reduce your taxable income)"
          isOpen={showDeductions}
          onToggle={() => setShowDeductions(!showDeductions)}
        >
          <div className="space-y-4">
            <CurrencyInput
              id="rent-paid"
              label="Rent Paid (₦)"
              value={formData.rentPaid}
              onChange={(val) => updateField("rentPaid", val)}
              helperText="Annual rent paid (note: rent relief may not apply in 2026 reform)"
            />

            <CurrencyInput
              id="pension-contribution"
              label="Pension Contribution (₦)"
              value={formData.pensionContribution}
              onChange={(val) => updateField("pensionContribution", val)}
              helperText="Your voluntary pension contributions"
            />

            <CurrencyInput
              id="nhf-contribution"
              label="NHF Contribution (₦)"
              value={formData.nhfContribution}
              onChange={(val) => updateField("nhfContribution", val)}
              helperText="National Housing Fund contributions"
            />

            <CurrencyInput
              id="life-insurance"
              label="Life Insurance Premium (₦)"
              value={formData.lifeInsurance}
              onChange={(val) => updateField("lifeInsurance", val)}
            />

            <CurrencyInput
              id="other-deductions"
              label="Other Deductions (₦)"
              value={formData.otherDeductions}
              onChange={(val) => updateField("otherDeductions", val)}
              helperText="Any other tax-deductible expenses"
            />

            <div className="flex items-center space-x-3 pt-2">
              <Checkbox
                id="small-company"
                checked={formData.isSmallCompany}
                onCheckedChange={(checked) => updateField("isSmallCompany", checked === true)}
                data-testid="checkbox-small-company"
              />
              <Label
                htmlFor="small-company"
                className="text-sm font-medium cursor-pointer"
              >
                Small company (turnover ≤ ₦100m)
              </Label>
            </div>
          </div>
        </CollapsibleSection>
      )}

      {/* Action Buttons - Sticky on mobile */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4 -mx-4 rounded-lg shadow-lg border border-border md:shadow-none md:border-none md:bg-transparent md:p-0 md:mx-0">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCalculate}
              className="w-full h-12 text-base font-semibold shadow-sm"
              size="lg"
              data-testid="button-calculate-tax"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              size="lg"
              data-testid="button-clear"
            >
              <X className="w-5 h-5 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {results && (
        <div ref={resultsRef}>
          <TaxResults
            totalTax={results.totalTax}
            afterTaxIncome={results.afterTaxIncome}
            mode={mode}
            onRecalculate={handleRecalculate}
            taxableIncome={results.taxableIncome}
            effectiveRate={results.effectiveRate}
            breakdown={results.breakdown}
            income={results.income}
            totalDeductions={results.totalDeductions}
          />
        </div>
      )}
    </div>
  );
}
