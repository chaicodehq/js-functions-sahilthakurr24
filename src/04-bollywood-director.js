/**
 * 🎬 Bollywood Scene Director - Factory Functions
 *
 * Bollywood ka script generator bana! Factory functions use karo — matlab
 * aise functions jo DOOSRE functions return karte hain. Pehle configuration
 * do, phir ek specialized function milega jo kaam karega.
 *
 * Functions:
 *
 *   1. createDialogueWriter(genre)
 *      - Factory: returns a function (hero, villain) => string
 *      - Genres and their dialogue templates:
 *        "action"  => `${hero} says: 'Tujhe toh main dekh lunga, ${villain}!'`
 *        "romance" => `${hero} whispers: '${villain}, tum mere liye sab kuch ho'`
 *        "comedy"  => `${hero} laughs: '${villain} bhai, kya kar rahe ho yaar!'`
 *        "drama"   => `${hero} cries: '${villain}, tune mera sab kuch cheen liya!'`
 *      - Unknown genre => return null (not a function, just null)
 *      - Returned function: if hero or villain empty/missing, return "..."
 *
 *   2. createTicketPricer(basePrice)
 *      - Factory: returns a function (seatType, isWeekend = false) => price
 *      - Seat multipliers: silver=1, gold=1.5, platinum=2
 *      - Agar isWeekend, multiply final price by 1.3 (30% extra)
 *      - Round to nearest integer
 *      - Unknown seatType in returned fn => return null
 *      - Agar basePrice not positive number => return null (not a function)
 *
 *   3. createRatingCalculator(weights)
 *      - Factory: returns a function (scores) => weighted average
 *      - weights: { story: 0.3, acting: 0.3, direction: 0.2, music: 0.2 }
 *      - scores: { story: 8, acting: 9, direction: 7, music: 8 }
 *      - Weighted avg = sum of (score * weight) for matching keys
 *      - Round to 1 decimal place
 *      - Agar weights not an object => return null
 *
 * Hint: A factory function RETURNS another function. The returned function
 *   "remembers" the parameters of the outer function (this is a closure!).
 *
 * @example
 *   const actionWriter = createDialogueWriter("action");
 *   actionWriter("Shah Rukh", "Raees")
 *   // => "Shah Rukh says: 'Tujhe toh main dekh lunga, Raees!'"
 *
 *   const pricer = createTicketPricer(200);
 *   pricer("gold", true)  // => 200 * 1.5 * 1.3 = 390
 */
export function createDialogueWriter(genre) {
  const validGenre = new Set(["action", "romance", "comedy", "drama"]);
  if (!validGenre.has(genre.trim())) return null;

  return function (hero, villain) {
    if (
      typeof hero !== "string" ||
      typeof villain !== "string" ||
      hero === "" ||
      villain === ""
    )
      return "...";

    if (genre === "action") {
      return `${hero} says: 'Tujhe toh main dekh lunga, ${villain}!'`;
    } else if (genre === "romance") {
      return `${hero} whispers: '${villain}, tum mere liye sab kuch ho'`;
    } else if (genre === "comedy") {
      return `${hero} laughs: '${villain} bhai, kya kar rahe ho yaar!'`;
    } else {
      return `${hero} cries: '${villain}, tune mera sab kuch cheen liya!'`;
    }
  };
}

export function createTicketPricer(basePrice) {
  if (typeof basePrice !== "number" || basePrice <=0 ) return null;
  return function (seatMultpliers, isWeekend = false) {
    if (typeof seatMultpliers !== "string") return null;
    const validSeatMultiplier = new Set(["gold", "silver", "platinum"]);
    if (!validSeatMultiplier.has(seatMultpliers.trim())) return null;
    let price = basePrice;
    if (seatMultpliers === "gold") {
      price *= 1.5;
      if (isWeekend) {
        price *= 1.3;
      }
    } else if (seatMultpliers === "silver") {
      price *= 1;
      if (isWeekend) {
        price *= 1.3;
      }
    } else {
      price *= 2;
      if (isWeekend) {
        price *= 1.3;
      }
    }
    const finalPrice = Math.round(price);
    return finalPrice;
  };
}

export function createRatingCalculator(weights) {
  if (typeof weights !== "object" || weights === null) {
    return null;
  }
  return function (scores) {
    let total = 0;

    for (let key in weights) {
      if (scores.hasOwnProperty(key)) {
        total += scores[key] * weights[key];
      }
    }

    return Number(total.toFixed(1));
  };
}
