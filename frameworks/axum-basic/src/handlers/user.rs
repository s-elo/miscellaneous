use axum::extract::State;
use serde::Deserialize;

use crate::{
  responses::app::{ApiRes, AppError, AppJson},
  services::user::{User, create_user, get_all_users},
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
) -> Result<ApiRes<User>, AppError> {
  let user = create_user(&state, params.name)?;

  state.users.lock().unwrap().insert(user.id, user.clone());

  Ok(ApiRes::success(user))
}

pub async fn get_all_users_handler(
  State(state): State<AppState>,
) -> Result<ApiRes<Vec<User>>, AppError> {
  let users = get_all_users(&state).await?;

  Ok(ApiRes::success(users))
}
