// import { Bench } from 'tinybench';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { plus100, hashFile, fibonacci } from '../index.js';

function add(a: number) {
  return a + 100;
}

function calculateFileHashJS(filePath: string, isContent = false) {
  const data = isContent ? filePath : readFileSync(filePath);
  return createHash('sha256').update(data).digest('hex');
}

function fibonacciJs(n: number): number {
  if (n <= 1) return n;
  let a = 0,
    b = 1,
    temp;
  for (let i = 2; i <= n; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

const testFilePath = './__test__/test.txt';

// const b = new Bench();

// b.add('Native a + 100', () => {
//   plus100(10);
// });

// b.add('JavaScript a + 100', () => {
//   add(10);
// });

// b.add('Native hash file', () => {
//   hashFile(testFilePath);
// });
// b.add('JavaScript hash file', () => {
//   calculateFileHashJS(testFilePath);
// });

// b.add('Native fibonacci', () => {
//   fibonacci(10);
// });

// b.add('JavaScript fibonacci', () => {
//   fibonacciJs(10);
// });

// await b.run();

// console.table(b.table());

// eslint-disable-next-line @typescript-eslint/ban-types
async function runTask(fn: Function, taskName = fn.name) {
  const start = performance.now();
  await fn();
  const end = performance.now();
  console.log(`${taskName} execution time: ${(end - start).toFixed(2)} ms`);
}

console.log('Running benchmarks...');
await runTask(() => plus100(10), 'Native a + 100');
await runTask(() => add(10), 'JavaScript a + 100');
console.log(' ');
await runTask(() => hashFile(testFilePath), 'Native hash file');
await runTask(() => calculateFileHashJS(testFilePath), 'JavaScript hash file');
console.log(' ');
const testContent = readFileSync(testFilePath, 'utf-8');
const stringContent = testContent.repeat(10000); // Repeat to increase size
// The hash process is not slow, but the finished time is way slower than js?
await runTask(
  () => hashFile(stringContent, true),
  'Native hash file without io',
);
await runTask(
  () => calculateFileHashJS(stringContent, true),
  'JavaScript hash file without io',
);
console.log(' ');
await runTask(() => fibonacci(10000), 'Native Fibonacci');
await runTask(() => fibonacciJs(10000), 'JavaScript Fibonacci');
