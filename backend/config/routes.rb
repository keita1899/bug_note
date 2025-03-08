Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "hello", to: "hello#index"
      mount_devise_token_auth_for "User", at: "auth"
      namespace :current do
        resource :user, only: [:show]
      end
      namespace :user do
        resource :confirmations, only: [:update]
      end
      resources :categories, only: [:index]
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
