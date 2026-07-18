import { create } from "zustand";
import { CalculatorInputs, DerivedValues, ProfitStatus } from "../types";
import { defaultInputs } from "../constants/defaults";
import { deriveAllValues, getProfitStatus } from "../utils/calculations";

interface CalculatorState {
  // The user's current inputs
  inputs: CalculatorInputs;

  // Actions to update inputs
  setInputs: (inputs: Partial<CalculatorInputs>) => void;
  resetInputs: () => void;

  // Helpers that compute values on demand (not stored, always fresh)
  getDerived: () => DerivedValues;
  getStatus: () => ProfitStatus;
}

// Zustand store — a simple, fast state container
export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  // Initial state loaded from defaults
  inputs: { ...defaultInputs },

  // Update only the fields that changed (merge with existing state)
  setInputs: (partial) =>
    set((state) => ({
      inputs: { ...state.inputs, ...partial },
    })),

  // Reset everything back to the original default values
  resetInputs: () =>
    set({ inputs: { ...defaultInputs } }),

  // Derive all calculated values from current inputs (no extra state needed)
  getDerived: () => deriveAllValues(get().inputs),

  // Determine profit status from current inputs + derived values
  getStatus: () => {
    const inputs = get().inputs;
    return getProfitStatus(inputs, deriveAllValues(inputs));
  },
}));
