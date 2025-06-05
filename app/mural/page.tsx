import { MuralContent } from '@/components/mural/mural-content';
import { CommunityProvider } from '@/contexts/community-context';

export default function MuralPage() {
  return (
    <div>
      <CommunityProvider>
        <MuralContent />
      </CommunityProvider>
    </div>
  );
}
