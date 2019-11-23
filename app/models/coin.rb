class Coin < ApplicationRecord
  self.inheritance_column = nil
  attr_accessor :value

  TYPES = %w[Bitcoin Ethereum Ripple]

  validates :type, :amount, :location, :purchased_at, presence: true
  validates :amount, numericality: { greater_than: 0, less_than_or_equal_to: 10_000 }
  validates :type, inclusion: { in: TYPES }
  validates :location, length: { maximum: 250 }
  validate :puchased_at_not_in_future

  after_save do |coin|
    market_rates = BitfinexFetcher.new.get_rates
    coin.value = coin.amount * market_rates[coin.type.to_sym]
  end

  def self.calculate_all
    return if count.zero?
    market_rates = BitfinexFetcher.new.get_rates
    Coin.all.each do |coin|
      coin.value = coin.amount * market_rates[coin.type.to_sym]
    end
  end

  private

  def puchased_at_not_in_future
    errors.add(:purchased_at, "can't be in future") if purchased_at&.future?
  end
end
