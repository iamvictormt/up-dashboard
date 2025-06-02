'use client';

import type React from 'react';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  Mail,
  UserPlus,
  Briefcase,
  LogIn,
  Building2,
  Phone,
  IdCard,
  Fingerprint,
  Building,
  Tickets,
  PhoneCall,
  UploadCloud,
  X,
  Heart,
  Instagram,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { applyDocumentCnpjMask, applyDocumentMask, applyPhoneMask, applyZipCodeMask } from '@/utils/masks';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useIsMobile } from '@/hooks/use-mobile';
import { RegisterDTO } from '@/types';
import { appUrl } from '@/constants/appRoutes';
import { appImages } from '@/constants/appImages';
import { isProfessional, isPartnerSupplier, isLoveDecoration } from '@/utils/typeGuards';
import { AddressForm } from './address-form';

export default function LoginContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [registerType, setRegisterType] = useState<'professionals' | 'partner-suppliers' | 'love-decorations'>(
    'love-decorations'
  );
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        console.log(imageUrl);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const [loginData, setLoginData] = useState({
    email: '',
    senha: '',
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

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
    profession: '',
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

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

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
      Cookies.set('user', JSON.stringify(data.user), { expires: 1 / 24 });

      toast.success('Login realizado com sucesso!');
      setTimeout(() => {
        window.location.href = appUrl.base;
      }, 2000);
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error('Erro de indisponibilidade, contate o administrador.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Professional Register handlers
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

  const handleLoveDecorationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);

    if (name === 'contact') {
      setLoveDecorationData((prev) => ({ ...prev, [name]: applyPhoneMask(value) }));
    } else {
      setLoveDecorationData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessionalSelectChange = (value: string) => {
    setProfessionalData((prev) => ({ ...prev, profession: value }));
  };

  // Partner Supplier Register handlers
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

  const uploadImage = async (file: string): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Erro ao fazer upload da imagem');
      }

      return result.secure_url;
    } catch (error: any) {
      console.error('Erro no upload da imagem:', error);
      toast.error('Erro ao salvar a foto de perfil. O cadastro continuará sem a foto.');
      return null;
    }
  };

  const buildAddress = (address: any) => ({
    city: address.city,
    complement: address.complement,
    district: address.district,
    number: address.number,
    state: address.state,
    street: address.street,
    zipCode: address.zipCode,
  });

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

    const uploadedImageUrl = photo ? await uploadImage(photo) : null;

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
        profession: data.profession,
        document: data.document,
        generalRegister: data.generalRegister,
        registrationAgency: data.registrationAgency,
        phone: data.phone,
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

    const url = `${process.env.NEXT_PUBLIC_API_URL}/${registerType}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || 'Erro no cadastro.');
      }

      toast.success('Cadastro realizado com sucesso! Redirecionando para o login...');
      setRegisterSuccess(true);

      setTimeout(() => {
        setActiveTab('login');
        setRegisterSuccess(false);
        setLoginData((prev) => ({ ...prev, email: data.email }));
      }, 2000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

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
    removePhoto();
  }, [registerType]);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      toast.warning('Seu token expirou. Você foi redirecionado para o login.');
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete('expired');

      const newQuery = current.toString();
      const newUrl = newQuery ? `?${newQuery}` : '';

      router.replace(`/login${newUrl}`);
    }
  }, [searchParams]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="container py-6">
        <div className="flex justify-between items-center">
          <Link
            href="https://up-landing-page.vercel.app/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o site</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="relative w-16 h-16">
              <Image src={appImages.logoUpSvg.src} alt="UP Club Logo" fill className="object-contain" priority />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container flex items-center justify-center py-8 ">
        <div
          className={cn(
            'flex w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl border border-border/50',
            isMobile ? 'flex-col' : 'flex-row h-[600px]'
          )}
        >
          {/* Sidebar with tabs */}
          <div
            className={cn(
              'bg-gradient-to-b from-primary/20 to-secondary/20 backdrop-blur-sm content-center',
              isMobile ? 'w-full p-4' : 'w-1/3 p-8'
            )}
          >
            <div className="flex justify-center">
              <div className="relative w-28 h-28">
                <Image src={appImages.logoAbelha.src} alt="UP Club Logo" fill className="object-contain" priority />
              </div>
            </div>
            <h2 className={cn('text-2xl font-bold mb-6 text-center mt-2', isMobile ? 'hidden' : 'block')}>
              Bem-vindo ao{' '}
              <span className="text-primary">
                <br />
                UP{' '}
              </span>
              <span className="text-foreground">Connection</span>
            </h2>

            <div className={cn('space-y-4', isMobile ? 'flex space-y-0 gap-4' : 'block')}>
              <button
                onClick={() => setActiveTab('login')}
                className={cn(
                  'w-full group flex items-center gap-3 p-4 rounded-lg transition-all duration-300',
                  activeTab === 'login'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/30 text-foreground hover:bg-card/50',
                  isMobile ? 'justify-center flex-1' : ''
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300',
                    activeTab === 'login' ? 'bg-primary-foreground/20' : 'bg-primary/20 group-hover:bg-primary/30'
                  )}
                >
                  <LogIn
                    className={cn(
                      'h-5 w-5 transition-all duration-300',
                      activeTab === 'login' ? 'text-primary-foreground' : 'text-primary'
                    )}
                  />
                </div>
                <div className={isMobile ? 'hidden' : 'block'}>
                  <p className="font-medium text-lg">Login</p>
                  <p
                    className={cn(
                      'text-xs',
                      activeTab === 'login' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}
                  >
                    Acesse sua conta
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('register')}
                className={cn(
                  'w-full group flex items-center gap-3 p-4 rounded-lg transition-all duration-300',
                  activeTab === 'register'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card/30 text-foreground hover:bg-card/50',
                  isMobile ? 'justify-center flex-1' : ''
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300',
                    activeTab === 'register' ? 'bg-primary-foreground/20' : 'bg-primary/20 group-hover:bg-primary/30'
                  )}
                >
                  <UserPlus
                    className={cn(
                      'h-5 w-5 transition-all duration-300',
                      activeTab === 'register' ? 'text-primary-foreground' : 'text-primary'
                    )}
                  />
                </div>
                <div className={isMobile ? 'hidden' : 'block'}>
                  <p className="font-medium text-lg">Cadastro</p>
                  <p
                    className={cn(
                      'text-xs',
                      activeTab === 'register' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}
                  >
                    Crie sua conta
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className={cn('bg-card/50 backdrop-blur-sm', isMobile ? 'w-full p-6' : 'w-2/3 p-8')}>
            <div className="h-full flex flex-col">
              {/* Login Form */}
              {activeTab === 'login' && (
                <div className="flex-1">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Acesse sua conta</h1>
                    <p className="text-muted-foreground">Entre com suas credenciais para acessar</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {loginError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                            placeholder="seu@email.com.br"
                            required
                          />
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="senha" className="text-sm font-medium">
                            Senha
                          </Label>
                          <Button variant="link" className="h-auto p-0 text-xs" type="button">
                            Esqueceu a senha?
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            id="senha"
                            name="senha"
                            type="password"
                            value={loginData.senha}
                            onChange={handleLoginChange}
                            className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                            required
                          />
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? 'Entrando...' : 'Entrar'}
                    </Button>

                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">Não tem uma conta?</span>{' '}
                      <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('register')}>
                        Cadastre-se
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <div className="flex-1 overflow-auto pr-5 pl-1">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
                    <p className="text-muted-foreground">Escolha o tipo de cadastro</p>
                  </div>

                  <div className="flex gap-4 mb-6"></div>

                  {/* Register Type Selector */}
                  <div className="col-12 flex gap-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setRegisterType('love-decorations')}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300',
                        registerType === 'love-decorations'
                          ? 'bg-primary/20 border-primary shadow-md'
                          : 'bg-card/30 border-border/50 hover:bg-card/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center h-12 w-12 rounded-full',
                          registerType === 'love-decorations' ? 'bg-primary/30' : 'bg-primary/10'
                        )}
                      >
                        <Heart
                          className={cn(
                            'h-6 w-6',
                            registerType === 'love-decorations' ? 'text-primary-foreground' : 'text-primary'
                          )}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Eu amo decoração</p>
                        <p className="text-xs text-muted-foreground"></p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterType('professionals')}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300',
                        registerType === 'professionals'
                          ? 'bg-primary/20 border-primary shadow-md'
                          : 'bg-card/30 border-border/50 hover:bg-card/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center h-12 w-12 rounded-full',
                          registerType === 'professionals' ? 'bg-primary/30' : 'bg-primary/10'
                        )}
                      >
                        <User
                          className={cn(
                            'h-6 w-6',
                            registerType === 'professionals' ? 'text-primary-foreground' : 'text-primary'
                          )}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Profissional</p>
                        <p className="text-xs text-muted-foreground"></p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegisterType('partner-suppliers')}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300',
                        registerType === 'partner-suppliers'
                          ? 'bg-primary/20 border-primary shadow-md'
                          : 'bg-card/30 border-border/50 hover:bg-card/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center h-12 w-12 rounded-full',
                          registerType === 'partner-suppliers' ? 'bg-primary/30' : 'bg-primary/10'
                        )}
                      >
                        <Building2
                          className={cn(
                            'h-6 w-6',
                            registerType === 'partner-suppliers' ? 'text-primary-foreground' : 'text-primary'
                          )}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Fornecedor Parceiro</p>
                        <p className="text-xs text-muted-foreground"></p>
                      </div>
                    </button>
                  </div>

                  {/* Love Decoration Registration Form */}
                  {registerType === 'love-decorations' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center">
                            {!photo ? (
                              <div
                                className="border-2 border-dashed border-gray-300 rounded-full p-6 text-center w-64 h-64 cursor-pointer hover:border-primary transition-colors"
                                onClick={triggerFileInput}
                              >
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <UploadCloud className="h-12 w-12 text-gray-300 mb-2 mx-auto mt-12" />
                                <p className="text-sm text-gray-300">Clique para enviar sua foto de perfil</p>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200">
                                  <img
                                    src={photo || '/placeholder.svg'}
                                    alt="Profile photo"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute -bottom-2 -right-2 flex gap-2">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={removePhoto}
                                    className="rounded-full shadow-md"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Nome completo
                          </Label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={loveDecorationData.name}
                              onChange={handleLoveDecorationChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Ex: Ana Maria da Silva"
                              required
                              disabled={registerSuccess}
                            />
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact" className="text-sm font-medium">
                              Contato
                            </Label>
                            <div className="relative">
                              <Input
                                id="contact"
                                name="contact"
                                type="tel"
                                value={loveDecorationData.contact}
                                onChange={handleLoveDecorationChange}
                                onBlur={(e) => {
                                  e.target.value.length !== 15
                                    ? setLoveDecorationData((prev) => ({ ...prev, contact: '' }))
                                    : '';
                                }}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: (00) 00000-0000"
                                required
                                disabled={registerSuccess}
                              />
                              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                              Email
                            </Label>
                            <div className="relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={loveDecorationData.email}
                                onChange={handleLoveDecorationChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: contato@teste.com.br"
                                required
                                maxLength={55}
                                disabled={registerSuccess}
                              />
                              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="instagram" className="text-sm font-medium">
                              Instagram
                            </Label>
                            <div className="relative">
                              <Input
                                id="instagram"
                                name="instagram"
                                type="text"
                                value={loveDecorationData.instagram}
                                onChange={handleLoveDecorationChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: @AnaAMS"
                                required
                                disabled={registerSuccess}
                              />
                              <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tiktok" className="text-sm font-medium">
                              Tiktok
                            </Label>
                            <div className="relative">
                              <Input
                                id="tiktok"
                                name="tiktok"
                                type="text"
                                value={loveDecorationData.tiktok}
                                onChange={handleLoveDecorationChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: @AnaAMS"
                                required
                                maxLength={55}
                                disabled={registerSuccess}
                              />
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-tiktok absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                viewBox="0 0 16 16"
                              >
                                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <AddressForm
                          addressData={addressData}
                          setAddressData={setAddressData}
                          handleAddressChange={handleAddressChange}
                          registerSuccess={registerSuccess}
                          applyZipCodeMask={applyZipCodeMask}
                          isLogin={true}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                              Senha
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                value={loveDecorationData.password}
                                onChange={handleLoveDecorationChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                required
                                maxLength={22}
                                disabled={registerSuccess}
                              />
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                              Confirmar Senha
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={loveDecorationData.confirmPassword}
                                onChange={handleLoveDecorationChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                required
                                maxLength={22}
                                disabled={registerSuccess}
                              />
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>{' '}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                        disabled={isRegisterLoading || registerSuccess}
                      >
                        {isRegisterLoading ? 'Cadastrando...' : 'Cadastrar como Eu amo decoração'}
                      </Button>
                    </form>
                  )}

                  {/* Professional Registration Form */}
                  {registerType === 'professionals' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex flex-col items-center">
                            {!photo ? (
                              <div
                                className="border-2 border-dashed border-gray-300 rounded-full w-64 h-64 p-6 text-center cursor-pointer hover:border-primary transition-colors"
                                onClick={triggerFileInput}
                              >
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <UploadCloud className="h-12 w-12 text-gray-300 mb-2 mx-auto mt-12" />
                                <p className="text-sm text-gray-300">Clique para enviar sua foto de perfil</p>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200">
                                  <img
                                    src={photo || '/placeholder.svg'}
                                    alt="Profile photo"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute -bottom-2 -right-2 flex gap-2">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={removePhoto}
                                    className="rounded-full shadow-md"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Nome completo
                          </Label>
                          <div className="relative">
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              value={professionalData.name}
                              onChange={handleProfessionalChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Ex: Ana Maria da Silva"
                              required
                              disabled={registerSuccess}
                            />
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="office-name" className="text-sm font-medium">
                            Nome do escritório
                          </Label>
                          <div className="relative">
                            <Input
                              id="office-name"
                              name="officeName"
                              type="text"
                              value={professionalData.officeName}
                              onChange={handleProfessionalChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Ex: Lume Arquitetura"
                              required
                              disabled={registerSuccess}
                            />
                            <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="profession" className="text-sm font-medium">
                              Profissão
                            </Label>
                            <div className="relative">
                              <Select
                                value={professionalData.profession}
                                onValueChange={handleProfessionalSelectChange}
                                disabled={registerSuccess}
                                required
                              >
                                <SelectTrigger className="pl-10 bg-card/50 border-border/50 focus:border-primary">
                                  <SelectValue placeholder="Selecione sua profissão" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Arquiteto(a)">Arquiteto(a)</SelectItem>
                                  <SelectItem value="Designer de Interiores">Designer de Interiores</SelectItem>
                                  <SelectItem value="Engenheiro(a)">Engenheiro(a)</SelectItem>
                                  <SelectItem value="Paisagista">Paisagista</SelectItem>
                                  <SelectItem value="Outro">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="document" className="text-sm font-medium">
                              CPF/CNPJ
                            </Label>
                            <div className="relative">
                              <Input
                                id="document"
                                name="document"
                                type="text"
                                value={professionalData.document}
                                onChange={handleProfessionalChange}
                                onBlur={(e) => {
                                  e.target.value.length !== 14 && e.target.value.length !== 18
                                    ? setProfessionalData((prev) => ({ ...prev, document: '' }))
                                    : '';
                                }}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                required
                                disabled={registerSuccess}
                                placeholder="Ex: 000.000.000-00"
                              />
                              <Fingerprint className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="general-register" className="text-sm font-medium">
                              RG
                            </Label>
                            <div className="relative">
                              <Input
                                id="general-register"
                                name="generalRegister"
                                type="text"
                                value={professionalData.generalRegister}
                                onChange={handleProfessionalChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: 000000000"
                                required
                                maxLength={10}
                                disabled={registerSuccess}
                              />
                              <IdCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="registration-agency" className="text-sm font-medium">
                              CREA/CAU/ABD
                            </Label>
                            <div className="relative">
                              <Input
                                id="registration-agency"
                                name="registrationAgency"
                                type="text"
                                value={professionalData.registrationAgency}
                                onChange={handleProfessionalChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: 1234567890-0/SP"
                                required
                                maxLength={20}
                                disabled={registerSuccess}
                              />
                              <Tickets className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">
                              Whatsapp
                            </Label>
                            <div className="relative">
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={professionalData.phone}
                                onChange={handleProfessionalChange}
                                onBlur={(e) => {
                                  e.target.value.length !== 15
                                    ? setProfessionalData((prev) => ({ ...prev, phone: '' }))
                                    : '';
                                }}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: (00) 00000-0000"
                                required
                                disabled={registerSuccess}
                              />
                              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="professional-email" className="text-sm font-medium">
                              Email
                            </Label>
                            <div className="relative">
                              <Input
                                id="professional-email"
                                name="email"
                                type="email"
                                value={professionalData.email}
                                onChange={handleProfessionalChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: contato@teste.com.br"
                                required
                                maxLength={55}
                                disabled={registerSuccess}
                              />
                              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        <AddressForm
                          addressData={addressData}
                          setAddressData={setAddressData}
                          handleAddressChange={handleAddressChange}
                          registerSuccess={registerSuccess}
                          applyZipCodeMask={applyZipCodeMask}
                          isLogin={true}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                              Senha
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                value={professionalData.password}
                                onChange={handleProfessionalChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                required
                                maxLength={22}
                                disabled={registerSuccess}
                              />
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                              Confirmar Senha
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={professionalData.confirmPassword}
                                onChange={handleProfessionalChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                required
                                maxLength={22}
                                disabled={registerSuccess}
                              />
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>{' '}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                        disabled={isRegisterLoading || registerSuccess}
                      >
                        {isRegisterLoading ? 'Cadastrando...' : 'Cadastrar como Profissional'}
                      </Button>
                    </form>
                  )}

                  {/* Partner Supplier Registration Form */}
                  {registerType === 'partner-suppliers' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col items-center">
                          {!photo ? (
                            <div
                              className="border-2 border-dashed border-gray-300 w-64 h-64 rounded-full p-6 text-center cursor-pointer hover:border-primary transition-colors"
                              onClick={triggerFileInput}
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <UploadCloud className="h-12 w-12 text-gray-300 mb-2 mx-auto mt-12" />
                              <p className="text-sm text-gray-300">Clique para enviar sua foto de perfil</p>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200">
                                <img
                                  src={photo || '/placeholder.svg'}
                                  alt="Profile photo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute -bottom-2 -right-2 flex gap-2">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={removePhoto}
                                  className="rounded-full shadow-md"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="trade-name" className="text-sm font-medium">
                            Nome fantasia
                          </Label>
                          <div className="relative">
                            <Input
                              id="trade-name"
                              name="tradeName"
                              type="text"
                              value={partnerSupplierData.tradeName}
                              onChange={handlePartnerSupplierChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Ex: Padaria Doce Sabor"
                              required
                              disabled={registerSuccess}
                            />
                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company-name" className="text-sm font-medium">
                            Razão social
                          </Label>
                          <div className="relative">
                            <Input
                              id="company-name"
                              name="companyName"
                              type="text"
                              value={partnerSupplierData.companyName}
                              onChange={handlePartnerSupplierChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Ex: Padaria e Confeitaria São João LTDA"
                              required
                              disabled={registerSuccess}
                            />
                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="document" className="text-sm font-medium">
                              CNPJ
                            </Label>
                            <div className="relative">
                              <Input
                                id="document"
                                name="document"
                                type="text"
                                value={partnerSupplierData.document}
                                onChange={handlePartnerSupplierChange}
                                onBlur={(e) => {
                                  e.target.value.length !== 18
                                    ? setPartnerSupplierData((prev) => ({ ...prev, document: '' }))
                                    : '';
                                }}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: 00.000.000/0000-00"
                                required
                                disabled={registerSuccess}
                              />
                              <Fingerprint className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="state-registration" className="text-sm font-medium">
                              Inscrição estadual
                            </Label>
                            <div className="relative">
                              <Input
                                id="state-registration"
                                name="stateRegistration"
                                type="text"
                                value={partnerSupplierData.stateRegistration}
                                onChange={handlePartnerSupplierChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: 110.042.490.114"
                                required
                                maxLength={16}
                                disabled={registerSuccess}
                              />
                              <Tickets className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact" className="text-sm font-medium">
                              Contato
                            </Label>
                            <div className="relative">
                              <Input
                                id="contact"
                                name="contact"
                                type="tel"
                                value={partnerSupplierData.contact}
                                onChange={handlePartnerSupplierChange}
                                onBlur={(e) => {
                                  e.target.value.length !== 15
                                    ? setPartnerSupplierData((prev) => ({ ...prev, contact: '' }))
                                    : '';
                                }}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: (00) 00000-0000"
                                required
                                disabled={registerSuccess}
                              />
                              <PhoneCall className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="partner-supplier-email" className="text-sm font-medium">
                              Email
                            </Label>
                            <div className="relative">
                              <Input
                                id="partner-supplier-email"
                                name="email"
                                type="email"
                                value={partnerSupplierData.email}
                                onChange={handlePartnerSupplierChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                placeholder="Ex: contato@teste.com.br"
                                required
                                disabled={registerSuccess}
                              />
                              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>

                        <AddressForm
                          addressData={addressData}
                          setAddressData={setAddressData}
                          handleAddressChange={handleAddressChange}
                          registerSuccess={registerSuccess}
                          applyZipCodeMask={applyZipCodeMask}
                          isLogin={true}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                              Senha
                            </Label>
                            <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                value={partnerSupplierData.password}
                                onChange={handlePartnerSupplierChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                required
                                disabled={registerSuccess}
                              />
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">
                              Confirmar Senha
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={partnerSupplierData.confirmPassword}
                                onChange={handlePartnerSupplierChange}
                                className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                                required
                                disabled={registerSuccess}
                              />
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                        disabled={isRegisterLoading || registerSuccess}
                      >
                        {isRegisterLoading ? 'Cadastrando...' : 'Cadastrar como Lojista'}
                      </Button>
                    </form>
                  )}

                  <div className="text-center text-sm mt-6">
                    <span className="text-muted-foreground">Já tem uma conta?</span>{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab('login')}>
                      Faça login
                    </Button>
                  </div>
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
    </div>
  );
}
