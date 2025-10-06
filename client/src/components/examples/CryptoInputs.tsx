import { useState } from "react";
import CryptoInputs from "../CryptoInputs";

export default function CryptoInputsExample() {
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const showQuantity = buyPrice !== "" || sellPrice !== "";

  return (
    <div className="w-full max-w-md">
      <CryptoInputs
        buyPrice={buyPrice}
        sellPrice={sellPrice}
        quantity={quantity}
        onBuyPriceChange={setBuyPrice}
        onSellPriceChange={setSellPrice}
        onQuantityChange={setQuantity}
        showQuantity={showQuantity}
      />
    </div>
  );
}
