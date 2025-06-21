import { Bench } from 'tinybench';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { plus100, hashFile, fibonacci } from '../index.js';

function add(a: number) {
  return a + 100;
}

function calculateFileHashJS(filePath: string) {
  const data = readFileSync(filePath);
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

const b = new Bench();

b.add('Native a + 100', () => {
  plus100(10);
});

b.add('JavaScript a + 100', () => {
  add(10);
});

// const testFilePath = './test.txt';
// writeFileSync(testFilePath, Buffer.alloc(1024 * 1024 * 1));

// b.add('Native hash file', () => {
//   hashFile(testFilePath);
// });
// b.add('JavaScript hash file', () => {
//   calculateFileHashJS(testFilePath);
// });

b.add('Native fibonacci', () => {
  fibonacci(10);
});

b.add('JavaScript fibonacci', () => {
  fibonacciJs(10);
});

await b.run();

console.table(b.table());
