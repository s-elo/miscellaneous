use axum::extract::State;
use serde::Deserialize;

use crate::{
  responses::app::{ApiRes, AppError, AppJson},
  services::user::User,
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
  tracing::info!("create_user_handler: {}", params.name);
  let user = state.services.user_service.create_user(params.name)?;

  Ok(ApiRes::success(user))
}

pub async fn get_all_users_handler(
  State(state): State<AppState>,
) -> Result<ApiRes<Vec<User>>, AppError> {
  tracing::info!("get_all_users_handler");
  let users = state.services.user_service.get_all_users().await?;

  Ok(ApiRes::success(users))
}
