import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useCalculatorStore } from "../store/useCalculatorStore";
import { useMemo } from "react";

// Limited colour palette that matches the brand (only 4 allowed, but a few shades)
const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#8b5cf6", "#ec4899"];

/**
 * ChartsSection
 *
 * Builds three charts from the live calculator data:
 * 1. Cost Breakdown (pie) – where your money goes before ads
 * 2. Profit vs Ad Cost (bar) – gross profit compared to ad spend
 * 3. ROAS vs Break‑even (bar) – current ROAS against the safety line
 *
 * Each chart updates automatically because it reads from the store.
 * We use `useMemo` to avoid recalculating the chart data on every render.
 */
export default function ChartsSection() {
  const inputs = useCalculatorStore((s) => s.inputs);
  const derived = useCalculatorStore((s) => s.getDerived());

  // ---- 1. Cost breakdown data (only positive costs) ----
  const costData = useMemo(() => {
    return [
      { name: "COGS", value: inputs.cogs },
      { name: "Shipping", value: inputs.shipping },
      { name: "Packaging", value: inputs.packaging },
      { name: "Gateway Fee", value: inputs.gatewayFee },
      { name: "Shopify Fee", value: inputs.shopifyFee },
      { name: "Other Costs", value: inputs.otherCosts },
    ].filter((d) => d.value > 0);
  }, [inputs]);

  // ---- 2. Profit vs Ad Cost ----
  const profitData = useMemo(() => {
    return [
      { name: "Gross Profit", value: derived.grossProfit },
      { name: "Ad Cost", value: derived.advertisingCost },
    ];
  }, [derived]);

  // ---- 3. ROAS comparison ----
  const roasData = useMemo(() => {
    return [
      { name: "Current ROAS", value: inputs.roas || 0 },
      { name: "Break‑even ROAS", value: derived.breakEvenROAS ?? 0 },
    ];
  }, [inputs, derived]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* ========== COST BREAKDOWN PIE CHART ========== */}
      <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={costData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {costData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val: number) => `₹${val.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ========== PROFIT VS AD COST BAR CHART ========== */}
      <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Profit vs Ad Spend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(val: number) => `₹${val.toFixed(2)}`} />
            <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v: number) => `₹${v}`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ========== ROAS VS BREAK‑EVEN BAR CHART ========== */}
      <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-xl border lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">ROAS vs Break‑even</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={roasData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {roasData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={idx === 0 ? "#16a34a" : "#dc2626"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
