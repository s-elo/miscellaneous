use std::sync::Arc;

use axum::{
  extract::{FromRequest, rejection::JsonRejection},
  http::StatusCode,
  response::{IntoResponse, Response},
};
use serde::Serialize;

use crate::time_lib;

// Create our own JSON extractor by wrapping `axum::Json`. This makes it easy to override the
// rejection and provide our own which formats errors to match our application.
//
// `axum::Json` responds with plain text if the input is invalid.
#[derive(FromRequest)]
#[from_request(via(axum::Json), rejection(AppError))]
pub struct AppJson<T>(pub T);

impl<T> IntoResponse for AppJson<T>
where
  axum::Json<T>: IntoResponse,
{
  fn into_response(self) -> Response {
    axum::Json(self.0).into_response()
  }
}

// The kinds of errors we can hit in our application.
#[derive(Debug)]
pub enum AppError {
  // The request body contained invalid JSON
  JsonRejection(JsonRejection),
  // Some error from a third party library we're using
  TimeError(time_lib::Error),
}

// Tell axum how `AppError` should be converted into a response.
impl IntoResponse for AppError {
  fn into_response(self) -> Response {
    // How we want errors responses to be serialized
    #[derive(Serialize)]
    struct ErrorResponse {
      message: String,
    }

    let (status, message, err) = match &self {
      AppError::JsonRejection(rejection) => {
        // This error is caused by bad user input so don't log it
        (rejection.status(), rejection.body_text(), None)
      }
      AppError::TimeError(_err) => {
        // While we could simply log the error here we would introduce
        // a side-effect to our conversion, instead add the AppError to
        // the Response as an Extension
        // Don't expose any details about the error to the client
        (
          StatusCode::INTERNAL_SERVER_ERROR,
          "Something went wrong".to_owned(),
          Some(self),
        )
      }
    };

    let mut response = (status, AppJson(ErrorResponse { message })).into_response();
    if let Some(err) = err {
      // Insert our error into the response, our logging middleware will use this.
      // By wrapping the error in an Arc we can use it as an Extension regardless of any inner types not deriving Clone.
      response.extensions_mut().insert(Arc::new(err));
    }
    response
  }
}

impl From<JsonRejection> for AppError {
  fn from(rejection: JsonRejection) -> Self {
    Self::JsonRejection(rejection)
  }
}

impl From<time_lib::Error> for AppError {
  fn from(error: time_lib::Error) -> Self {
    Self::TimeError(error)
  }
}
