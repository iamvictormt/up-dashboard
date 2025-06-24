'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Shield } from 'lucide-react';

export type LegalType = 'terms' | 'privacy' | null;

interface LegalModalProps {
  openType: LegalType;
  onClose: () => void;
}

export function LegalModal({ openType, onClose }: LegalModalProps) {
  const isOpen = openType !== null;
  const isTerms = openType === 'terms';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isTerms ? 'bg-purple-100' : 'bg-blue-100'
              }`}
            >
              {isTerms ? (
                <FileText className="w-5 h-5 text-purple-600" />
              ) : (
                <Shield className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                {isTerms ? 'Termos de Uso' : 'Política de Privacidade'}
              </DialogTitle>
              <p className="text-sm text-slate-600 mt-1">Última atualização: Junho de 2025</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="prose prose-slate max-w-none max-h-[60vh] overflow-auto">
            {isTerms ? <TermosContent /> : <PrivacidadeContent />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function TermosContent() {
  return (
    <>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Aceitação dos Termos</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Ao acessar e usar nossa plataforma, você concorda em cumprir e estar vinculado a estes Termos de Uso.
          Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
        </p>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Descrição dos Serviços</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Nossa plataforma conecta profissionais do setor de eventos e decoração com clientes, fornecendo um
          marketplace digital para serviços especializados.
        </p>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>Conexão entre profissionais e clientes</li>
          <li>Sistema de avaliações e reviews</li>
          <li>Ferramentas de comunicação integradas</li>
          <li>Gestão de projetos e orçamentos</li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Responsabilidades do Usuário</h3>
        <p className="text-slate-700 leading-relaxed mb-4">Como usuário da plataforma, você se compromete a:</p>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>Fornecer informações verdadeiras e atualizadas</li>
          <li>Manter a confidencialidade de suas credenciais</li>
          <li>Usar a plataforma de forma ética e legal</li>
          <li>Respeitar outros usuários e profissionais</li>
          <li>Não violar direitos de propriedade intelectual</li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">4. Propriedade Intelectual</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio,
          downloads digitais e software, é propriedade nossa ou de nossos licenciadores e está protegido por
          leis de direitos autorais.
        </p>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">5. Limitações de Responsabilidade</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Nossa plataforma atua como intermediária entre profissionais e clientes. Não somos responsáveis pela
          qualidade dos serviços prestados pelos profissionais cadastrados, nem por disputas entre as partes.
        </p>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">6. Modificações e Rescisão</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
          imediatamente após a publicação. Podemos também suspender ou encerrar sua conta por violação destes
          termos.
        </p>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">7. Contato</h3>
        <p className="text-slate-700 leading-relaxed">
          Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do email:
          <span className="font-medium text-purple-600"> upconnection01@gmail.com</span>
        </p>
      </section>
    </>
  );
}

function PrivacidadeContent() {
  return (
    <>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">1. Informações que Coletamos</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Coletamos informações que você nos fornece diretamente e informações coletadas automaticamente quando
          você usa nossos serviços.
        </p>
        <div className="mb-4">
          <h4 className="font-medium text-slate-900 mb-2">Informações Fornecidas por Você:</h4>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li>Nome, email e informações de contato</li>
            <li>Informações de perfil profissional</li>
            <li>Conteúdo que você publica na plataforma</li>
            <li>Comunicações conosco</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-slate-900 mb-2">Informações Coletadas Automaticamente:</h4>
          <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
            <li>Informações de uso da plataforma</li>
            <li>Dados de localização (quando permitido)</li>
            <li>Informações do dispositivo e navegador</li>
            <li>Cookies e tecnologias similares</li>
          </ul>
        </div>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">2. Como Usamos Suas Informações</h3>
        <p className="text-slate-700 leading-relaxed mb-4">Utilizamos suas informações para:</p>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>Fornecer e melhorar nossos serviços</li>
          <li>Facilitar conexões entre profissionais e clientes</li>
          <li>Personalizar sua experiência na plataforma</li>
          <li>Enviar comunicações importantes e atualizações</li>
          <li>Garantir a segurança da plataforma</li>
          <li>Cumprir obrigações legais</li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">3. Compartilhamento de Informações</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Não vendemos suas informações pessoais. Podemos compartilhar suas informações nas seguintes situações:
        </p>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>Com outros usuários conforme necessário para o serviço</li>
          <li>Com prestadores de serviços terceirizados</li>
          <li>Para cumprir obrigações legais</li>
          <li>Para proteger nossos direitos e segurança</li>
          <li>Com seu consentimento explícito</li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">4. Segurança dos Dados</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas
          informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
        </p>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>Criptografia de dados em trânsito e em repouso</li>
          <li>Controles de acesso rigorosos</li>
          <li>Monitoramento contínuo de segurança</li>
          <li>Auditorias regulares de segurança</li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">5. Seus Direitos</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Você tem os seguintes direitos em relação às suas informações pessoais:
        </p>
        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
          <li>Acessar suas informações pessoais</li>
          <li>Corrigir informações imprecisas</li>
          <li>Solicitar a exclusão de suas informações</li>
          <li>Restringir o processamento de seus dados</li>
          <li>Portabilidade de dados</li>
          <li>Retirar consentimento a qualquer momento</li>
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">6. Cookies e Tecnologias Similares</h3>
        <p className="text-slate-700 leading-relaxed mb-4">
          Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma
          e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do
          seu navegador.
        </p>
      </section>
    </>
  );
}
