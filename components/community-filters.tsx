import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Users, Home, BookOpen, Clock, TrendingUp, Rss } from "lucide-react";
import React from "react";
import { iconMap } from "@/constants/appIcons";

interface CommunityFiltersProps {
  className?: string;
  selectedCommunity: Community | null;
  communities: Community[];
  sortBy: "recent" | "popular";
  handleCommunityFilter: (community: Community | null) => void;
  setSortBy: (sort: "recent" | "popular") => void;
}

export const CommunityFilters: React.FC<CommunityFiltersProps> = ({
  className = "",
  selectedCommunity,
  communities,
  sortBy,
  handleCommunityFilter,
  setSortBy,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#511A2B]" />
        <h3 className="font-semibold text-[#511A2B]">Filtrar por Comunidade</h3>
      </div>

      <Button
        variant={selectedCommunity === null ? "default" : "ghost"}
        className={cn(
          "w-full justify-start h-auto p-3 transition-all duration-200",
          selectedCommunity === null
            ? "bg-[#511A2B] hover:bg-[#511A2B]/90 text-white shadow-md"
            : "hover:bg-[#511A2B]/5 text-[#511A2B]/80 hover:text-[#511A2B]"
        )}
        onClick={() => handleCommunityFilter(null)}
      >
        <div className="flex items-center gap-3 w-full">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              selectedCommunity === null
                ? "bg-white/20"
                : "bg-gradient-to-br from-[#511A2B]/10 to-[#511A2B]/20"
            )}
          >
            <Users className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium">Todas as Comunidades</div>
            <div className="text-xs opacity-70">Publicações mais recentes</div>
          </div>
        </div>
      </Button>

      <div className="space-y-2">
        {communities.map((community) => {
          const Icon = iconMap[community.icon] || Home;
          const isSelected = selectedCommunity?.id === community.id;

          return (
            <Button
              key={community.id}
              variant={isSelected ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3 transition-all duration-200",
                isSelected
                  ? "text-white shadow-md"
                  : "hover:bg-[#511A2B]/5 text-[#511A2B]/80 hover:text-[#511A2B]"
              )}
              style={
                isSelected
                  ? { backgroundColor: community.color }
                  : {}
              }
              onClick={() => handleCommunityFilter(community)}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isSelected ? "bg-white/20" : "bg-white shadow-sm"
                  )}
                  style={
                    !isSelected
                      ? {
                          backgroundColor: `${community.color}15`,
                          color: community.color,
                        }
                      : {}
                  }
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{community.name}</div>
                  <div className="text-xs opacity-70 flex items-center gap-1">
                    <Rss className="w-3 h-3" />
                    {community.postsCount?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="border-t border-[#511A2B]/10 pt-4 space-y-2">
        <h4 className="text-sm font-medium text-[#511A2B]/70 mb-2">Ordenar por:</h4>
        <div className="flex flex-col gap-1">
          <Button
            variant={sortBy === "recent" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "justify-start h-8 text-sm",
              sortBy === "recent"
                ? "bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                : "hover:bg-[#511A2B]/5 text-[#511A2B]/70 hover:text-[#511A2B]"
            )}
            onClick={() => setSortBy("recent")}
          >
            <Clock className="w-4 h-4 mr-2" />
            Mais Recentes
          </Button>
          <Button
            variant={sortBy === "popular" ? "default" : "ghost"}
            size="sm"
            className={cn(
              "justify-start h-8 text-sm",
              sortBy === "popular"
                ? "bg-[#511A2B] hover:bg-[#511A2B]/90 text-white"
                : "hover:bg-[#511A2B]/5 text-[#511A2B]/70 hover:text-[#511A2B]"
            )}
            onClick={() => setSortBy("popular")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Mais Populares
          </Button>
        </div>
      </div>
    </div>
  );
};
