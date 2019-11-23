class BitfinexFetcher
  URL = 'https://api-pub.bitfinex.com/v2/tickers?symbols=t'

  def get_rates
    {
      Bitcoin: get_rate('BTCEUR'),
      Ethereum: get_rate('ETHEUR'),
      Ripple: get_rate('XRPUSD')
    }
  end

  def get_rate(type)
    JSON.parse(HTTParty.get(URL + type).body).first.second
  end
end
