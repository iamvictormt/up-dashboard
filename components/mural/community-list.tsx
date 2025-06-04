"use client"

import { useCommunity } from "@/contexts/community-context"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function CommunityList() {
  const { communities, selectedCommunity, selectCommunity } = useCommunity()
  
  const getIconByName = (iconName: string): LucideIcon => {
    const icon = (LucideIcons as Record<string, LucideIcon>)[iconName]
    return icon || LucideIcons.Hash
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 px-2">Comunidades</h2>
      <ScrollArea className="h-[calc(80vh-180px)]">
        <div className="space-y-1 pr-2">
          {communities.map((community) => {
            const Icon = getIconByName(community.icon)
            const isSelected = selectedCommunity?.id === community.id

            return (
              <button
                key={community.id}
                onClick={() => selectCommunity(community)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                  isSelected ? "bg-gray-100 font-medium" : "hover:bg-gray-50",
                )}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${community.color}20`, color: community.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="truncate">{community.name}</span>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
