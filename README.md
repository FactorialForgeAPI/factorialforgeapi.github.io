# FactorialForgeAPI

## Description
FactorialForgeAPI is a library for calculating factorials of large numbers using parallelism and Stirling's approximation. It provides an efficient way to compute factorials for large values by leveraging Web Workers for parallel processing.

## Installation
1. Download the `FactorialForgeAPI.js` file.
2. Include it in your project.

## Usage
```javascript
(async () => {
  console.log(await FactorialForgeAPI.compute(100)); // Outputs the factorial of 100
  console.log(await FactorialForgeAPI.compute(1000)); // Outputs the factorial of 1000
})();