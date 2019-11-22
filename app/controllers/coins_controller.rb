class CoinsController < ApplicationController

  def index
    # binding.pry
    render json: { coins: Coin.all }
  end

  def create
    # binding.pry
    coin = Coin.new(coin_params)
    if coin.valid?
      coin.save!
      render json: { coin: coin.as_json }, status: :created and return
    else
      render json: { errors: coin.errors.full_messages }
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
