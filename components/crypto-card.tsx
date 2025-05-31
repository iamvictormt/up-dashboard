import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Bitcoin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CryptoCardProps {
  name: string
  symbol: string
  price: string
  change: string
  positive: boolean
  color: string
}

export function CryptoCard({ name, symbol, price, change, positive, color }: CryptoCardProps) {
  return (
    <Card className={`bg-gradient-to-br ${color} border-0 rounded-2xl`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Bitcoin className="w-5 h-5 text-white" />
          </div>
          <MoreHorizontal className="w-4 h-4 text-white/70" />
        </div>

        <div className="space-y-1">
          <div className="text-xs text-white font-medium">{name}</div>
          <div className="text-xs text-white/70">{symbol}</div>
        </div>

        {/* Mini Chart */}
        <div className="h-12 my-3">
          <svg className="w-full h-full" viewBox="0 0 100 40">
            <path d="M5,35 Q25,20 45,25 T85,15" stroke="white" strokeWidth="2" fill="none" opacity="0.8" />
          </svg>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-white text-sm">{price}</span>
          <Badge
            className={`${positive ? "bg-white/20 text-white" : "bg-red-500/20 text-red-200"} hover:bg-white/20 rounded-lg`}
          >
            {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
