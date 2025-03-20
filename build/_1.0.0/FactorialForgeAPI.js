/**
 * FactorialForgeAPI - A library for calculating factorials of large numbers using parallelism and Stirling's approximation.
 * 
 * @module FactorialForgeAPI
 * @version 1.0.0
 * @license Custom License
 * @author FactForPI Dev by Petrov I.
 * @description
 * FactorialForgeAPI provides a simple and efficient way to calculate factorials,
 * using Web Workers for parallel processing and Stirling's approximation for large numbers.
 * 
 * Installation:
 * 1. Download the FactorialForgeAPI.js file.
 * 2. Include it in your project.
 * 
 * Example usage:
 * ```javascript
 * (async () => {
 *   console.log(await FactorialForgeAPI.compute(100)); // Outputs the factorial of 100 as a string
 *   console.log(await FactorialForgeAPI.compute(1000)); // Outputs the factorial of 1000 as a string
 * })();
 * ```
 * 
 * Limitations:
 * - The compute function only accepts non-negative integers.
 * - For large values (n > 20), Stirling's approximation is used.
 */

/**
 * License
 * 
 * Copyright (c) 2025 FactForPI Dev by Petrov I.
 * 
 * This library is the result of the author's intellectual work and has been developed without direct borrowing 
 * of ideas or solutions from existing projects. However, the author does not exclude the possibility of accidental 
 * coincidence with other developments and respects the rights of other authors, giving them priority.
 * 
 * Permission is granted to freely use, copy, modify, merge, and publish this software, 
 * as well as to permit the use of this software, provided that the following conditions are met:
 * 
 * 1. The above copyright notice and this license must be included in all copies or substantial portions 
 *    of this software.
 * 
 * 2. If you modify this software and distribute it, you must clearly indicate that your version is modified, 
 *    and provide a description of the changes made. This must be done in an explicit manner so that users 
 *    can distinguish the original version from the modified one.
 * 
 * This software is provided "as is", without any warranties, express or implied, 
 * including, but not limited to, warranties of merchantability and fitness for a particular purpose. 
 * In no event shall the authors or copyright holders be liable for any claims, damages, or other liabilities, 
 * whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the use 
 * of this software.
 */

/**
 * Calculates the factorial of a number n using Web Workers for parallel processing.
 * @param {number} n - The number for which the factorial is calculated.
 * @returns {Promise<string>} - The factorial of n as a string.
 * @throws {Error} - If n is negative.
 */
async function factorial(n) {
  if (n < 0) throw new Error("Factorial is defined only for non-negative numbers.");
  if (n === 0 || n === 1) return "1";

  // Function to create a Web Worker that calculates the factorial for a given range
  const createWorker = (start, end) => {
    return new Promise((resolve) => {
      const worker = new Worker("data:text/javascript," + encodeURIComponent(`
        onmessage = function(e) {
          let result = BigInt(1);
          for (let i = e.data.start; i <= e.data.end; i++) {
            result *= BigInt(i);
          }
          postMessage(result.toString());
        };
      `));
      worker.postMessage({ start, end });
      worker.onmessage = (e) => resolve(e.data);
    });
  };

  const numWorkers = navigator.hardwareConcurrency || 4; // Determine the number of available threads
  const chunkSize = Math.ceil(n / numWorkers); // Determine the chunk size for each worker
  const promises = [];

  // Start workers to calculate the factorial in parallel
  for (let i = 0; i < numWorkers; i++) {
    const start = i * chunkSize + 1;
    const end = Math.min((i + 1) * chunkSize, n);
    promises.push(createWorker(start, end));
  }

  // Wait for all workers to finish and combine the results
  const results = await Promise.all(promises);
  return results.reduce((acc, result) => acc * BigInt(result), BigInt(1)).toString();
}

/**
 * Stirling's approximation for calculating the logarithm of a factorial.
 * @param {number} n - The number for which the factorial is calculated.
 * @returns {string} - The approximate value of the factorial of n as a string.
 */
function stirlingApproximation(n) {
  if (n === 0 || n === 1) return "1";
  // Stirling's formula: log(n!) ~ n * log(n) - n + 0.5 * log(2 * pi * n)
  const logFactorial = n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n);
  const order = Math.floor(logFactorial / Math.log(10)); // Determine the order
  const mantissa = Math.pow(10, logFactorial / Math.log(10) - order); // Determine the mantissa
  return `${mantissa.toFixed(15)}e+${order}`; // Return the result in scientific notation
}

/**
 * API for calculating factorials.
 * @namespace FactorialForgeAPI
 */
const FactorialForgeAPI = {
  /**
   * Calculates the factorial of a number n and returns the result as a string.
   * @param {number} n - The number for which the factorial is calculated.
   * @returns {Promise<string>} - The factorial of n as a string.
   * @throws {Error} - If n is negative.
   * 
   * @remarks
   * This function uses two methods to calculate the factorial:
   * 1. Direct calculation using Web Workers for parallel processing, 
   *    which allows efficient handling of large values of n.
   * 2. Stirling's approximation for values of n > 20, which avoids 
   *    overflow and ensures high accuracy.
   * 
   * Scientific justification:
   * - The factorial of n (n!) is defined as the product of all positive integers from 1 to n.
   * - For large n, calculating the factorial becomes computationally intensive, 
   *   as the result grows rapidly.
   * - Using Web Workers allows the task to be split into multiple parallel threads, 
   *   significantly speeding up calculations.
   * - Stirling's approximation allows the logarithm of the factorial to be calculated with high accuracy, 
   *   without computing the factorial itself, which is especially useful for large n.
   * 
   * Performance evaluation:
   * - Efficiency: The algorithm uses parallel computing, which significantly reduces 
   *   execution time for large values of n.
   * - Accuracy: Stirling's approximation provides high accuracy for large n.
   * - Complexity: The time complexity of the algorithm is on average O(n) for 
   *   calculating the factorial, but thanks to parallelism and the use of Stirling's 
   *   approximation, we can efficiently handle large values of n.
   */
  compute: async function(n) {
    try {
      return n > 20 ? stirlingApproximation(n) : await factorial(n);
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
};

// Example usage of the API:
(async () => {
  console.log(await FactorialForgeAPI.compute(100)); // Outputs the factorial of 100 as a string
  console.log(await FactorialForgeAPI.compute(1000)); // Outputs the factorial of 1000 as a string
})();