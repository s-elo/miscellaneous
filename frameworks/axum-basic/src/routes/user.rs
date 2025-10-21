use axum::{Router, routing::post};

use crate::{handlers::user::create_user_handler, state::app::AppState};

pub fn user_routes() -> Router {
  Router::new()
    .nest(
      "/user",
      Router::new().route("/create", post(create_user_handler)),
    )
    .with_state(AppState::default())
}
