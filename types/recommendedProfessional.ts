export interface RecommendedProfessionalData {
  id: string;
  name: string;
  profession: string;
  description: string;
  phone: string;
  email: string;
  profileImage: string;
  address: {
    state: string;
    city: string;
    district: string;
    street: string;
    complement?: string;
    number: string;
    zipCode: string;
  };
  socialMedia: {
    linkedin?: string;
    instagram?: string;
    whatsapp: string;
  };
  availableDays: {
    dayOfWeek: string;
  }[];
  isActive: boolean;
}
