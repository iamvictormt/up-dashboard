import { Card, CardContent } from '@/components/ui/card';

export function SupplierCardSkeleton() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#511A2B]/10 rounded-2xl overflow-hidden h-[580px] flex flex-col animate-pulse">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Header Section */}
        <div className="relative bg-[#511A2B] p-6 h-[110px] flex-shrink-0">
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-[#FEC460] px-4 py-1 rounded-lg w-14 h-6" />

          <div className="flex items-start space-x-3 h-full">
            <div className="w-12 h-12 bg-white/20 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-white/30 rounded w-3/4" />
              <div className="h-3 bg-white/30 rounded w-1/2" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Description */}
          <div className="h-[48px] mb-4 space-y-2">
            <div className="h-3 bg-[#511A2B]/20 rounded w-full" />
            <div className="h-3 bg-[#511A2B]/20 rounded w-5/6" />
          </div>

          {/* Opening Hours */}
          <div className="flex items-center space-x-2 mb-4 h-[20px]">
            <div className="w-4 h-4 bg-green-100 rounded-full" />
            <div className="h-3 bg-[#511A2B]/20 rounded w-1/3" />
          </div>

          {/* Produtos */}
          <div className="mb-4 h-[120px] flex flex-col justify-between">
            <div className="h-4 bg-[#511A2B]/20 rounded w-1/2 mb-2" />
            <div className="flex gap-2 mb-2">
              <div className="h-5 w-24 bg-[#FEC460]/30 rounded-lg" />
              <div className="h-5 w-24 bg-red-200 rounded-lg" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <div className="h-3 bg-[#511A2B]/10 rounded w-2/3" />
                <div className="h-3 bg-[#511A2B]/20 rounded w-1/4" />
              </div>
              <div className="flex justify-between text-xs">
                <div className="h-3 bg-[#511A2B]/10 rounded w-2/3" />
                <div className="h-3 bg-[#511A2B]/20 rounded w-1/4" />
              </div>
            </div>
          </div>

          {/* Evento */}
          <div className="mb-4 h-[120px] flex flex-col">
            <div className="p-3 bg-gray-100 rounded-xl h-full space-y-2">
              <div className="h-4 bg-[#511A2B]/10 rounded w-1/2" />
              <div className="h-3 bg-[#511A2B]/10 rounded w-3/4" />
              <div className="h-3 bg-[#511A2B]/10 rounded w-1/3" />
              <div className="flex justify-between">
                <div className="h-3 bg-[#511A2B]/10 rounded w-1/4" />
                <div className="h-3 bg-[#FEC460]/40 rounded w-1/4" />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-2 mt-auto">
            <div className="h-10 bg-[#511A2B]/20 rounded-xl flex-1" />
            <div className="h-10 w-10 bg-[#511A2B]/10 rounded-xl" />
            <div className="h-10 w-10 bg-[#511A2B]/5 rounded-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
