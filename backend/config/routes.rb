Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "hello", to: "hello#index"
      mount_devise_token_auth_for "User", at: "auth"
      namespace :current do
        resource :user, only: [:show]
      end
      resources :users, only: [:show] do
        member do
          get :bugs, to: "users#bugs"
          post :follow, to: "follows#create"
          delete :unfollow, to: "follows#destroy"
        end
      end
      namespace :user do
        resource :confirmations, only: [:update]
      end
      resources :categories, only: [:index]
      resources :bugs, only: [:index, :show, :create, :update, :destroy] do
        post "likes", to: "likes#create"
        delete "likes", to: "likes#destroy"
        resources :comments, only: [:create, :destroy]
      end
      namespace :mypage do
        resources :bugs, only: [:index] do
          collection do
            get "solved", to: "bugs#solved"
            get "unsolved", to: "bugs#unsolved"
            get "published", to: "bugs#published"
            get "draft", to: "bugs#draft"
          end
        end
      end
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
