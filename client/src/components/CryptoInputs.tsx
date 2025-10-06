import CurrencyInput from "./CurrencyInput";

interface CryptoInputsProps {
  buyPrice: string;
  sellPrice: string;
  quantity: string;
  onBuyPriceChange: (value: string) => void;
  onSellPriceChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  showQuantity: boolean;
}

export default function CryptoInputs({
  buyPrice,
  sellPrice,
  quantity,
  onBuyPriceChange,
  onSellPriceChange,
  onQuantityChange,
  showQuantity,
}: CryptoInputsProps) {
  return (
    <div className="space-y-4 p-4 bg-accent/30 rounded-lg border border-accent-border transition-all duration-300">
      <h3 className="text-sm font-semibold text-foreground">Crypto Asset Details</h3>
      <div className="grid grid-cols-1 gap-4">
        <CurrencyInput
          id="crypto-buy-price"
          label="Buy Price (₦)"
          value={buyPrice}
          onChange={onBuyPriceChange}
          placeholder="0"
        />
        <CurrencyInput
          id="crypto-sell-price"
          label="Sell Price (₦)"
          value={sellPrice}
          onChange={onSellPriceChange}
          placeholder="0"
        />
        {showQuantity && (
          <div className="animate-in slide-in-from-top-2 duration-250">
            <CurrencyInput
              id="crypto-quantity"
              label="Quantity (optional)"
              value={quantity}
              onChange={onQuantityChange}
              placeholder="1"
            />
          </div>
        )}
      </div>
    </div>
  );
}
