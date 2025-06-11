import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function MyStoreContentSkeleton() {
  return (
    <div className="p-6 md:p-8 w-full">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full">
        {/* Floating Action Buttons Skeleton */}
        <div className="fixed top-32 right-8 md:right-16 z-50 flex flex-col space-y-3">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>

        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#511A2B] rounded-xl" />
          <div className="relative px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Logo Skeleton */}
                <div className="relative group">
                  <Skeleton className="w-40 h-40 rounded-3xl" />
                  <div className="absolute -top-2 -right-2">
                    <Skeleton className="w-20 h-6 rounded-full" />
                  </div>
                </div>

                {/* Informações Principais Skeleton */}
                <div className="flex-1 text-center lg:text-left text-white space-y-4">
                  <Skeleton className="h-12 w-80 bg-white/20" />
                  <Skeleton className="h-6 w-60 bg-white/20" />
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <Skeleton className="h-6 w-6 rounded bg-white/20" />
                    <Skeleton className="h-6 w-6 rounded bg-white/20" />
                    <Skeleton className="h-6 w-6 rounded bg-white/20" />
                    <Skeleton className="h-6 w-6 rounded bg-white/20" />
                    <Skeleton className="h-6 w-6 rounded bg-white/20" />
                    <Skeleton className="h-6 w-20 bg-white/20" />
                  </div>
                  <Skeleton className="h-20 w-full max-w-2xl bg-white/20" />
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Skeleton className="h-12 w-40 bg-white/20" />
                    <Skeleton className="h-12 w-48 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                  <CardContent className="p-6 text-center">
                    <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3" />
                    <Skeleton className="h-8 w-12 mx-auto mb-2" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Produtos Section Skeleton */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Eventos Section Skeleton */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="space-y-3 mb-6">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Informações da Loja Skeleton */}
            <section>
              <Skeleton className="h-8 w-48 mb-8" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="bg-white border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-px w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
