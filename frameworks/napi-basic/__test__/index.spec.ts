import test from 'ava';

import { plus100, hashFile, fibonacci } from '../index';

test('sync function from native code', (t) => {
  const fixture = 42;
  t.is(plus100(fixture), fixture + 100);
});

test('hash file', (t) => {
  const file_path = './__test__/test.txt';
  t.is(
    hashFile(file_path),
    'a0a1673915a4531733f1c3e664f118fe355ca36cfc5f89108a48e9212fdb4c01',
  );
});

test('fibonacci', (t) => {
  t.is(fibonacci(20), 6765);
});
