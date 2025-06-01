import logoUpSvg from '../public/logo-up.svg';
import logoAbelha from '../public/logo-abelha.png';
import { StaticImageData } from 'next/image';

type AppImage = {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
};

export const appImages: Record<string, AppImage> = {
  logoUpSvg: {
    src: logoUpSvg,
    alt: 'Logo da aplicação',
    width: 200,
    height: 80,
  },

  logoAbelha: {
    src: logoAbelha,
    alt: 'Logo estimação da aplicação',
    width: 200,
    height: 80,
  },
};
