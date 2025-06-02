import api from '@/services/api';
import { toast } from 'sonner';

export const uploadImage = async (file: string): Promise<string | null> => {
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

export const updateUserProfileImage = async (userId: string, imageUrl: string): Promise<boolean> => {
  try {
    const response = await api.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/profile-image`, {
      profileImage: imageUrl,
    });

    if (response.status !== 200) {
      throw new Error('Erro ao atualizar a imagem de perfil.');
    }

    toast.success('Foto de perfil atualizada com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar a imagem de perfil:', error);
    toast.error('Não foi possível atualizar a foto de perfil.');
    return false;
  }
};
