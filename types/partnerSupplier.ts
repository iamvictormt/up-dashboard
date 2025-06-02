import { UserData } from './user';

export interface PartnerSupplierData extends UserData {
  tradeName: string;
  companyName: string;
  document: string;
  stateRegistration: string;
  contact: string;
}
