export interface TaxFormData {
  employmentIncome: string;
  businessIncome: string;
  cryptoBuyPrice: string;
  cryptoSellPrice: string;
  cryptoQuantity: string;
  rentPaid: string;
  pensionContribution: string;
  nhfContribution: string;
  lifeInsurance: string;
  otherDeductions: string;
  isSmallCompany: boolean;
}

export interface TaxResult {
  income: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTax: number;
  afterTaxIncome: number;
  effectiveRate: number;
  breakdown: Array<{ range: string; amount: number; rate: number; tax: number }>;
  exempt?: boolean;
}

export function calculate2026Tax(input: TaxFormData): TaxResult {
  const employment = Number(input.employmentIncome) || 0;
  const business = Number(input.businessIncome) || 0;
  const buyPrice = Number(input.cryptoBuyPrice) || 0;
  const sellPrice = Number(input.cryptoSellPrice) || 0;
  const quantity = Number(input.cryptoQuantity) || 1;
  const cryptoGain = Math.max(0, (sellPrice - buyPrice) * quantity);

  const totalIncome = employment + business + cryptoGain;

  // Apply deductions before computing taxable income
  const pension = Number(input.pensionContribution) || 0;
  const nhf = Number(input.nhfContribution) || 0;
  const lifeInsurance = Number(input.lifeInsurance) || 0;
  const other = Number(input.otherDeductions) || 0;
  const totalDeductions = pension + nhf + lifeInsurance + other;

  // Small company exemption: Companies with annual turnover ≤ ₦100M are exempt from PIT
  // When isSmallCompany is true, no tax is payable and after-tax income = income - deductions
  if (input.isSmallCompany) {
    return {
      income: totalIncome,
      totalDeductions,
      taxableIncome: 0,
      totalTax: 0,
      afterTaxIncome: Math.round(totalIncome - totalDeductions),
      effectiveRate: 0,
      breakdown: [],
      exempt: true,
    };
  }

  // Taxable income = income - deductions (no separate exemption, first bracket is 0%)
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);

  // 2026 PIT brackets with cumulative upper bounds
  const brackets = [
    { limit: 800_000, rate: 0 },
    { limit: 3_000_000, rate: 0.15 },
    { limit: 12_000_000, rate: 0.18 },
    { limit: 25_000_000, rate: 0.21 },
    { limit: 50_000_000, rate: 0.23 },
    { limit: Infinity, rate: 0.25 },
  ];

  let tax = 0;
  let previousLimit = 0;
  const breakdown: Array<{ range: string; amount: number; rate: number; tax: number }> = [];

  for (const bracket of brackets) {
    if (taxableIncome <= previousLimit) break;

    const amountInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
    const bracketTax = amountInBracket * bracket.rate;
    tax += bracketTax;

    if (amountInBracket > 0) {
      const rangeStart = previousLimit === 0 ? "0" : `₦${previousLimit.toLocaleString()}`;
      const rangeEnd = bracket.limit === Infinity ? "∞" : `₦${bracket.limit.toLocaleString()}`;
      breakdown.push({
        range: `${rangeStart} - ${rangeEnd}`,
        amount: amountInBracket,
        rate: bracket.rate,
        tax: bracketTax,
      });
    }

    previousLimit = bracket.limit;
  }

  const effectiveRate = totalIncome > 0 ? tax / totalIncome : 0;

  return {
    income: totalIncome,
    totalDeductions,
    taxableIncome: Math.round(taxableIncome),
    totalTax: Math.round(tax),
    afterTaxIncome: Math.round(totalIncome - tax),
    effectiveRate: Math.round(effectiveRate * 10000) / 100, // Round to 2 decimal places as percentage
    breakdown,
    exempt: false,
  };
}

export function calculateLegacyTax(input: TaxFormData): TaxResult {
  const employment = Number(input.employmentIncome) || 0;
  const business = Number(input.businessIncome) || 0;
  const buyPrice = Number(input.cryptoBuyPrice) || 0;
  const sellPrice = Number(input.cryptoSellPrice) || 0;
  const quantity = Number(input.cryptoQuantity) || 1;
  const cryptoGain = Math.max(0, (sellPrice - buyPrice) * quantity);

  const salaryTax = employment * 0.1;
  const businessTax = business * 0.15;
  const cryptoTax = cryptoGain * 0.1;

  const totalTax = salaryTax + businessTax + cryptoTax;
  const totalIncome = employment + business + cryptoGain;
  const totalDeductions = 0; // Legacy mode doesn't use deductions

  return {
    income: totalIncome,
    totalDeductions,
    taxableIncome: totalIncome,
    totalTax: Math.round(totalTax),
    afterTaxIncome: Math.round(totalIncome - totalTax),
    effectiveRate: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
    breakdown: [],
    exempt: false,
  };
}

