import { ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function BalanceCard() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#511A2B]/70 uppercase tracking-wide font-medium">Total Balance</span>
        </div>
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl md:text-4xl font-bold text-[#511A2B]">
            $124,410<span className="text-[#511A2B]/60">.00</span>
          </h1>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-lg border-green-200">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            +1.4%
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
