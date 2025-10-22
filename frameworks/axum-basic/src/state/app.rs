use crate::services::user::UserService;

#[derive(Default, Clone)]
pub struct Services {
  pub user_service: UserService,
}

#[derive(Default, Clone)]
pub struct AppState {
  pub services: Services,
}
