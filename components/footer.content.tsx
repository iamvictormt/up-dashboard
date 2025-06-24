import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { LegalModal } from './auth/register-steps/legal-modal';
import { useState } from 'react';

export function FooterContent() {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="bg-white/60 backdrop-blur-sm border border-[#511A2B]/10 shadow-lg py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-[#511A2B]/70">
            © {new Date().getFullYear()} UP Connection. Todos os direitos reservados.
          </div>

          <div className="flex items-center space-x-6">
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/updesigners_e_arquitetos/#"
                target="_blank"
                className="text-[#511A2B]/70 hover:text-[#511A2B] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>

            {/* Legal Links */}
            <LegalModal openType={modalType} onClose={() => setModalType(null)} />
            <div className="flex space-x-6 text-sm text-[#511A2B]/70">
              <a
                onClick={() => setModalType('terms')}
                className="hover:text-[#511A2B] transition-colors cursor-pointer"
              >
                Termos de Uso
              </a>
              <a
                onClick={() => setModalType('privacy')}
                className="hover:text-[#511A2B] transition-colors cursor-pointer"
              >
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
