import { Card, CardContent } from '@/components/ui/card';

export function WorkshopCardSkeleton() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl transition-all duration-300 shadow-sm overflow-hidden">
      <CardContent className="p-6 animate-pulse space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-[#511A2B]/20 rounded w-3/4" />
            <div className="h-4 bg-[#511A2B]/10 rounded w-full" />
            <div className="h-4 bg-[#511A2B]/10 rounded w-5/6" />
          </div>
          <div className="w-20 h-6 bg-[#FEC460]/30 rounded-lg ml-2" />
        </div>

        {/* Store Info Skeleton */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#511A2B]/30 rounded-lg mr-3" />
          <div className="h-4 bg-[#511A2B]/20 rounded w-1/2" />
        </div>

        {/* Date and Time Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#511A2B]/20 rounded" />
            <div className="h-4 bg-[#511A2B]/10 rounded w-20" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#511A2B]/20 rounded" />
            <div className="h-4 bg-[#511A2B]/10 rounded w-16" />
          </div>
        </div>

        {/* Location Skeleton */}
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-300 rounded mr-2" />
          <div className="h-4 bg-[#511A2B]/10 rounded w-1/2" />
        </div>

        {/* Progress Skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#511A2B]/20 rounded" />
              <div className="h-4 bg-[#511A2B]/10 rounded w-32" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="h-2 bg-gray-300 rounded w-full" />
        </div>

        {/* Points and Status Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#FEC460]/40 rounded" />
            <div className="h-4 bg-[#511A2B]/10 rounded w-20" />
          </div>
          <div className="w-20 h-6 bg-red-200 rounded-lg" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-[#511A2B]/20 rounded-xl" />
          <div className="flex-1 h-10 bg-[#511A2B]/10 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
