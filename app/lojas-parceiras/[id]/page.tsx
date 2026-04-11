import { StoreContent } from '@/components/store/store-content';

interface SupplierDetailPageProps {
  params: {
    id: string;
  };
}

export default async function SupplierDetailPage({ params }: SupplierDetailPageProps) {
  return <StoreContent supplierId={params.id} />;
}
