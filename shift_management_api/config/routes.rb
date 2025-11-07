Rails.application.routes.draw do
  namespace :api do
    resources :shifts
  end
end
