import { ArrowUpRight, Bitcoin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TradingInterface() {
  return (
    <Card className="bg-gradient-to-br from-[#FEC460]/30 to-[#D56235]/30 backdrop-blur-sm border border-[#FEC460]/30 rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <div className="flex space-x-2 mb-6">
          <Button className="flex-1 bg-[#FEC460] hover:bg-[#FEC460]/90 text-[#511A2B] font-semibold rounded-xl">
            Buy
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-[#511A2B]/30 text-[#511A2B] hover:bg-[#511A2B]/10 rounded-xl"
          >
            Sell
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#511A2B]/70 uppercase font-medium">You Send</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FEC460] to-[#D56235] rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">BNB</span>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-[#511A2B]">100.00</div>
                <div className="text-xs text-[#511A2B]/60">Balance: 124,955 BNB</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/80 border border-[#511A2B]/20 hover:bg-white/90"
            >
              <ArrowUpRight className="w-4 h-4 rotate-90 text-[#511A2B]" />
            </Button>
          </div>

          <div className="bg-white/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#511A2B]/70 uppercase font-medium">You Get</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D56235] to-[#511A2B] rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-[#511A2B]">1.40</div>
                <div className="text-xs text-[#511A2B]/60">Balance: 0.684 BTC</div>
              </div>
            </div>
          </div>

          <Button className="w-full bg-[#511A2B] hover:bg-[#511A2B]/90 text-white font-semibold rounded-xl py-3">
            Buy BNB
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
