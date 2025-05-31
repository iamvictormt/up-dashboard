import { CryptoCard } from "@/components/crypto-card"
import { Button } from "@/components/ui/button"

const cryptoData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: "$19,384",
    change: "+1.4%",
    positive: true,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Ripple",
    symbol: "XRP",
    price: "$0.3754",
    change: "+8.3%",
    positive: true,
    color: "from-yellow-400 to-orange-400",
  },
  {
    name: "Binance Coin",
    symbol: "BNB",
    price: "$271.45",
    change: "-1.2%",
    positive: false,
    color: "from-orange-400 to-red-400",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: "$1357.80",
    change: "+1.4%",
    positive: true,
    color: "from-green-400 to-emerald-500",
  },
]

export function FavouritesSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Favourites</h2>
        <Button variant="ghost" className="text-sm text-gray-400 hover:text-white">
          See All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cryptoData.map((crypto, index) => (
          <CryptoCard key={index} {...crypto} />
        ))}
      </div>
    </div>
  )
}
