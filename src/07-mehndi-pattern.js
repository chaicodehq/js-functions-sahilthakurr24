/**
 * 🎨 Mehndi Pattern Maker - Recursion
 *
 * Mehndi artist hai tu! Intricate patterns banane hain using RECURSION.
 * Yahan loops use karna MANA hai — sirf function khud ko call karega
 * (recursive calls). Har function mein base case aur recursive case hoga.
 *
 * Functions:
 *
 *   1. repeatChar(char, n)
 *      - Repeat char n times using recursion (NO loops, NO .repeat())
 *      - Base case: n <= 0 => return ""
 *      - Recursive: char + repeatChar(char, n - 1)
 *      - Agar char not a string or empty, return ""
 *
 *   2. sumNestedArray(arr)
 *      - Sum all numbers in an arbitrarily nested array
 *      - e.g., [1, [2, [3, 4]], 5] => 15
 *      - Skip non-number values
 *      - Base case: empty array => 0
 *      - Agar input not array, return 0
 *
 *   3. flattenArray(arr)
 *      - Flatten an arbitrarily nested array into a single flat array
 *      - e.g., [1, [2, [3, 4]], 5] => [1, 2, 3, 4, 5]
 *      - Agar input not array, return []
 *
 *   4. isPalindrome(str)
 *      - Check if string is palindrome using recursion
 *      - Case-insensitive comparison
 *      - Base case: string length <= 1 => true
 *      - Compare first and last chars, recurse on middle
 *      - Agar input not string, return false
 *
 *   5. generatePattern(n)
 *      - Generate symmetric mehndi border pattern
 *      - n = 1 => ["*"]
 *      - n = 2 => ["*", "**", "*"]
 *      - n = 3 => ["*", "**", "***", "**", "*"]
 *      - Pattern goes from 1 star up to n stars, then back down to 1
 *      - Use recursion to build the ascending part, then mirror it
 *      - Agar n <= 0, return []
 *      - Agar n is not a positive integer, return []
 *
 * Hint: Every recursive function needs a BASE CASE (when to stop) and a
 *   RECURSIVE CASE (calling itself with a smaller/simpler input).
 *
 * @example
 *   repeatChar("*", 4)        // => "****"
 *   sumNestedArray([1, [2, [3]]]) // => 6
 *   flattenArray([1, [2, [3]]]) // => [1, 2, 3]
 *   isPalindrome("madam")     // => true
 *   generatePattern(3)        // => ["*", "**", "***", "**", "*"]
 */
export function repeatChar(char, n) {
  if (n <= 0 || typeof char !== "string" || char === "") return "";
  const result = char + repeatChar(char, n - 1);
  return result;
}

export function sumNestedArray(arr) {
  if (!Array.isArray(arr)) return 0;
  if (arr.length === 0) return 0;
  let total = 0;
  if (Array.isArray(arr[0])) {
    total += sumNestedArray(arr[0]);
  } else {
    if(!isNaN(arr[0])){
      total += arr[0];
   }
  }
  arr.shift();

  total += sumNestedArray(arr);
  return total;
}

export function flattenArray(arr) {
  if (!Array.isArray(arr)) return [];
  if (arr.length === 0) return [];

  let result = [];
  if (Array.isArray(arr[0])) {
    result = result.concat(flattenArray(arr[0]));
  } else {
   result.push(arr[0]);
  }
  arr.shift();

  return result.concat(flattenArray(arr));
}

export function isPalindrome(str) {
  if(typeof str !== "string" ) return false;
  if(str === "" || str.length === 1) return true;
  let start = 0;
  let end = str.length - 1;
  while (start < end) {
    if (str[start].toLowerCase() != str[end].toLowerCase()) return false;
    start++;
    end--;
  }

  return true;
}

function helper(n, count) {
  if (count === n) return["*".repeat(n)];
  let result = [];
  let pattern = "*".repeat(count);
  result.push(pattern);
  result = result.concat(helper(n, count + 1));
  if(count < n){
    result.push(pattern);
  }
  return result;
}
export function generatePattern(n) {
  if (n <= 0 || !Number.isInteger(n)) return [];
  let count = 1;
  return helper(n, count);
}
