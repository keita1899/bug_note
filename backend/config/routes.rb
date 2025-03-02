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
      namespace :tech_stack do
        resources :operation_systems, only: [:index, :show]
        resources :programming_languages, only: [:index, :show]
        resources :frameworks, only: [:index, :show]
        resources :databases, only: [:index, :show]
        resources :platforms, only: [:index, :show]
        resources :tools, only: [:index, :show]
        resources :editors, only: [:index, :show]
        resources :browsers, only: [:index, :show]
        resources :virtual_machines, only: [:index, :show]
        resources :middlewares, only: [:index, :show]
      end
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
