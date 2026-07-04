import { applyDocumentMask, applyDocumentCnpjMask } from './masks';

export type DocumentType = 'CPF' | 'CNPJ';

export function isValidDocument(type: DocumentType, value: string): boolean {
  const digits = (value ?? '').replace(/\D/g, '');
  return type === 'CNPJ' ? digits.length === 14 : digits.length === 11;
}

export function applyDocumentMaskByType(type: DocumentType, value: string): string {
  return type === 'CNPJ' ? applyDocumentCnpjMask(value) : applyDocumentMask(value);
}

export function documentPlaceholder(type: DocumentType): string {
  return type === 'CNPJ' ? '00.000.000/0000-00' : '000.000.000-00';
}
