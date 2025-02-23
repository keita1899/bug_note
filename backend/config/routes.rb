Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "hello", to: "hello#index"
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
