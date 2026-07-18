import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCalculatorStore } from "../store/useCalculatorStore";
import { CalculatorInputs } from "../types";

/**
 * Custom hook that sets up a React Hook Form and syncs it with Zustand.
 * 
 * What it does:
 * - Creates a form with default values from the store
 * - Watches for changes (onChange mode) and pushes them to the store
 * - When the store resets (e.g., "Reset" button), the form resets too
 * - Provides a helper to register numeric inputs with `valueAsNumber`
 */
export function useCalculatorForm() {
  // Get current inputs and setter from the global store
  const { inputs, setInputs } = useCalculatorStore();

  // React Hook Form setup
  const form = useForm<CalculatorInputs>({
    defaultValues: inputs,
    mode: "onChange",               // re-validate on every change
    reValidateMode: "onChange",
  });

  // Watch all fields — returns the latest values whenever anything changes
  const watched = form.watch();

  // Sync: whenever the watched values change, push them to Zustand
  useEffect(() => {
    setInputs(watched);
  }, [watched, setInputs]);

  // Sync back: if the store's inputs change (e.g., reset), update the form
  useEffect(() => {
    form.reset(inputs);
  }, [inputs, form]);

  /**
   * registerNumber
   * Registers a numeric field with valueAsNumber: true,
   * so that React Hook Form converts the string from the input into a number.
   * 
   * Also adds a min validation to prevent negative numbers.
   */
  const registerNumber = (name: keyof CalculatorInputs) =>
    form.register(name, {
      valueAsNumber: true,
      min: { value: 0, message: "Must be ≥ 0" },
    });

  // Return everything the form component needs
  return { form, registerNumber };
}
