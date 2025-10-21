use axum::{
  Router,
  extract::{MatchedPath, Request},
  middleware::from_fn,
  routing::IntoMakeService,
};
use tower_http::trace::TraceLayer;

use crate::{middlewares::logs::log_app_errors, routes::user::user_routes};

pub fn init_routes() -> IntoMakeService<Router> {
  let app = Router::new()
    // A dummy route that accepts some JSON but sometimes fails
    .merge(user_routes())
    .layer(
      TraceLayer::new_for_http()
        // Create our own span for the request and include the matched path. The matched
        // path is useful for figuring out which handler the request was routed to.
        .make_span_with(|req: &Request| {
          let method = req.method();
          let uri = req.uri();

          // axum automatically adds this extension.
          let matched_path = req
            .extensions()
            .get::<MatchedPath>()
            .map(|matched_path| matched_path.as_str());

          tracing::debug_span!("request", %method, %uri, matched_path)
        })
        // By default `TraceLayer` will log 5xx responses but we're doing our specific
        // logging of errors so disable that
        .on_failure(()),
    )
    .layer(from_fn(log_app_errors));

  app.into_make_service()
}
