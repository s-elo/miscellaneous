#![deny(clippy::all)]

use napi_derive::napi;
pub mod hash_file;

#[napi]
pub fn plus_100(input: u32) -> u32 {
  input + 100
}

#[napi]
pub fn fibonacci(input: u32) -> u32 {
  match input {
    0 => 0,
    1 => 1,
    _ => fibonacci(input - 1) + fibonacci(input - 2),
  }
}
