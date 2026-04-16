import { StoreContent } from '@/components/store/store-content';

interface WellnessPartnerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WellnessPartnerDetailPage({ params }: WellnessPartnerDetailPageProps) {
  return <StoreContent supplierId={params.id} viewMode="wellness" />;
}
