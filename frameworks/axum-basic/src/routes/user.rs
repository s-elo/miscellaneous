use axum::{
  Router,
  routing::{get, post},
};

use crate::{
  handlers::user::{create_user_handler, get_all_users_handler},
  state::app::AppState,
};

pub fn user_routes() -> Router<AppState> {
  Router::new().nest(
    "/user",
    Router::new()
      .route("/create", post(create_user_handler))
      .route("/all", get(get_all_users_handler)),
  )
}
