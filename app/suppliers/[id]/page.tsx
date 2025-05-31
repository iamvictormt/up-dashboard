import { SupplierDetailContent } from '@/components/supplier-detail-content';

interface SupplierDetailPageProps {
  params: {
    id: string;
  };
}

export default function SupplierDetailPage({ params }: SupplierDetailPageProps) {
  return (
    <div className="min-h-screen bg-[#FFEDC1] w-full pt-20">
      <div className="p-6 md:p-8 w-full">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-[#511A2B]/10 shadow-lg w-full max-w-7xl mx-auto">
          <SupplierDetailContent supplierId={params.id} />
        </div>
      </div>
    </div>
  );
}
