# FactorialForgeAPI

## Description
FactorialForgeAPI is a JavaScript library for calculating factorials of large numbers using parallel computing and Stirling's approximation. It leverages Web Workers for efficient parallel processing and provides:
- **Exact results** for small values of \( n \) (using direct computation).
- **Approximate results** for large values of \( n \) (using Stirling's approximation).

This makes it a powerful tool for both precise calculations and quick estimations in mathematical, statistical, and scientific applications.

## Installation
1. Download the `FactorialForgeAPI.js` file.
2. Include it in your project.

## Usage
```javascript
(async () => {
  console.log(await FactorialForgeAPI.compute(100)); // Outputs the factorial of 100
  console.log(await FactorialForgeAPI.compute(1000)); // Outputs the factorial of 1000
})();