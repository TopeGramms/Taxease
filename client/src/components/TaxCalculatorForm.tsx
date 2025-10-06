import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CurrencyInput from "./CurrencyInput";
import TaxResults from "./TaxResults";
import FormSection from "./FormSection";
import { Calculator } from "lucide-react";

interface TaxFormData {
  employmentIncome: string;
  businessIncome: string;
  cryptoBuyPrice: string;
  cryptoSellPrice: string;
  cryptoQuantity: string;
  rentPaid: string;
  pensionContribution: string;
  nhfContribution: string;
  otherDeductions: string;
  isSmallCompany: boolean;
}

interface TaxCalculatorFormProps {
  mode: "2025" | "legacy";
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
    otherDeductions: "",
    isSmallCompany: false,
  });
  const [results, setResults] = useState<{
    totalTax: number;
    afterTaxIncome: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("taxease-data");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  const saveToLocalStorage = (data: TaxFormData) => {
    localStorage.setItem("taxease-data", JSON.stringify(data));
  };

  const updateField = (field: keyof TaxFormData, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    saveToLocalStorage(newData);
  };

  const calculate2025Tax = () => {
    const employment = Number(formData.employmentIncome) || 0;
    const business = Number(formData.businessIncome) || 0;
    const buyPrice = Number(formData.cryptoBuyPrice) || 0;
    const sellPrice = Number(formData.cryptoSellPrice) || 0;
    const quantity = Number(formData.cryptoQuantity) || 1;
    const cryptoGain = Math.max(0, (sellPrice - buyPrice) * quantity);

    const totalIncome = employment + business + cryptoGain;

    if (formData.isSmallCompany) {
      return {
        totalTax: 0,
        afterTaxIncome: totalIncome,
      };
    }

    const exemption = 800000;
    const rent = Number(formData.rentPaid) || 0;
    const pension = Number(formData.pensionContribution) || 0;
    const nhf = Number(formData.nhfContribution) || 0;
    const other = Number(formData.otherDeductions) || 0;

    const rentRelief = Math.min(rent * 0.2, 500000);
    const totalReliefs = rentRelief + pension + nhf + other;

    const taxableIncome = Math.max(0, totalIncome - exemption - totalReliefs);

    const brackets = [
      { limit: 300000, rate: 0.07 },
      { limit: 300000, rate: 0.11 },
      { limit: 500000, rate: 0.15 },
      { limit: 500000, rate: 0.19 },
      { limit: 1600000, rate: 0.21 },
      { limit: 3200000, rate: 0.24 },
      { limit: Infinity, rate: 0.25 },
    ];

    let tax = 0;
    let remaining = taxableIncome;

    for (const bracket of brackets) {
      if (remaining <= 0) break;
      const taxableInBracket = Math.min(remaining, bracket.limit);
      tax += taxableInBracket * bracket.rate;
      remaining -= taxableInBracket;
    }

    return {
      totalTax: Math.round(tax),
      afterTaxIncome: Math.round(totalIncome - tax),
    };
  };

  const calculateLegacyTax = () => {
    const employment = Number(formData.employmentIncome) || 0;
    const business = Number(formData.businessIncome) || 0;
    const buyPrice = Number(formData.cryptoBuyPrice) || 0;
    const sellPrice = Number(formData.cryptoSellPrice) || 0;
    const quantity = Number(formData.cryptoQuantity) || 1;
    const cryptoGain = Math.max(0, (sellPrice - buyPrice) * quantity);

    const salaryTax = employment * 0.1;
    const businessTax = business * 0.15;
    const cryptoTax = cryptoGain * 0.1;

    const totalTax = salaryTax + businessTax + cryptoTax;
    const totalIncome = employment + business + cryptoGain;

    return {
      totalTax: Math.round(totalTax),
      afterTaxIncome: Math.round(totalIncome - totalTax),
    };
  };

  const handleCalculate = () => {
    const calculatedResults = mode === "2025" ? calculate2025Tax() : calculateLegacyTax();
    setResults(calculatedResults);
  };

  const handleDownloadPDF = () => {
    console.log("PDF Download triggered");
    alert("PDF download feature coming soon!");
  };

  return (
    <div className="space-y-6">
      <FormSection title="Employment Income">
        <CurrencyInput
          id="employment-income"
          label="Employment Income (₦)"
          value={formData.employmentIncome}
          onChange={(val) => updateField("employmentIncome", val)}
          helperText="Your monthly or annual salary"
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

      {mode === "2025" && (
        <FormSection title="Deductions & Reliefs">
          <div className="space-y-4">
            <CurrencyInput
              id="rent-paid"
              label="Rent Paid (₦)"
              value={formData.rentPaid}
              onChange={(val) => updateField("rentPaid", val)}
              helperText="20% relief, max ₦500,000"
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

      <Button
        onClick={handleCalculate}
        className="w-full h-12 text-base font-semibold shadow-sm"
        size="lg"
        data-testid="button-calculate-tax"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calculate Tax
      </Button>

      {results && (
        <TaxResults
          totalTax={results.totalTax}
          afterTaxIncome={results.afterTaxIncome}
          mode={mode}
          onDownloadPDF={handleDownloadPDF}
        />
      )}
    </div>
  );
}
