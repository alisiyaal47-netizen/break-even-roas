import { useCalculatorForm } from "../hooks/useCalculatorForm";
import {
  Package,
  Truck,
  CreditCard,
  ShoppingCart,
  CircleDollarSign,
} from "lucide-react";

/**
 * InputForm
 *
 * Collects every user input (product name, all costs, ad ROAS/spend)
 * and syncs them live with the Zustand store via React Hook Form.
 *
 * Why this exists:
 *   - Central place for all text/number fields
 *   - Uses React Hook Form for validation and instant updates
 *   - The custom hook `useCalculatorForm` wires everything together
 */
export default function InputForm() {
  // Get the form instance and the special numeric register helper
  const { form, registerNumber } = useCalculatorForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      {/* ----- PRODUCT & SELLING PRICE ----- */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <Package className="w-4 h-4" /> Product Name
          </label>
          <input
            {...register("productName")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="e.g. Premium T-Shirt"
          />
        </div>

        {/* Selling Price */}
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <CircleDollarSign className="w-4 h-4" /> Selling Price
          </label>
          <input
            type="number"
            {...registerNumber("sellingPrice")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          {errors.sellingPrice && (
            <p className="text-xs text-brand-red mt-1">
              {errors.sellingPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* ----- COSTS (6 fields) ----- */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* COGS */}
        <div>
          <label className="text-sm font-medium">COGS</label>
          <input
            type="number"
            {...registerNumber("cogs")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Shipping */}
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <Truck className="w-4 h-4" /> Shipping
          </label>
          <input
            type="number"
            {...registerNumber("shipping")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Packaging */}
        <div>
          <label className="text-sm font-medium">Packaging</label>
          <input
            type="number"
            {...registerNumber("packaging")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Gateway Fee */}
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <CreditCard className="w-4 h-4" /> Gateway Fee
          </label>
          <input
            type="number"
            {...registerNumber("gatewayFee")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Shopify Fee */}
        <div>
          <label className="text-sm font-medium flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" /> Shopify Fee
          </label>
          <input
            type="number"
            {...registerNumber("shopifyFee")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Other Costs */}
        <div>
          <label className="text-sm font-medium">Other Costs</label>
          <input
            type="number"
            {...registerNumber("otherCosts")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      {/* ----- ADVERTISING ----- */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* ROAS */}
        <div>
          <label className="text-sm font-medium">ROAS</label>
          <input
            type="number"
            {...registerNumber("roas")}
            step="0.01"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Ad Spend (optional) */}
        <div>
          <label className="text-sm font-medium">Ad Spend (optional)</label>
          <input
            type="number"
            {...registerNumber("adSpend")}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
