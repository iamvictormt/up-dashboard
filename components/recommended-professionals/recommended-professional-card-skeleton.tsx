import { Card, CardContent } from '@/components/ui/card';

export function RecommendedProfessionalCardSkeleton() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl shadow-sm">
      <CardContent className="p-6 animate-pulse">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#511A2B]/20" />

          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#511A2B]/20 rounded w-1/2" />
            <div className="h-3 bg-[#FEC460]/30 rounded w-1/3" />
            <div className="h-6 w-20 rounded-lg bg-gray-200 mt-2" />
          </div>
        </div>

        <div className="h-12 bg-[#511A2B]/10 rounded mb-4" />

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#511A2B]/20 rounded" />
              <div className="h-3 bg-[#511A2B]/20 rounded w-20" />
            </div>
            <div className="h-3 bg-[#511A2B]/20 rounded w-24" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#511A2B]/20 rounded" />
              <div className="h-3 bg-[#511A2B]/20 rounded w-28" />
            </div>
            <div className="h-3 bg-[#511A2B]/20 rounded w-24" />
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-[#511A2B]/10" />
          ))}
        </div>

        <div className="flex space-x-2">
          <div className="flex-1 h-10 rounded-xl bg-[#511A2B]/30" />
          <div className="h-10 w-24 rounded-xl bg-[#511A2B]/10" />
        </div>
      </CardContent>
    </Card>
  );
}
