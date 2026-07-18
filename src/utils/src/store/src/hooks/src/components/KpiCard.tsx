import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;                     // label for the card
  value: number | string;            // the displayed value (could be "N/A")
  icon: LucideIcon;                  // icon from lucide-react
  color?: "blue" | "green" | "red" | "white";   // accent color
  isCurrency?: boolean;              // formats as ₹ currency
}

/**
 * KpiCard
 * Displays a single KPI value with smooth animations.
 * When `value` changes, the number fades in/out for a premium feel.
 */
export default function KpiCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  isCurrency = false,
}: KpiCardProps) {
  // Format the displayed value:
  // - Numbers: use toLocaleString if currency, otherwise trim trailing zeros
  // - Strings (like "N/A"): show as-is
  const displayValue =
    typeof value === "number"
      ? isCurrency
        ? `₹${value.toLocaleString("en-IN")}`
        : value.toFixed(2).replace(/\.?0+$/, "")
      : value;

  // Map the color name to Tailwind classes using only our 4 brand colors
  const colorClasses = {
    blue:  "text-brand-blue border-brand-blue/20 bg-brand-white/90",
    green: "text-brand-green border-brand-green/20 bg-brand-white/90",
    red:   "text-brand-red border-brand-red/20 bg-brand-white/90",
    white: "text-gray-900 border-gray-200 bg-white dark:text-white dark:bg-gray-800/50",
  };

  return (
    <motion.div
      layout
      // use layout for smooth position changes
      className={`relative p-6 rounded-2xl border shadow-sm transition-colors ${colorClasses[color]}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 opacity-70" />
        <span className="text-sm uppercase tracking-wide font-medium opacity-70">
          {title}
        </span>
      </div>

      {/* Animate the number when it changes */}
      <AnimatePresence mode="wait">
        <motion.p
          key={displayValue}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-4xl font-bold"
        >
          {displayValue}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
