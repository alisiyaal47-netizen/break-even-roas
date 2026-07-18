import { CalculatorInputs, DerivedValues, ProfitStatus } from "../types";

/**
 * 1️⃣ TOTAL COST
 * Adds up every expense EXCEPT advertising.
 * Like: all the money you spent to make & deliver the product.
 */
export function computeTotalCost(inputs: CalculatorInputs): number {
  // What if someone doesn't fill a field? We treat empty as 0.
  const safe = (n: number) => n || 0;
  return (
    safe(inputs.cogs) +
    safe(inputs.shipping) +
    safe(inputs.packaging) +
    safe(inputs.gatewayFee) +
    safe(inputs.shopifyFee) +
    safe(inputs.otherCosts)
  );
}

/**
 * 2️⃣ GROSS PROFIT
 * The money left after paying for the product itself.
 * If you sell for ₹500 and total cost is ₹300, you keep ₹200.
 */
export function computeGrossProfit(inputs: CalculatorInputs): number {
  const totalCost = computeTotalCost(inputs);
  return (inputs.sellingPrice || 0) - totalCost;
}

/**
 * 3️⃣ GROSS MARGIN %
 * What percentage of the selling price is actual profit (before ads).
 * Formula: (Gross Profit ÷ Selling Price) × 100
 */
export function computeGrossMargin(inputs: CalculatorInputs): number {
  const sellingPrice = inputs.sellingPrice || 0;
  if (sellingPrice === 0) return 0;
  const grossProfit = computeGrossProfit(inputs);
  return (grossProfit / sellingPrice) * 100;
}

/**
 * 4️⃣ BREAK‑EVEN ROAS
 * The minimum ROAS your ads must hit so you don’t lose money.
 * Formula: Selling Price ÷ Gross Profit
 * 
 * Example: Selling Price ₹500, Gross Profit ₹200
 * Break‑even ROAS = 500 ÷ 200 = 2.5
 * 
 * That means for every ₹1 you spend on ads, you must earn at least ₹2.50.
 * If your actual ROAS is 2.5, you break even (no profit, no loss).
 * If it’s 3.0, you make money. If it’s 2.0, you lose money.
 *
 * Returns null if gross profit is zero or negative (can't divide).
 */
export function computeBreakEvenROAS(inputs: CalculatorInputs): number | null {
  const grossProfit = computeGrossProfit(inputs);
  if (grossProfit <= 0) return null; // impossible to break even
  return (inputs.sellingPrice || 0) / grossProfit;
}

/**
 * 5️⃣ REVENUE FROM ADS
 * How much total sales the ads brought in.
 * Formula: Revenue = ROAS × Ad Spend
 */
export function computeRevenue(inputs: CalculatorInputs): number {
  return (inputs.roas || 0) * (inputs.adSpend || 0);
}

/**
 * 6️⃣ ADVERTISING COST
 * How much you spent on ads.
 * Since Revenue = ROAS × Ad Spend, rearranging gives:
 * Ad Spend = Revenue ÷ ROAS
 * (This is the same as the adSpend input, but we keep the formula.)
 */
export function computeAdvertisingCost(inputs: CalculatorInputs): number {
  const revenue = computeRevenue(inputs);
  const roas = inputs.roas || 0;
  if (roas === 0) return 0;
  return revenue / roas; // will equal adSpend, but consistent
}

/**
 * 7️⃣ PROFIT AFTER ADS
 * Gross Profit minus the ad money spent.
 * If positive, you’re actually making profit.
 */
export function computeProfitAfterAds(inputs: CalculatorInputs): number {
  const grossProfit = computeGrossProfit(inputs);
  const adCost = computeAdvertisingCost(inputs);
  return grossProfit - adCost;
}

/**
 * 8️⃣ NET PROFIT
 * Total revenue from ads minus all costs (product + ads).
 * Another way to see the real bottom line.
 */
export function computeNetProfit(inputs: CalculatorInputs): number {
  const revenue = computeRevenue(inputs);
  const totalCost = computeTotalCost(inputs);
  const adCost = computeAdvertisingCost(inputs);
  return revenue - adCost - totalCost;
}

// ------------------------------------------------------------------
// DERIVED VALUES – combines all calculations into one object
export function deriveAllValues(inputs: CalculatorInputs): DerivedValues {
  return {
    totalCost: computeTotalCost(inputs),
    grossProfit: computeGrossProfit(inputs),
    grossMargin: computeGrossMargin(inputs),
    breakEvenROAS: computeBreakEvenROAS(inputs),
    revenue: computeRevenue(inputs),
    advertisingCost: computeAdvertisingCost(inputs),
    profitAfterAds: computeProfitAfterAds(inputs),
    netProfit: computeNetProfit(inputs),
  };
}

// ------------------------------------------------------------------
// PROFIT STATUS – tells the user if they're winning or losing
export function getProfitStatus(
  inputs: CalculatorInputs,
  derived: DerivedValues
): ProfitStatus {
  const breakEven = derived.breakEvenROAS;
  if (breakEven === null) return "loss"; // can't break even
  const roas = inputs.roas || 0;

  if (roas > breakEven) return "profitable";
  if (Math.abs(roas - breakEven) < 0.001) return "break-even"; // tiny rounding
  return "loss";
}
