import { useCalculatorStore } from "../store/useCalculatorStore";
import { getProfitStatus } from "../utils/calculations";
import { TrendingUp, Minus, TrendingDown } from "lucide-react";

/**
 * ProfitStatus
 * 
 * Looks at the user's current ROAS and break‑even ROAS,
 * then decides if the campaign is making money.
 * 
 * It shows:
 * - 🟢 Profitable (current ROAS > break‑even)
 * - 🟡 Break‑even (current ROAS = break‑even)
 * - 🔴 Loss      (current ROAS < break‑even)
 */
export default function ProfitStatus() {
  // Get the raw inputs and derived results from the global store
  const inputs = useCalculatorStore((s) => s.inputs);
  const derived = useCalculatorStore((s) => s.getDerived());

  const status = getProfitStatus(inputs, derived);
  const breakEven = derived.breakEvenROAS;

  // Config for each status: background, text color, icon, explanation
  const config = {
    profitable: {
      bg: "bg-brand-green/10 border-brand-green/30",
      text: "text-brand-green",
      icon: TrendingUp,
      message: "Your ROAS is above break-even. This campaign is making money.",
    },
    "break-even": {
      bg: "bg-yellow-100/10 border-yellow-300/30",   // yellow is allowed? The palette says only 4 colors, but for break-even we might need a neutral. The spec says "Green → profit", "Red → losses", "Blue → actions". For break-even we can use a muted neutral. I'll use a light yellow that matches "warning" but note it's not explicitly forbidden as long as it's not an accent color. I'll keep it subtle and still use white/gray. To stick to the strict palette, we could use "bg-gray-100/50 border-gray-300". Let's do that to respect only four colors. I'll adjust.
      text: "text-yellow-600 dark:text-yellow-400",   // yellow text can be considered a shade of green/red? Better use gray. The spec: "Use only these colors: Primary Blue, Green, Red, White". Yellow is not allowed. So I'll map break-even to a gray color scheme.
      icon: Minus,
      message: "You're covering costs but not making profit.",
    },
    loss: {
      bg: "bg-brand-red/10 border-brand-red/30",
      text: "text-brand-red",
      icon: TrendingDown,
      message: "Your ROAS is below break-even. This campaign is losing money.",
    },
  };

  // Override break-even styling to stay within allowed colors (gray/white)
  const breakEvenConfig = {
    bg: "bg-gray-100/10 border-gray-300/30 dark:bg-gray-800/50",
    text: "text-gray-700 dark:text-gray-300",
    icon: Minus,
    message: "You're covering costs but not making profit.",
  };

  // Choose the correct config based on status
  const currentConfig = status === "break-even" ? breakEvenConfig : config[status];
  const { bg, text, icon: Icon, message } = currentConfig;

  return (
    <div className={`p-5 rounded-xl border ${bg} flex items-center gap-4`}>
      <Icon className={`w-8 h-8 ${text}`} />
      <div>
        <p className={`text-lg font-semibold ${text}`}>
          {status === "profitable" && "🟢 Profitable"}
          {status === "break-even" && "🟡 Break‑even"}
          {status === "loss" && "🔴 Loss"}
        </p>
        <p className="text-sm opacity-80 mt-1">{message}</p>
        {breakEven !== null && (
          <p className="text-xs mt-2 opacity-60">
            Break‑even ROAS: {breakEven.toFixed(2)} — Current ROAS: {(inputs.roas || 0).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
