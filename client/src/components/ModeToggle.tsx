import { useState } from "react";

interface ModeToggleProps {
  mode: "2025" | "legacy";
  onModeChange: (mode: "2025" | "legacy") => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-full">
      <button
        type="button"
        data-testid="button-mode-2025"
        onClick={() => onModeChange("2025")}
        className={`flex-1 px-6 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${
          mode === "2025"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover-elevate active-elevate-2"
        }`}
      >
        2025 Reform
      </button>
      <button
        type="button"
        data-testid="button-mode-legacy"
        onClick={() => onModeChange("legacy")}
        className={`flex-1 px-6 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${
          mode === "legacy"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover-elevate active-elevate-2"
        }`}
      >
        Legacy (Pre-2025)
      </button>
    </div>
  );
}
