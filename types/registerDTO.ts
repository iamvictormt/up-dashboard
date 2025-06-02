import { ProfessionalData } from './professional';
import { PartnerSupplierData } from './partnerSupplier';
import { LoveDecorationData } from './loveDecoration';
import { AddressData } from './address';

export interface RegisterDTO {
  user: {
    email: string;
    password: string;
    profileImage: string;
    address: AddressData;
  };
  professional?: Omit<ProfessionalData, 'email' | 'password' | 'confirmPassword'>;
  partnerSupplier?: Omit<PartnerSupplierData, 'email' | 'password' | 'confirmPassword'>;
  loveDecoration?: Omit<LoveDecorationData, 'email' | 'password' | 'confirmPassword'>;
}
