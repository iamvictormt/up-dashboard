import { MuralContent } from '@/components/mural/mural-content';
import { CommunityProvider } from '@/contexts/community-context';

export default function MuralPage() {
  return (
    <div className="min-h-screen bg-[#FFEDC1] w-full pt-20">
      <CommunityProvider>
        <MuralContent />
      </CommunityProvider>
    </div>
  );
}
