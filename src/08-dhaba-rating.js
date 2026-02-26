/**
 * 🍛 Highway Dhaba Rating System - Higher-Order Functions
 *
 * Highway pe dhabas ki rating system bana raha hai. Higher-order functions
 * (HOF) use karne hain — aise functions jo doosre functions ko parameter
 * mein lete hain YA return karte hain.
 *
 * Functions:
 *
 *   1. createFilter(field, operator, value)
 *      - Returns a FUNCTION that filters objects
 *      - Operators: ">", "<", ">=", "<=", "==="
 *      - e.g., createFilter("rating", ">=", 4) returns a function that
 *        takes an object and returns true if object.rating >= 4
 *      - Unknown operator => return function that always returns false
 *
 *   2. createSorter(field, order = "asc")
 *      - Returns a COMPARATOR function for Array.sort()
 *      - order "asc" => ascending, "desc" => descending
 *      - Works with both numbers and strings
 *
 *   3. createMapper(fields)
 *      - fields: array of field names, e.g., ["name", "rating"]
 *      - Returns a function that takes an object and returns a new object
 *        with ONLY the specified fields
 *      - e.g., createMapper(["name"])({name: "Dhaba", rating: 4}) => {name: "Dhaba"}
 *
 *   4. applyOperations(data, ...operations)
 *      - data: array of objects
 *      - operations: any number of functions to apply SEQUENTIALLY
 *      - Each operation takes an array and returns an array
 *      - Apply first operation to data, then second to result, etc.
 *      - Return final result
 *      - Agar data not array, return []
 *
 * Hint: HOF = functions that take functions as arguments or return functions.
 *   createFilter returns a function. applyOperations takes functions as args.
 *
 * @example
 *   const highRated = createFilter("rating", ">=", 4);
 *   highRated({ name: "Punjab Dhaba", rating: 4.5 }) // => true
 *
 *   const byRating = createSorter("rating", "desc");
 *   [{ rating: 3 }, { rating: 5 }].sort(byRating)
 *   // => [{ rating: 5 }, { rating: 3 }]
 */
export function createFilter(field, operator, value) {
  if (
    typeof field !== "string" ||
    field === "" ||
    typeof operator !== "string" ||
    operator === ""
  )
    return function () {
      return false;
    };

  const validOperator = new Set([">", "<", ">=", "<=", "==="]);
  if (!validOperator.has(operator))
    return function () {
      return false;
    };

  return function (obj) {
    if (typeof obj !== "object" || obj === null) return false;

    const val = obj[field];

    if (operator === ">") return val > value;
    if (operator === "<") return val < value;
    if (operator === ">=") return val >= value;
    if (operator === "<=") return val <= value;
    return val === value;
  };
}

export function createSorter(field, order = "asc") {
  if (typeof field !== "string" || field.trim() === "") {
    throw new TypeError("createSorter: 'field' must be a non-empty string.");
  }

  if (!["asc", "desc"].includes(order)) {
    throw new TypeError("createSorter: 'order' must be 'asc' or 'desc'.");
  }

  const direction = order === "asc" ? 1 : -1;

  return function comparator(a, b) {
    if (
      typeof a !== "object" ||
      typeof b !== "object" ||
      a === null ||
      b === null
    ) {
      throw new TypeError("createSorter: Can only sort objects.");
    }

    const valA = a[field];
    const valB = b[field];

    // Handle undefined values
    if (valA === undefined && valB === undefined) return 0;
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;

    // Number comparison
    if (typeof valA === "number" && typeof valB === "number") {
      return (valA - valB) * direction;
    }

    // String comparison
    if (typeof valA === "string" && typeof valB === "string") {
      return valA.localeCompare(valB) * direction;
    }

    if (valA > valB) return 1 * direction;
    if (valA < valB) return -1 * direction;

    return 0;
  };
}

export function createMapper(fields) {
  if (!Array.isArray(fields)) return {};
  return function (obj) {
    if (typeof obj !== "object" || obj === null) return {};
    const result = {};
    for (const field of fields) {
      result[field] = obj[field];
    }
    return result;
  };
}

export function applyOperations(data, ...operations) {
  if (!Array.isArray(data)) return [];
  if (operations.length === 0) return [...data];
  const validOperations = operations.every((op) => {
    return typeof op === "function";
  });
  if (!validOperations) return [];

  return operations.reduce((currResult, fn) => {
    return fn(currResult);
  }, data);
}
