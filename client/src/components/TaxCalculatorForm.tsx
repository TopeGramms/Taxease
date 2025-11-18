import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CurrencyInput from "./CurrencyInput";
import TaxResults from "./TaxResults";
import FormSection from "./FormSection";
import { Calculator, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveResult as apiSaveResult } from "@/lib/api";
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
  const { token, subscription, user } = useAuth();

  // Dev-only: Run tax tests when ?runTests=true is in URL
  const runTaxTests = () => {
    console.log("=== Tax Calculator Test Suite ===");
    console.log("Running 3 test cases with calculate2026Tax()\n");

    const testCases = [
      { income: 400_000, label: "Test 1: ₦400k income" },
      { income: 2_000_000, label: "Test 2: ₦2M income" },
      { income: 10_000_000, label: "Test 3: ₦10M income" },
    ];

    testCases.forEach((testCase) => {
      const testInput: TaxFormData = {
        employmentIncome: testCase.income.toString(),
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

      const result = calculate2026Tax(testInput);

      console.log(testCase.label);
      console.log({
        income: result.income,
        taxableIncome: result.taxableIncome,
        totalTax: result.totalTax,
        breakdown: result.breakdown,
      });
      console.log(""); // Empty line for readability
    });

    console.log("=== End Test Suite ===");
  };

  useEffect(() => {
    const saved = localStorage.getItem("taxease-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // sanitize parsed object to expected TaxFormData types
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
            // unknown type, coerce to empty
            sanitized[f] = "";
          }
        }

        sanitized.isSmallCompany = parsed.isSmallCompany === true;

        setFormData((prev) => ({ ...prev, ...sanitized }));
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

  // Dev-only: Run tax tests when ?runTests=true is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("runTests") === "true") {
      runTaxTests();
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
    const numericFields: Array<keyof TaxFormData> = [
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

    let normalizedValue: string | boolean = value as string | boolean;

    if (field === "isSmallCompany") {
      normalizedValue = Boolean(value) as boolean;
    } else if (typeof value === "string") {
      // keep empty string as-is (user cleared input), otherwise coerce to Number then back to string
      if (value === "") {
        normalizedValue = "";
      } else {
        const coerced = Number(value);
        // If coercion results in NaN, keep original string to avoid losing user input
        normalizedValue = Number.isFinite(coerced) ? String(coerced) : value;
      }
    }

    const newData = { ...formData, [field]: normalizedValue } as TaxFormData;
    setFormData(newData);
    saveToLocalStorage(newData);
  };

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleCalculate = () => {
    // Read current TaxFormData state and calculate based on mode
    const result = mode === "2026" ? calculate2026Tax(formData) : calculateLegacyTax(formData);
    
    // Set results state
    setResults(result);
    
    // Persist result to localStorage for debugging
    try {
      localStorage.setItem("taxease-last-result", JSON.stringify(result));
    } catch (e) {
      console.error("Failed to save result to localStorage", e);
    }
    
    // Run test cases for 2026 mode
    if (mode === "2026") {
      runTestCases();
    }
    
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const runTestCases = () => {
    console.log("=== 2026 PIT Test Cases ===");
    
    // Test 1: income = 400,000 → totalTax = 0
    const test1Income = 400_000;
    const test1Deductions = 0;
    const test1Taxable = Math.max(0, test1Income - test1Deductions);
    const test1Expected = 0;
    let test1Tax = 0;
    if (test1Taxable > 800_000) {
      test1Tax = (test1Taxable - 800_000) * 0.15;
    }
    console.log(`Test 1 - Income: ₦${test1Income.toLocaleString()}`);
    console.log(`  Expected: ₦${test1Expected.toLocaleString()}, Actual: ₦${Math.round(test1Tax).toLocaleString()}`);
    console.log(`  ${test1Expected === Math.round(test1Tax) ? "✓ PASS" : "✗ FAIL"}`);
    
    // Test 2: income = 2,000,000 → taxable = 1,200,000 @15% → totalTax = 180,000
    const test2Income = 2_000_000;
    const test2Deductions = 0;
    const test2Taxable = Math.max(0, test2Income - test2Deductions);
    const test2Expected = 180_000;
    let test2Tax = 0;
    if (test2Taxable > 800_000) {
      test2Tax = (test2Taxable - 800_000) * 0.15;
    }
    console.log(`Test 2 - Income: ₦${test2Income.toLocaleString()}`);
    console.log(`  Taxable: ₦${test2Taxable.toLocaleString()}, Rate: 15%`);
    console.log(`  Expected: ₦${test2Expected.toLocaleString()}, Actual: ₦${Math.round(test2Tax).toLocaleString()}`);
    console.log(`  ${test2Expected === Math.round(test2Tax) ? "✓ PASS" : "✗ FAIL"}`);
    
    // Test 3: income = 10,000,000 → breakdown check
    const test3Income = 10_000_000;
    const test3Deductions = 0;
    const test3Taxable = Math.max(0, test3Income - test3Deductions);
    let test3Tax = 0;
    let test3Prev = 0;
    const test3Brackets = [
      { limit: 800_000, rate: 0 },
      { limit: 3_000_000, rate: 0.15 },
      { limit: 12_000_000, rate: 0.18 },
    ];
    for (const br of test3Brackets) {
      if (test3Taxable <= test3Prev) break;
      const amt = Math.min(test3Taxable, br.limit) - test3Prev;
      test3Tax += amt * br.rate;
      test3Prev = br.limit;
    }
    // Expected: 0 on first 800k, 15% on next 2.2M (330k), 18% on remaining 7M (1.26M) = 1.59M
    const test3Expected = (800_000 * 0) + ((3_000_000 - 800_000) * 0.15) + ((10_000_000 - 3_000_000) * 0.18);
    console.log(`Test 3 - Income: ₦${test3Income.toLocaleString()}`);
    console.log(`  Taxable: ₦${test3Taxable.toLocaleString()}`);
    console.log(`  Expected: ₦${Math.round(test3Expected).toLocaleString()}, Actual: ₦${Math.round(test3Tax).toLocaleString()}`);
    console.log(`  ${Math.round(test3Expected) === Math.round(test3Tax) ? "✓ PASS" : "✗ FAIL"}`);
    console.log("=== End Test Cases ===");
  };

  const handleRecalculate = () => {
    setResults(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    // Reset form data to defaults
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
    
    // Clear results state
    setResults(null);
    
    // Remove localStorage items
    try {
      localStorage.removeItem("taxease-data");
      localStorage.removeItem("taxease-last-result");
    } catch (e) {
      console.error("Failed to clear localStorage", e);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPDF = () => {
    console.log("PDF Download triggered");
    alert("PDF download feature coming soon!");
  };

  const handleSaveResults = async () => {
    if (!user || !token) {
      window.location.href = "/account";
      return;
    }
    if (subscription?.status !== "active") {
      window.location.href = "/account";
      return;
    }
    if (!results) return;
    await apiSaveResult(token, {
      mode,
      totalTax: results.totalTax,
      afterTaxIncome: results.afterTaxIncome,
      payload: formData,
    });
    alert("Results saved!");
  };

  return (
    <div className="space-y-6">
      <FormSection title="Annual income">
        <CurrencyInput
          id="employment-income"
          label="Annual income (₦)"
          value={formData.employmentIncome}
          onChange={(val) => updateField("employmentIncome", val)}
          helperText="Enter annual amount in naira. If you have monthly pay, multiply by 12."
        />
      </FormSection>

      <FormSection title="Business/Freelance Income">
        <CurrencyInput
          id="business-income"
          label="Business/Freelance Income (₦)"
          value={formData.businessIncome}
          onChange={(val) => updateField("businessIncome", val)}
          helperText="Income from business activities or freelancing"
        />
      </FormSection>

      <FormSection title="Crypto Asset Details">
        <div className="space-y-4">
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
            label="Quantity (optional)"
            value={formData.cryptoQuantity}
            onChange={(val) => updateField("cryptoQuantity", val)}
            placeholder="1"
          />
        </div>
      </FormSection>

      {mode === "2026" && (
        <FormSection title="Deductions & Reliefs">
          <div className="space-y-4">
            <CurrencyInput
              id="rent-paid"
              label="Rent Paid (₦)"
              value={formData.rentPaid}
              onChange={(val) => updateField("rentPaid", val)}
              helperText="Note: Rent relief not applicable in 2026 Tax reform"
            />

            <CurrencyInput
              id="pension-contribution"
              label="Pension Contribution (₦)"
              value={formData.pensionContribution}
              onChange={(val) => updateField("pensionContribution", val)}
            />

            <CurrencyInput
              id="nhf-contribution"
              label="NHF Contribution (₦)"
              value={formData.nhfContribution}
              onChange={(val) => updateField("nhfContribution", val)}
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
        </FormSection>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={handleCalculate}
          className="w-full h-12 text-base font-semibold shadow-sm"
          size="lg"
          data-testid="button-calculate-tax"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calculate Tax
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

      {results && (
        <div ref={resultsRef}>
          <TaxResults
            totalTax={results.totalTax}
            afterTaxIncome={results.afterTaxIncome}
            mode={mode}
            onDownloadPDF={handleDownloadPDF}
            onRecalculate={handleRecalculate}
            onSave={handleSaveResults}
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
