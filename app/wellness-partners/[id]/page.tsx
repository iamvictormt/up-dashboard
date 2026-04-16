import { StoreContent } from '@/components/store/store-content';

interface WellnessPartnerDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WellnessPartnerDetailPage({ params }: WellnessPartnerDetailPageProps) {
  const { id } = await params;
  return <StoreContent supplierId={id} viewMode="wellness" />;
}
