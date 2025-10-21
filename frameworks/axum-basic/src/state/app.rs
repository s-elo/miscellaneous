use crate::services::user::User;

use std::{
  collections::HashMap,
  sync::{Arc, Mutex, atomic::AtomicU64},
};

#[derive(Default, Clone)]
pub struct AppState {
  pub next_id: Arc<AtomicU64>,
  pub users: Arc<Mutex<HashMap<u64, User>>>,
}
