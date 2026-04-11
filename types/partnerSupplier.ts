import { UserData } from './user';

export type PartnerSupplierType = 'SUPPLIER' | 'WELLNESS';

export interface PartnerSupplierData extends UserData {
  tradeName: string;
  companyName: string;
  document: string;
  stateRegistration: string;
  contact: string;
  type: PartnerSupplierType;
  isVerified: boolean;
}
