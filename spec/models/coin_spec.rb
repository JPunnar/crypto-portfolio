require "rails_helper"

RSpec.describe "coin" do
  it "does dafault validations" do
    coin = Coin.new
    coin.valid?
    expect(coin.errors.full_messages).to include(
      "Type can't be blank",
      "Type is not included in the list",
      "Amount can't be blank",
      "Amount is not a number",
      "Location can't be blank",
      "Purchased at can't be blank"
    )
  end

  it 'checks that purchase date is not in future' do
    coin = Coin.new(purchased_at: Date.today + 1.day)
    coin.valid?
    expect(coin.errors.full_messages).to include(
      "Purchased at can't be in future"
    )
  end

  describe "value calculation" do
    before do
      allow_any_instance_of(BitfinexFetcher)
        .to receive(:get_rates).and_return({Bitcoin: 6556.5, Ethereum: 136.15, Ripple: 0.2304})
    end

    it 'calculates value after saving' do
      coin = Coin.new(type: 'Ethereum', amount: 2.5, location: 'random', purchased_at: Date.today)
      expect(coin.value).to be_nil
      coin.save
      expect(coin.value).not_to be_nil
      expect(coin.value).to eq(340.375)
    end
  end
end
