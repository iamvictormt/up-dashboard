import { DollarSign, TrendingUp, Bitcoin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AccountSummary() {
  return (
    <div className="space-y-4">
      <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-[#511A2B]/70" />
              <span className="text-sm text-[#511A2B] font-medium">Cash</span>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-lg border-green-200">+2.5%</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-[#511A2B]/70" />
              <span className="text-sm text-[#511A2B] font-medium">Investment</span>
            </div>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-lg border-green-200">+12.4%</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#D56235] to-[#511A2B] border-0 rounded-2xl shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <Bitcoin className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-white font-medium">Crypto</span>
            </div>
            <Badge className="bg-red-100/20 text-red-200 hover:bg-red-100/20 rounded-lg border-red-200/20">
              -24.2%
            </Badge>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white">
            $54,560<span className="text-white/70">.00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
