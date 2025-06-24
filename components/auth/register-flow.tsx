'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressIndicator } from './progress-indicator';
import { UserTypeStep } from './register-steps/user-type-step';
import { PersonalInfoStep } from './register-steps/person-info-step';
import { AddressStep } from './register-steps/address-setp';
import { CredentialsStep } from './register-steps/credentials-step';
import { saveUser } from '@/lib/user-api';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

type UserType = 'love-decorations' | 'professionals' | 'partner-suppliers';
type Step = 'user-type' | 'personal-info' | 'address' | 'credentials';

interface RegisterFlowProps {
  onSuccess: () => void;
}

export function RegisterFlow({ onSuccess }: RegisterFlowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    photo: null as string | null,
    acceptedTerms: false,

    // Address
    address: {
      zipCode: '',
      state: '',
      city: '',
      district: '',
      street: '',
      number: '',
      complement: '',
    },

    // Love Decoration
    loveDecoration: {
      name: '',
      contact: '',
      instagram: '',
      tiktok: '',
    },

    // Professional
    professional: {
      name: '',
      officeName: '',
      professionId: '',
      document: '',
      generalRegister: '',
      registrationAgency: '',
      phone: '',
    },

    // Partner Supplier
    partnerSupplier: {
      tradeName: '',
      companyName: '',
      document: '',
      stateRegistration: '',
      contact: '',
    },
  });

  const getInitialStep = (param: string | null): Step => {
    return param ? 'personal-info' : 'user-type';
  };
  const getTypeFromParam = (param: string | null): UserType => {
    switch (param) {
      case 'professional':
        return 'professionals';
      case 'partner-supplier':
        return 'partner-suppliers';
      case 'love-decoration':
        return 'love-decorations';
      default:
        return 'love-decorations';
    }
  };
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const [currentStep, setCurrentStep] = useState<Step>(getInitialStep(typeParam));
  const [userType, setUserType] = useState<UserType>(getTypeFromParam(typeParam));
  const steps: Step[] = ['user-type', 'personal-info', 'address', 'credentials'];
  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    handleNext();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedFormData = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const payload: any = {
        user: {
          email: formData.email,
          password: formData.password,
          profileImage: formData.photo,
          address: formData.address,
        },
      };

      if (userType === 'partner-suppliers') {
        payload.partnerSupplier = formData.partnerSupplier;
      } else if (userType === 'professionals') {
        payload.professional = formData.professional;
      } else if (userType === 'love-decorations') {
        payload.loveDecoration = formData.loveDecoration;
      }

      await saveUser(payload, userType);
      onSuccess();
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'user-type':
        return 'Escolha seu perfil';
      case 'personal-info':
        return 'Informações pessoais';
      case 'address':
        return 'Endereço';
      case 'credentials':
        return 'Credenciais de acesso';
      default:
        return '';
    }
  };

  const getProgressSteps = () => {
    return typeParam ? steps.length - 1 : steps.length;
  };

  const getProgressCurrent = () => {
    return typeParam ? currentStepIndex : currentStepIndex + 1;
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator
        steps={getProgressSteps()}
        currentStep={getProgressCurrent()}
        title={getStepTitle()}
        userType={userType}
      />

      <AnimatePresence mode="wait">
        {currentStep === 'user-type' && (
          <motion.div
            key="user-type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UserTypeStep selectedType={userType} onSelect={handleUserTypeSelect} />
          </motion.div>
        )}

        {currentStep === 'personal-info' && (
          <motion.div
            key="personal-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PersonalInfoStep
              userType={userType}
              formData={formData}
              onUpdate={updateFormData}
              onUpdateNested={updateNestedFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {currentStep === 'address' && (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AddressStep formData={formData} onUpdate={updateNestedFormData} onNext={handleNext} onBack={handleBack} />
          </motion.div>
        )}

        {currentStep === 'credentials' && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CredentialsStep
              formData={formData}
              onUpdate={updateFormData}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
