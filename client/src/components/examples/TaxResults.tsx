import TaxResults from "../TaxResults";

export default function TaxResultsExample() {
  const handleDownload = () => {
    console.log("Download PDF triggered");
  };

  return (
    <div className="w-full max-w-md">
      <TaxResults
        totalTax={450000}
        afterTaxIncome={3550000}
        mode="2025"
        onDownloadPDF={handleDownload}
      />
    </div>
  );
}
