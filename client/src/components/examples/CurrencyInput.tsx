import { useState } from "react";
import CurrencyInput from "../CurrencyInput";

export default function CurrencyInputExample() {
  const [value, setValue] = useState("");

  return (
    <div className="w-full max-w-md space-y-4">
      <CurrencyInput
        id="employment-income"
        label="Employment Income (₦)"
        value={value}
        onChange={setValue}
        helperText="Your monthly or annual salary"
      />
    </div>
  );
}
