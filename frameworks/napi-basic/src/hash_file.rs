#![deny(clippy::all)]
use napi_derive::napi;
use napi::bindgen_prelude::*;
use sha2::{Sha256, Digest};
use std::fs;
use std::io::{BufReader, Read};

#[napi]
pub fn hash_file(file_path: String) -> String {
  let file = fs::read_to_string(file_path).unwrap();

  let mut hasher = Sha256::new();

  hasher.update(&file);

  // Finalize the hash and convert it to a hexadecimal string
  return format!("{:x}", hasher.finalize())
}
