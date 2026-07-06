// Mensagem padrão do link de WhatsApp quando o parceiro não cadastrou uma própria.
// Deixa claro que o contato partiu da plataforma.
const BASE = 'Olá! Encontrei seu contato pela plataforma UP Connection e gostaria de saber mais';
export const DEFAULT_WHATSAPP_MESSAGE_WELLNESS = `${BASE} sobre seus serviços.`;
export const DEFAULT_WHATSAPP_MESSAGE_STORE = `${BASE} sobre seus produtos.`;

export const buildWhatsAppUrl = (
  phone: string,
  message: string | null | undefined,
  fallback: string,
) => {
  const digits = (phone || '').replace(/\D/g, '');
  const text = encodeURIComponent(message?.trim() || fallback);
  return `https://wa.me/${digits}?text=${text}`;
};
