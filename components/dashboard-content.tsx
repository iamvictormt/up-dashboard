"use client"

import { BalanceCard } from "@/components/balance-card"
import { FavouritesSection } from "@/components/favourites-section"
import { ChartSection } from "@/components/chart-section"
import { NewsSection } from "@/components/news-section"
import { AccountSummary } from "@/components/account-summary"
import { TradingInterface } from "@/components/trading-interface"

export function DashboardContent() {
  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="xl:col-span-8 space-y-4 md:space-y-6">
            <BalanceCard />
            <FavouritesSection />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <ChartSection />
              <NewsSection />
            </div>
          </div>

          {/* Right Column */}
          <div className="xl:col-span-4 space-y-4 md:space-y-6">
            <AccountSummary />
            <TradingInterface />
          </div>
        </div>
      </div>
    </div>
  )
}
