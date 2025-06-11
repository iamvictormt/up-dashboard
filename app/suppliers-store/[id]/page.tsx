import { StoreContent } from '@/components/store/store-content';

interface SupplierDetailPageProps {
  params: {
    id: string;
  };
}

export default function SupplierDetailPage({ params }: SupplierDetailPageProps) {
  return (
    <>
      <StoreContent supplierId={params.id} />
    </>
  );
}
