Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "hello", to: "hello#index"
      mount_devise_token_auth_for "User", at: "auth"
      namespace :user do
        resource :confirmations, only: [:update]
      end
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
