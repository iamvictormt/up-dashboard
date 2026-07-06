// Mensagem padrão do link de WhatsApp quando o parceiro não cadastrou uma própria.
// Deixa claro que o contato partiu da plataforma.
export const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Encontrei seu contato pela plataforma UP Connection e gostaria de saber mais sobre seus serviços.';

export const buildWhatsAppUrl = (phone: string, message?: string | null) => {
  const digits = (phone || '').replace(/\D/g, '');
  const text = encodeURIComponent(message?.trim() || DEFAULT_WHATSAPP_MESSAGE);
  return `https://wa.me/${digits}?text=${text}`;
};
