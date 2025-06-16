'use client';

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import type React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/components/ui/use-mobile';
import { ForgotPasswordModal } from './forgot-password-modal';
import { LoginHeader } from './login-header';
import { LoginSidebar } from './login-sidebar';
import { LoginForm } from './login-form';
import { UserTypeSelector } from './user-type-selector';
import { LoveDecorationForm } from './register-forms/love-decoration-form';
import { ProfessionalForm } from './register-forms/profession-form';
import { PartnerSupplierForm } from './register-forms/partner-supplier-form';
import { applyDocumentCnpjMask, applyDocumentMask, applyPhoneMask } from '@/utils/masks';
import type { Profession, RegisterDTO } from '@/types';
import { isProfessional, isPartnerSupplier, isLoveDecoration } from '@/utils/typeGuards';
import Cookies from 'js-cookie';
import { appUrl } from '@/constants/appRoutes';
import { fetchProfessions } from '@/lib/professions-api';
import { saveUser, uploadImageCloudinary } from '@/lib/user-api';

type RegisterType = 'love-decorations' | 'professionals' | 'partner-suppliers';
type RegisterStep = 'select-type' | 'fill-form';

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState('login');
  const [registerType, setRegisterType] = useState<RegisterType>('love-decorations');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('select-type');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Data states
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Form data states
  const [loveDecorationData, setLoveDecorationData] = useState({
    name: '',
    contact: '',
    email: '',
    tiktok: '',
    instagram: '',
    password: '',
    confirmPassword: '',
  });

  const [professionalData, setProfessionalData] = useState({
    name: '',
    officeName: '',
    professionId: '',
    document: '',
    generalRegister: '',
    registrationAgency: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [partnerSupplierData, setPartnerSupplierData] = useState({
    tradeName: '',
    companyName: '',
    document: '',
    stateRegistration: '',
    contact: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [addressData, setAddressData] = useState({
    state: '',
    city: '',
    district: '',
    street: '',
    complement: '',
    number: '',
    zipCode: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    senha: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeSelection = (type: RegisterType) => {
    setRegisterType(type);
    setRegisterStep('fill-form');
  };

  const handleBackToTypeSelection = () => {
    setRegisterStep('select-type');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      const img = new window.Image();

      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          alert('Could not process the image');
          URL.revokeObjectURL(imageUrl);
          return;
        }

        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        canvas.width = size;
        canvas.height = size;

        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        setPhoto(dataUrl);

        URL.revokeObjectURL(imageUrl);
      };

      img.onerror = () => {
        alert('Error loading the image');
        URL.revokeObjectURL(imageUrl);
      };
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Load professions
  async function loadProfessions() {
    try {
      const response = await fetchProfessions();
      setProfessions(response);
    } catch (err) {
      toast.error('Erro ao carregar as profissões, contate o administrador');
      console.error(err);
    }
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (loginError) setLoginError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.senha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) toast.error(errorData.message || 'Email ou senha inválidos');
        if (response.status === 403) toast.info(errorData.message);
        return;
      }

      const data = await response.json();
      Cookies.set('token', data.access_token, { expires: 1 / 24 });
      Cookies.set('role', JSON.stringify(data.role), { expires: 1 / 24 });
      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        window.location.href = appUrl.mural;
      }, 2000);
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error('Erro de indisponibilidade, contate o administrador.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle form changes
  const handleLoveDecorationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contact') {
      setLoveDecorationData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else {
      setLoveDecorationData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setProfessionalData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else if (name === 'document') {
      setProfessionalData((prev) => ({ ...prev, [name]: applyDocumentMask(value) }));
    } else {
      setProfessionalData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePartnerSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'contact') {
      setPartnerSupplierData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else if (name === 'document') {
      setPartnerSupplierData((prev) => ({ ...prev, [name]: applyDocumentCnpjMask(value) }));
    } else {
      setPartnerSupplierData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessionalSelectChange = (value: string) => {
    setProfessionalData((prev) => ({ ...prev, professionId: value }));
  };

  // Build address helper
  const buildAddress = (address: any) => ({
    city: address.city,
    complement: address.complement,
    district: address.district,
    number: address.number,
    state: address.state,
    street: address.street,
    zipCode: address.zipCode,
  });

  // Handle register submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);

    const data =
      registerType === 'professionals'
        ? professionalData
        : registerType === 'partner-suppliers'
        ? partnerSupplierData
        : loveDecorationData;

    if (data.password !== data.confirmPassword) {
      toast.error('As senhas não coincidem.');
      setIsRegisterLoading(false);
      return;
    }

    const uploadedImageUrl = photo ? await uploadImageCloudinary(photo) : null;

    const payload: RegisterDTO = {
      user: {
        email: data.email,
        password: data.password,
        profileImage: uploadedImageUrl || '',
        address: buildAddress(addressData),
      },
    };

    if (isProfessional(data)) {
      payload.professional = {
        name: data.name,
        officeName: data.officeName,
        document: data.document,
        generalRegister: data.generalRegister,
        registrationAgency: data.registrationAgency,
        phone: data.phone,
        professionId: data.professionId,
      };
    } else if (isPartnerSupplier(data)) {
      payload.partnerSupplier = {
        tradeName: data.tradeName,
        companyName: data.companyName,
        document: data.document,
        stateRegistration: data.stateRegistration,
        contact: data.contact,
      };
    } else if (isLoveDecoration(data)) {
      payload.loveDecoration = {
        name: data.name,
        contact: data.contact,
        tiktok: data.tiktok,
        instagram: data.instagram,
      };
    } else {
      toast.error('Tipo de cadastro inválido.');
      setIsRegisterLoading(false);
      return;
    }

    try {
      const response = await saveUser(payload, registerType);

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Erro no cadastro.');
      }

      toast.success('Cadastro realizado com sucesso! Redirecionando para o login...');
      setRegisterSuccess(true);

      setTimeout(() => {
        setActiveTab('login');
        setRegisterSuccess(false);
        setLoginData((prev) => ({ ...prev, email: data.email }));
        setRegisterStep('select-type');
      }, 2000);
    } catch (err: any) {
      toast.error(err.response.data.message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // Fetch address by ZIP code
  const fetchAddressByZipCode = async (zipCode: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
      const data = await res.json();
      if (data.erro) return null;

      return {
        street: data.logradouro,
        district: data.bairro,
        city: data.localidade,
        state: data.uf,
      };
    } catch (err) {
      console.error('Erro ao buscar endereço:', err);
      return null;
    }
  };

  useEffect(() => {
    setMounted(true);
    loadProfessions();
  }, []);

  useEffect(() => {
    const zip = addressData.zipCode.replace(/\D/g, '');

    if (zip.length === 8) {
      const fetchAddress = async () => {
        const address = await fetchAddressByZipCode(zip);
        if (address) {
          setAddressData((prev) => ({
            ...prev,
            ...address,
            zipCode: prev.zipCode,
          }));
        }
      };

      fetchAddress();
    }
  }, [addressData.zipCode]);

  useEffect(() => {
    removePhoto();
  }, [registerType]);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.warning('Seu token expirou. Você foi redirecionado para o login.');
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete('expired');
      const newQuery = current.toString();
      const newUrl = newQuery ? `?${newQuery}` : '';
      router.replace(`/login${newUrl}`);
    }
  }, [searchParams, router]);

  // Reset step when changing tabs
  useEffect(() => {
    if (activeTab === 'register') {
      setRegisterStep('select-type');
    }
  }, [activeTab]);

  if (!mounted) {
    return null;
  }

  // Determine container width based on tab and device
  const getContainerWidth = () => {
    if (isMobile) return 'flex-col';
    if (activeTab === 'login') return 'flex-row max-w-4xl h-[600px]';
    return 'flex-row h-[600px]';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <LoginHeader />

      {/* Main content */}
      <main className="flex-1 container flex items-center justify-center py-8">
        <div
          className={cn(
            'flex w-full rounded-xl overflow-hidden shadow-2xl border border-border/50',
            getContainerWidth()
          )}
        >
          <LoginSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content area */}
          <div className={cn('bg-card/50 backdrop-blur-sm', isMobile ? 'w-full p-6' : 'w-2/3 p-8')}>
            <div className="h-full flex flex-col">
              {/* Login Form */}
              {activeTab === 'login' && (
                <LoginForm
                  onForgotPassword={() => setShowForgotPasswordModal(true)}
                  onSwitchToRegister={() => setActiveTab('register')}
                  loginData={loginData}
                  handleLoginChange={handleLoginChange}
                  handleLoginSubmit={handleLoginSubmit}
                  loginError={loginError}
                  isLoginLoading={isLoginLoading}
                />
              )}

              {/* Register Flow */}
              {activeTab === 'register' && (
                <div className="flex-1 overflow-auto md:pr-4 md:pl-2">
                  {/* Step 1: Select User Type */}
                  {registerStep === 'select-type' && (
                    <UserTypeSelector registerType={registerType} onTypeChange={handleTypeSelection} />
                  )}

                  {/* Step 2: Fill Form */}
                  {registerStep === 'fill-form' && (
                    <>
                      {/* Form title based on selected type */}
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">
                          {registerType === 'love-decorations'
                            ? 'Eu amo decoração'
                            : registerType === 'professionals'
                            ? 'Profissional'
                            : 'Fornecedor Parceiro'}
                        </h1>
                        <p className="text-muted-foreground">Preencha seus dados para criar sua conta</p>
                      </div>

                      {/* Love Decoration Registration Form */}
                      {registerType === 'love-decorations' && (
                        <LoveDecorationForm
                          data={loveDecorationData}
                          onChange={handleLoveDecorationChange}
                          onSubmit={handleRegisterSubmit}
                          addressData={addressData}
                          setAddressData={setAddressData}
                          handleAddressChange={handleAddressChange}
                          photo={photo}
                          onPhotoChange={setPhoto}
                          isLoading={isRegisterLoading}
                          registerSuccess={registerSuccess}
                          onSwitchToTypeSelection={() => handleBackToTypeSelection()}
                          onSwitchToLogin={() => setActiveTab('login')}
                          fileInputRef={fileInputRef}
                          handleFileChange={handleFileChange}
                          removePhoto={removePhoto}
                          triggerFileInput={triggerFileInput}
                        />
                      )}

                      {/* Professional Registration Form */}
                      {registerType === 'professionals' && (
                        <ProfessionalForm
                          data={professionalData}
                          onChange={handleProfessionalChange}
                          onSelectChange={handleProfessionalSelectChange}
                          onSubmit={handleRegisterSubmit}
                          addressData={addressData}
                          setAddressData={setAddressData}
                          handleAddressChange={handleAddressChange}
                          photo={photo}
                          onPhotoChange={setPhoto}
                          professions={professions}
                          isLoading={isRegisterLoading}
                          registerSuccess={registerSuccess}
                          onSwitchToTypeSelection={() => handleBackToTypeSelection()}
                          onSwitchToLogin={() => setActiveTab('login')}
                          fileInputRef={fileInputRef}
                          handleFileChange={handleFileChange}
                          removePhoto={removePhoto}
                          triggerFileInput={triggerFileInput}
                        />
                      )}

                      {/* Partner Supplier Registration Form */}
                      {registerType === 'partner-suppliers' && (
                        <PartnerSupplierForm
                          data={partnerSupplierData}
                          onChange={handlePartnerSupplierChange}
                          onSubmit={handleRegisterSubmit}
                          addressData={addressData}
                          setAddressData={setAddressData}
                          handleAddressChange={handleAddressChange}
                          photo={photo}
                          onPhotoChange={setPhoto}
                          isLoading={isRegisterLoading}
                          registerSuccess={registerSuccess}
                          onSwitchToTypeSelection={() => handleBackToTypeSelection()}
                          onSwitchToLogin={() => setActiveTab('login')}
                          fileInputRef={fileInputRef}
                          handleFileChange={handleFileChange}
                          removePhoto={removePhoto}
                          triggerFileInput={triggerFileInput}
                        />
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} UP Connection. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ForgotPasswordModal isOpen={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)} />
    </div>
  );
}

export default LoginContent;
