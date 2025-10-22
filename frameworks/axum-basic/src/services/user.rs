use std::sync::{Arc, atomic::Ordering};

use serde::Serialize;

use crate::{responses::app::AppError, time_lib::Timestamp};

use std::{
  collections::HashMap,
  sync::{Mutex, atomic::AtomicU64},
};

#[derive(Serialize, Clone)]
pub struct User {
  pub id: u64,
  pub name: String,
  pub created_at: Timestamp,
}

#[derive(Clone, Default)]
pub struct UserService {
  next_id: Arc<AtomicU64>,
  users: Arc<Mutex<HashMap<u64, User>>>,
}

impl UserService {
  pub fn create_user(self, name: String) -> Result<User, AppError> {
    let id = self.next_id.fetch_add(1, Ordering::SeqCst);

    // We have implemented `From<time_library::Error> for AppError` which allows us to use `?` to
    // automatically convert the error
    let created_at = Timestamp::now()?;

    let user = User {
      id,
      name,
      created_at,
    };

    self.users.lock().unwrap().insert(id, user.clone());

    Ok(user)
  }

  pub async fn get_all_users(self) -> Result<Vec<User>, anyhow::Error> {
    let users = self.users.lock().unwrap().values().cloned().collect();

    // change the file name to test error
    let file_content = tokio::fs::read_to_string("test.txt").await?;

    println!("file_content: {}", file_content);

    Ok(users)
  }
}
