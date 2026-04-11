import { Sparkles } from 'lucide-react';

interface ListingLoadingProps {
  message?: string;
}

export function ListingLoading({ message = 'Carregando informações...' }: ListingLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-[#511A2B]/70">
      <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#511A2B]/30 animate-spin" />
      <p className="text-lg animate-pulse">{message}</p>
    </div>
  );
}
