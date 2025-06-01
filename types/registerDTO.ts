import { ProfessionalData } from './professional';
import { PartnerSupplierData } from './partnerSupplier';

export interface RegisterDTO {
  user: {
    email: string;
    password: string;
  };
  professional?: Omit<ProfessionalData, 'email' | 'password' | 'confirmPassword'>;
  partnerSupplier?: Omit<PartnerSupplierData, 'email' | 'password' | 'confirmPassword'>;
}
