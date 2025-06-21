#![deny(clippy::all)]

use napi_derive::napi;
pub mod hash_file;

#[napi]
pub fn plus_100(input: u32) -> u32 {
  input + 100
}

#[napi]
pub fn fibonacci(n: u32) -> u32 {
  // match input {
  //   0 => 0,
  //   1 => 1,
  //   _ => fibonacci(input - 1) + fibonacci(input - 2),
  // }
  if n < 1 {
    return n;
  }

  let mut a = 0;
  let mut b = 1;
  let mut temp;
  for _ in 1..n {
    temp = a + b;
    a = b;
    b = temp;
  }

  return b;
}
