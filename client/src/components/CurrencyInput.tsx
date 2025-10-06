import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CurrencyInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
}

export default function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
  helperText,
}: CurrencyInputProps) {
  const formatCurrency = (val: string) => {
    const num = val.replace(/[^\d]/g, "");
    if (!num) return "";
    return Number(num).toLocaleString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    onChange(rawValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          ₦
        </span>
        <Input
          id={id}
          data-testid={`input-${id}`}
          type="text"
          value={formatCurrency(value)}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-8 h-12 text-base"
        />
      </div>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
