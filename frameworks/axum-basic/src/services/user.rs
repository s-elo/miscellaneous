use std::sync::atomic::Ordering;

use serde::Serialize;

use crate::{responses::app::AppError, state::app::AppState, time_lib::Timestamp};

#[derive(Serialize, Clone)]
pub struct User {
  pub id: u64,
  pub name: String,
  pub created_at: Timestamp,
}

pub fn create_user(state: &AppState, name: String) -> Result<User, AppError> {
  let id = state.next_id.fetch_add(1, Ordering::SeqCst);

  // We have implemented `From<time_library::Error> for AppError` which allows us to use `?` to
  // automatically convert the error
  let created_at = Timestamp::now()?;

  Ok(User {
    id,
    name,
    created_at,
  })
}

pub async fn get_all_users(state: &AppState) -> Result<Vec<User>, anyhow::Error> {
  let users = state.users.lock().unwrap().values().cloned().collect();

  // change the file name to test error
  let file_content = tokio::fs::read_to_string("test.txt").await?;

  println!("file_content: {}", file_content);

  Ok(users)
}
