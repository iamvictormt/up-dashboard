import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pin, MapPinHouse, Map, MapPinned, Milestone, Warehouse, Compass, LucideIcon } from 'lucide-react';

interface AddressData {
  zipCode: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement: string;
}

interface AddressInputProps {
  id: string;
  name: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  isLogin?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  id,
  name,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  maxLength,
  disabled = false,
  required = true,
  type = 'text',
  isLogin,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium">
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`${isLogin ? 'pl-10 bg-card/50 border-border/50 focus:border-primary' : ''}`}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
      />
      {isLogin && (
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  </div>
);

interface AddressFormProps {
  addressData: AddressData;
  setAddressData: React.Dispatch<React.SetStateAction<AddressData>>;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  registerSuccess: boolean;
  applyZipCodeMask: (value: string) => string;
  isLogin: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  addressData,
  setAddressData,
  handleAddressChange,
  registerSuccess,
  applyZipCodeMask,
  isLogin,
}) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AddressInput
        id="zipCode"
        name="zipCode"
        label="CEP"
        icon={Pin}
        value={addressData.zipCode}
        onChange={(e) => {
          const masked = applyZipCodeMask(e.target.value);
          setAddressData((prev) => ({ ...prev, zipCode: masked }));
        }}
        placeholder="Ex: 00000-000"
        maxLength={9}
        disabled={registerSuccess}
        isLogin={isLogin}
      />

      <AddressInput
        id="state"
        name="state"
        label="Estado"
        icon={MapPinHouse}
        value={addressData.state}
        onChange={handleAddressChange}
        placeholder="Ex: São Paulo"
        disabled={true}
        isLogin={isLogin}
      />

      <AddressInput
        id="city"
        name="city"
        label="Cidade"
        icon={Map}
        value={addressData.city}
        onChange={handleAddressChange}
        placeholder="Ex: São Paulo"
        disabled={true}
        isLogin={isLogin}
      />

      <AddressInput
        id="district"
        name="district"
        label="Bairro"
        icon={MapPinned}
        value={addressData.district}
        onChange={handleAddressChange}
        placeholder="Ex: Bela Vista"
        maxLength={60}
        disabled={registerSuccess}
        isLogin={isLogin}
      />
    </div>

    <AddressInput
      id="street"
      name="street"
      label="Rua"
      icon={Milestone}
      value={addressData.street}
      onChange={handleAddressChange}
      placeholder="Ex: Av. Paulista"
      maxLength={60}
      disabled={registerSuccess}
      isLogin={isLogin}
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AddressInput
        id="number"
        name="number"
        label="Número"
        icon={Warehouse}
        value={addressData.number}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          setAddressData((prev) => ({ ...prev, number: value }));
        }}
        placeholder="Ex: 30"
        maxLength={6}
        disabled={registerSuccess}
        isLogin={isLogin}
      />

      <AddressInput
        id="complement"
        name="complement"
        label="Complemento"
        icon={Compass}
        value={addressData.complement}
        onChange={handleAddressChange}
        placeholder="Ex: Bloco B, Apto 12"
        maxLength={60}
        disabled={registerSuccess}
        required={false}
        isLogin={isLogin}
      />
    </div>
  </div>
);
