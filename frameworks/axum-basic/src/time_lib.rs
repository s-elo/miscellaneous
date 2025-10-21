// Imagine this is some third party library that we're using. It sometimes returns errors which we
// want to log.

use std::sync::atomic::{AtomicU64, Ordering};

use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct Timestamp(u64);

impl Timestamp {
  // pub fn new(value: u64) -> Self {
  //     Self(value)
  // }

  pub fn now() -> Result<Self, Error> {
    static COUNTER: AtomicU64 = AtomicU64::new(0);

    // Fail on every third call just to simulate errors
    if COUNTER.fetch_add(1, Ordering::SeqCst).is_multiple_of(3) {
      Err(Error::FailedToGetTime)
    } else {
      Ok(Self(1337))
    }
  }
}

#[derive(Debug, Clone)]
pub enum Error {
  FailedToGetTime,
}

impl std::fmt::Display for Error {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    write!(f, "failed to get time")
  }
}
