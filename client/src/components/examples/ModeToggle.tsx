import { useState } from "react";
import ModeToggle from "../ModeToggle";

export default function ModeToggleExample() {
  const [mode, setMode] = useState<"2025" | "legacy">("2025");

  return (
    <div className="w-full max-w-md">
      <ModeToggle mode={mode} onModeChange={setMode} />
    </div>
  );
}
