"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ChartSection() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24H")

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FEC460] to-[#D56235] rounded-xl flex items-center justify-center">
              <span className="font-bold text-white">D</span>
            </div>
            <div>
              <div className="font-semibold text-[#511A2B]">Dash</div>
              <div className="text-sm text-[#511A2B]/60">$40.66</div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-lg border-green-200">
            <ArrowUpRight className="w-3 h-3 mr-1" />
            +0.24%
          </Badge>
        </div>

        <div className="mb-4">
          <span className="text-2xl font-bold text-[#511A2B]">$39.34</span>
        </div>

        {/* Chart */}
        <div className="h-32 mb-4">
          <svg className="w-full h-full" viewBox="0 0 300 100">
            <path d="M10,80 Q50,60 90,70 T170,50 Q210,40 250,30 T290,20" stroke="#FEC460" strokeWidth="2" fill="none" />
            <circle cx="290" cy="20" r="4" fill="#FEC460" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {["24H", "1W", "1Y", "CY", "All"].map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? "default" : "ghost"}
              size="sm"
              className={`rounded-lg ${
                selectedTimeframe === period
                  ? "bg-[#511A2B] hover:bg-[#511A2B]/80 text-white"
                  : "text-[#511A2B]/70 hover:text-[#511A2B] hover:bg-[#511A2B]/10"
              }`}
              onClick={() => setSelectedTimeframe(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
