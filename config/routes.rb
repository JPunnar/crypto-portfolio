Rails.application.routes.draw do
  root 'main#index'
  resources 'coins', only: [:index, :create, :destroy], defaults: { format: :json }
end
