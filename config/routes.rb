Rails.application.routes.draw do
  root 'main#index'
  resources 'coins', defaults: { format: :json }
end
