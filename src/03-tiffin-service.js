/**
 * 🍱 Mumbai Tiffin Service - Plan Builder
 *
 * Mumbai ki famous tiffin delivery service hai. Customer ka plan banana hai
 * using destructuring parameters aur rest/spread operators.
 *
 * Functions:
 *
 *   1. createTiffinPlan({ name, mealType = "veg", days = 30 })
 *      - Destructured parameter with defaults!
 *      - Meal prices per day: veg=80, nonveg=120, jain=90
 *      - Agar mealType unknown hai, return null
 *      - Agar name missing/empty, return null
 *      - Return: { name, mealType, days, dailyRate, totalCost }
 *
 *   2. combinePlans(...plans)
 *      - Rest parameter! Takes any number of plan objects
 *      - Each plan: { name, mealType, days, dailyRate, totalCost }
 *      - Return: { totalCustomers, totalRevenue, mealBreakdown }
 *      - mealBreakdown: { veg: count, nonveg: count, ... }
 *      - Agar koi plans nahi diye, return null
 *
 *   3. applyAddons(plan, ...addons)
 *      - plan: { name, mealType, days, dailyRate, totalCost }
 *      - Each addon: { name: "raita", price: 15 }
 *      - Add each addon price to dailyRate
 *      - Recalculate totalCost = new dailyRate * days
 *      - Return NEW plan object (don't modify original)
 *      - addonNames: array of addon names added
 *      - Agar plan null hai, return null
 *
 * Hint: Use { destructuring } in params, ...rest for variable args,
 *   spread operator for creating new objects
 *
 * @example
 *   createTiffinPlan({ name: "Rahul" })
 *   // => { name: "Rahul", mealType: "veg", days: 30, dailyRate: 80, totalCost: 2400 }
 *
 *   combinePlans(plan1, plan2, plan3)
 *   // => { totalCustomers: 3, totalRevenue: 7200, mealBreakdown: { veg: 2, nonveg: 1 } }
 */
export function createTiffinPlan({ name, mealType = "veg", days = 30 } = {}) {
  const validMeal = new Set(["veg", "nonveg", "jain"]);
  if (!validMeal.has(mealType)) return null;
  if (typeof name !== "string" || !name || name === "") return null;
  let dailyRate;
  if (mealType === "veg") {
    dailyRate = 80;
  } else if (mealType === "nonveg") {
    dailyRate = 120;
  } else if (mealType === "jain") {
    dailyRate = 90;
  } else {
    dailyRate = 0;
  }

  const totalCost = dailyRate * days;

  return {
    name: name.trim(),
    mealType,
    days,
    dailyRate,
    totalCost,
  };
}

export function combinePlans(...plans) {
  if(plans.length === 0) return null;
  const totalCustomers = plans.length;
  const totalRevenue = plans.reduce((sum, plan) => {
    const totalRate = typeof plan.totalCost === "number" ? plan.totalCost : 0;
    return sum + totalRate;
  },0);
  const vegCount = plans.filter((plan) => {
    return plan.mealType === "veg";
  }).length;
  const nonVegCount = plans.filter((plan) => {
    return plan.mealType === "nonveg";
  }).length;
  const mealBreakdown = {
    veg: vegCount,
    nonveg: nonVegCount,
  };

  return {
    totalCustomers,
    totalRevenue,
    mealBreakdown,
  };
}

export function applyAddons(plan, ...addons) {
  if (typeof plan !== "object" || plan === null) return null;
  if(addons.length === 0) return {
    name: plan.name,
    mealType: plan.mealType,
    days: plan.days,
    dailyRate: plan.dailyRate,
    totalCost:  plan.totalCost,
    addonNames : []
  }

  let newDailyRate = plan.dailyRate;
  addons.forEach((addon) => {
    newDailyRate += typeof addon.price === "number" ? addon.price : 0;
  });

  const newTotalCost = newDailyRate * plan.days;
  const addonNames = addons.map((addon) => {
    return typeof addon.name === "string" ? addon.name : "";
  });
  const newPlan = {...plan};
  newPlan.dailyRate = newDailyRate;
  newPlan.totalCost = newTotalCost;
  newPlan.addonNames = addonNames;

  return newPlan;
}
