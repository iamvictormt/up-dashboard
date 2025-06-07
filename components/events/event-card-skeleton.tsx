import { Card, CardContent } from '@/components/ui/card';

export function EventCardSkeleton() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl transition-all duration-300 shadow-sm overflow-hidden animate-pulse">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-5 w-3/4 bg-[#511A2B]/20 rounded mb-2" />
            <div className="h-4 w-full bg-[#511A2B]/10 rounded mb-2" />
            <div className="h-4 w-2/3 bg-[#511A2B]/10 rounded" />
          </div>
          <div className="h-6 w-20 bg-[#FEC460]/30 rounded-lg ml-2" />
        </div>

        {/* Store Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#511A2B]/40 rounded-lg mr-3" />
            <div className="h-4 w-24 bg-[#511A2B]/10 rounded" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400/30 rounded-full mr-2" />
            <div className="h-4 w-6 bg-[#511A2B]/10 rounded" />
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#511A2B]/20 rounded mr-2" />
            <div className="h-4 w-16 bg-[#511A2B]/10 rounded" />
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#511A2B]/20 rounded mr-2" />
            <div className="h-4 w-12 bg-[#511A2B]/10 rounded" />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 bg-red-500/30 rounded mr-2" />
          <div className="h-4 w-32 bg-[#511A2B]/10 rounded" />
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#511A2B]/20 rounded mr-2" />
              <div className="h-4 w-24 bg-[#511A2B]/10 rounded" />
            </div>
            <div className="h-3 w-16 bg-gray-300 rounded" />
          </div>
          <div className="h-2 bg-gray-200 rounded-full w-full" />
        </div>

        {/* Points */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#FEC460]/50 rounded mr-2" />
            <div className="h-4 w-16 bg-[#511A2B]/10 rounded" />
          </div>
          <div className="h-5 w-20 bg-green-100 rounded-lg" />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-[#511A2B]/20 rounded-xl" />
          <div className="flex-1 h-10 bg-[#511A2B]/10 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
