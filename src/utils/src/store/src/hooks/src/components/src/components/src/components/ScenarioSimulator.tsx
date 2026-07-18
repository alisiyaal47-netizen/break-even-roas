import { useCalculatorStore } from "../store/useCalculatorStore";
import { SlidersHorizontal } from "lucide-react";

/**
 * ScenarioSimulator
 * 
 * A set of sliders + tiny number inputs that let users
 * play with the four most important numbers:
 *   Selling Price, Product Cost, Shipping, and ROAS.
 * 
 * Every change goes straight to the Zustand store,
 * so the whole dashboard reacts instantly.
 */
export default function ScenarioSimulator() {
  const inputs = useCalculatorStore((s) => s.inputs);
  const setInputs = useCalculatorStore((s) => s.setInputs);

  // These are the controls we expose as sliders
  const controls = [
    { label: "Selling Price", key: "sellingPrice" as const, min: 0, max: 5000, step: 10 },
    { label: "Product Cost",  key: "cogs" as const,         min: 0, max: 3000, step: 10 },
    { label: "Shipping",      key: "shipping" as const,     min: 0, max: 500,  step: 5  },
    { label: "ROAS",          key: "roas" as const,         min: 0.1, max: 20,  step: 0.1 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5" /> Scenario Simulator
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {controls.map(({ label, key, min, max, step }) => (
          <div key={key} className="space-y-1">
            {/* Label with live value */}
            <label className="text-sm font-medium flex justify-between">
              {label}
              <span className="font-mono text-brand-blue">
                {typeof inputs[key] === "number"
                  ? key === "roas"
                    ? (inputs[key] as number).toFixed(2)
                    : (inputs[key] as number).toFixed(0)
                  : ""}
              </span>
            </label>

            {/* Range slider */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={inputs[key] || 0}
              onChange={(e) => setInputs({ [key]: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue dark:accent-brand-blue"
            />

            {/* Tiny direct number input for precision */}
            <input
              type="number"
              value={inputs[key] || 0}
              onChange={(e) =>
                setInputs({ [key]: parseFloat(e.target.value) || 0 })
              }
              className="w-full mt-1 text-sm border rounded px-2 py-1"
              min={min}
              step={step}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
