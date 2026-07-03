import { UserData } from './user';

export type PartnerSupplierType = 'SUPPLIER' | 'WELLNESS';
export type DocumentType = 'CPF' | 'CNPJ';

export interface PartnerSupplierData extends UserData {
  tradeName: string;
  companyName: string;
  document: string;
  documentType: DocumentType;
  stateRegistration: string;
  contact: string;
  type: PartnerSupplierType;
  isVerified: boolean;
}
