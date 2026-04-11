import { Search, Info } from 'lucide-react';
import { ReactNode } from 'react';

interface ListingEmptyProps {
  icon?: ReactNode;
  title: string;
  description: string;
  isSearch?: boolean;
}

export function ListingEmpty({
  icon,
  title,
  description,
  isSearch = false
}: ListingEmptyProps) {
  const DefaultIcon = isSearch ? Search : Info;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-[#511A2B]/5 p-6 rounded-full mb-6">
        {icon || <DefaultIcon className="h-12 w-12 text-[#511A2B]/30" />}
      </div>
      <h3 className="text-[#511A2B] text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[#511A2B]/60 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
