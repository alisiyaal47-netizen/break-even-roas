import {
  Moon,
  Sun,
  RotateCcw,
  Copy,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { useCalculatorStore } from "../store/useCalculatorStore";
import { sampleInputs } from "../constants/defaults";
import toast from "react-hot-toast";

interface HeaderProps {
  dark: boolean;
  toggleDark: () => void;
}

/**
 * Header
 *
 * Displays the app name, theme switch, and action buttons.
 * Theme toggle reads/writes `dark` prop (controlled by parent).
 */
export default function Header({ dark, toggleDark }: HeaderProps) {
  const resetInputs = useCalculatorStore((s) => s.resetInputs);
  const setInputs = useCalculatorStore((s) => s.setInputs);
  const getDerived = useCalculatorStore((s) => s.getDerived);

  // Copies the key results to clipboard
  const handleCopy = () => {
    const d = getDerived();
    const text = `
Break‑even ROAS: ${d.breakEvenROAS?.toFixed(2) ?? "N/A"}
Gross Profit: ₹${d.grossProfit.toFixed(2)}
Gross Margin: ${d.grossMargin.toFixed(2)}%
Total Cost: ₹${d.totalCost.toFixed(2)}
Profit After Ads: ₹${d.profitAfterAds.toFixed(2)}
Net Profit: ₹${d.netProfit.toFixed(2)}
    `.trim();
    navigator.clipboard.writeText(text);
    toast.success("Results copied!");
  };

  // Future feature toasts
  const futureFeature = () => toast("Coming soon!", { icon: "🚧" });

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
      {/* Left: title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Break‑even ROAS
        </h1>
        <p className="text-sm opacity-70">Premium D2C Dashboard</p>
      </div>

      {/* Right: action buttons */}
      <div className="flex gap-2 flex-wrap">
        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Reset */}
        <button
          onClick={resetInputs}
          className="btn-secondary flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>

        {/* Sample Data */}
        <button
          onClick={() => setInputs(sampleInputs)}
          className="btn-secondary flex items-center gap-1"
        >
          Sample Data
        </button>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className="btn-primary flex items-center gap-1"
        >
          <Copy className="w-4 h-4" /> Copy
        </button>

        {/* Export PDF (placeholder) */}
        <button
          onClick={futureFeature}
          className="btn-secondary flex items-center gap-1"
        >
          <FileText className="w-4 h-4" /> PDF
        </button>

        {/* Export Excel (placeholder) */}
        <button
          onClick={futureFeature}
          className="btn-secondary flex items-center gap-1"
        >
          <FileSpreadsheet className="w-4 h-4" /> Excel
        </button>
      </div>
    </header>
  );
}
