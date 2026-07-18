import { useEffect, useState } from "react";
import Header from "../components/Header";
import KpiCard from "../components/KpiCard";
import ProfitStatus from "../components/ProfitStatus";
import InputForm from "../components/InputForm";
import ScenarioSimulator from "../components/ScenarioSimulator";
import ChartsSection from "../components/ChartsSection";
import { useCalculatorStore } from "../store/useCalculatorStore";
import {
  Target,
  DollarSign,
  Percent,
  Calculator,
  Banknote,
  TrendingUp,
} from "lucide-react";

/**
 * CalculatorPage
 *
 * The single page that holds the entire dashboard.
 *
 * Responsibilities:
 * - Manages dark/light theme and persists to localStorage
 * - Assembles the header, KPI cards, profit status, input form,
 *   scenario simulator, and charts
 * - Pulls derived values from the Zustand store for the KPI cards
 *
 * There is NO "Calculate" button — everything updates live.
 */
export default function CalculatorPage() {
  // ----- THEME STATE -----
  // Check localStorage first, then system preference
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        return stored === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Toggle dark mode and save preference
  const toggleDark = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  // Add/remove 'dark' class on <html> so Tailwind dark mode works
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ----- DERIVED DATA -----
  // This object is recalculated every render because it calls the store helper
  // (which only recomputes when inputs change, thanks to Zustand selectors)
  const derived = useCalculatorStore((s) => s.getDerived());

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-gray-900 text-brand-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ----- HEADER (title + actions) ----- */}
        <Header dark={dark} toggleDark={toggleDark} />

        {/* ----- KPI CARDS GRID (6 cards) ----- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <KpiCard
            title="Break‑even ROAS"
            value={derived.breakEvenROAS?.toFixed(2) ?? "N/A"}
            icon={Target}
            color="red"
          />
          <KpiCard
            title="Gross Profit"
            value={derived.grossProfit}
            icon={DollarSign}
            color="green"
            isCurrency
          />
          <KpiCard
            title="Gross Margin"
            value={`${derived.grossMargin.toFixed(1)}%`}
            icon={Percent}
            color="blue"
          />
          <KpiCard
            title="Total Cost"
            value={derived.totalCost}
            icon={Calculator}
            color="white"
            isCurrency
          />
          <KpiCard
            title="Profit After Ads"
            value={derived.profitAfterAds}
            icon={TrendingUp}
            color={derived.profitAfterAds >= 0 ? "green" : "red"}
            isCurrency
          />
          <KpiCard
            title="Net Profit"
            value={derived.netProfit}
            icon={Banknote}
            color={derived.netProfit >= 0 ? "green" : "red"}
            isCurrency
          />
        </div>

        {/* ----- PROFIT STATUS BANNER ----- */}
        <div className="mb-8">
          <ProfitStatus />
        </div>

        {/* ----- INPUTS & SIMULATOR (two columns) ----- */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Left: all cost & ad inputs */}
          <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-2xl border">
            <h2 className="text-xl font-semibold mb-4">Product & Costs</h2>
            <InputForm />
          </div>

          {/* Right: scenario sliders */}
          <div className="bg-white/80 dark:bg-gray-800/50 p-6 rounded-2xl border">
            <ScenarioSimulator />
          </div>
        </div>

        {/* ----- CHARTS ----- */}
        <div>
          <ChartsSection />
        </div>
      </div>
    </div>
  );
}
