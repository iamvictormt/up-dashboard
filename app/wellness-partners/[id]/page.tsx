import { WellnessDetailContent } from "@/components/wellness-partners/details/wellness-detail-content";

interface WellnessDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WellnessDetailPage({ params }: WellnessDetailPageProps) {
  return <WellnessDetailContent supplierId={params.id} />;
}
