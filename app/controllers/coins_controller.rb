class CoinsController < ApplicationController
  def index
    coins = Coin.calculate_all
    render json: { coins: coins }, methods: [:value]
  end

  def create
    coin = Coin.new(coin_params)
    if coin.valid?
      coin.save!
      render json: { coin: coin.as_json(methods: [:value]) }, status: :created and return
    else
      render json: { errors: coin.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    Coin.find(params[:id]).delete
    render json: { deleted: params[:id] }
  end

  private

  def coin_params
    params.permit(:type, :amount, :location, :purchased_at)
  end
end
