import { AddressData } from './address';
import { UserData } from './user';

export interface PartnerSupplierData extends UserData {
  tradeName: string;
  companyName: string;
  document: string;
  stateRegistration: string;
  address: AddressData;
  contact: string;
  profileImage: string;
}
