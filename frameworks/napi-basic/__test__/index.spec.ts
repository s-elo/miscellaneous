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
    'a50d9908d8ed6bec25458d0a62d4b3f3c7cf2a72199904fc5c4b25f7f1b8fe14',
  );
});

test('fibonacci', (t) => {
  t.is(fibonacci(20), 6765);
});
