import { Check, TrendingUp, Shield } from "lucide-react";
interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <div className={`${className} flex items-center justify-center overflow-hidden`}>
      <img
        src="/Minimalist_Taxease_Logo_with_Growth_Symbols-removebg-preview.png"
        alt="Taxease Logo"
        className="w-full h-full object-cover scale-150"
      />
    </div>
  );
}
