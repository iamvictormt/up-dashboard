export type DocumentType = 'CPF' | 'CNPJ';

export function documentLabel(type?: DocumentType | null): string {
  return type === 'CPF' ? 'CPF' : 'CNPJ';
}

export function nameLabel(type?: DocumentType | null): string {
  return type === 'CPF' ? 'Nome completo' : 'Razão social';
}

export function isValidDocument(type: DocumentType, value: string): boolean {
  const digits = (value ?? '').replace(/\D/g, '');
  return type === 'CPF' ? digits.length === 11 : digits.length === 14;
}
