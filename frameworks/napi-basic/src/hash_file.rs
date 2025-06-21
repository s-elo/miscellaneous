#![deny(clippy::all)]
use napi_derive::napi;
use sha2::{Sha256, Digest};
use std::fs;

#[napi]
pub fn hash_file(file_path_or_content: String, is_content: Option<bool>) -> String {
  let file;

  let io_start_time = std::time::Instant::now();
  match is_content {
    Some(true) => file =  file_path_or_content,
    _ => file = fs::read_to_string(file_path_or_content).unwrap(),
  }
  let io_elapsed_time = io_start_time.elapsed();
  println!("Time taken to read the file: {:?}", io_elapsed_time);

  let start_time = std::time::Instant::now();
  let result = Sha256::digest(&file);
  let elapsed_time = start_time.elapsed();
  println!("Time taken to hash the file: {:?}", elapsed_time);

  let start_time = std::time::Instant::now();
  let result = format!("{:x}", result);
  let elapsed_time = start_time.elapsed();
  println!("Time taken to format the hash: {:?}", elapsed_time);
  return result;
}
