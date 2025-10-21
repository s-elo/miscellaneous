use axum::extract::State;
use serde::Deserialize;

use crate::{
  responses::app::{AppError, AppJson},
  services::user::{User, create_user},
  state::app::AppState,
};

#[derive(Deserialize)]
pub struct UserParams {
  name: String,
}

pub async fn create_user_handler(
  State(state): State<AppState>,
  // Make sure to use our own JSON extractor so we get input errors formatted in a way that
  // matches our application
  AppJson(params): AppJson<UserParams>,
) -> Result<AppJson<User>, AppError> {
  let user = create_user(&state, params.name)?;

  state.users.lock().unwrap().insert(user.id, user.clone());

  Ok(AppJson(user))
}
