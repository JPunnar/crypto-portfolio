class BitfinexFetcher
  URLS = %W[
    https://api-pub.bitfinex.com/v2/tickers?symbols=tBTCEUR
    https://api-pub.bitfinex.com/v2/tickers?symbols=tETHEUR
    https://api-pub.bitfinex.com/v2/tickers?symbols=tXRPUSD
  ]
  def get_rates
    {
      Bitcoin: get_rate('BTCEUR'),
      Ethereum: get_rate('ETHEUR'),
      Ripple: get_rate('XRPUSD')
    }
  end

  def get_rate(type)
    JSON.parse(HTTParty.get("https://api-pub.bitfinex.com/v2/tickers?symbols=t#{type}").body).first.second
  end
end
