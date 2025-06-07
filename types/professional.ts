import { UserData } from './user';

export interface ProfessionalData extends UserData {
  name: string;
  officeName: string;
  professionId: string;
  document: string;
  generalRegister: string;
  registrationAgency: string;
  phone: string;
}
