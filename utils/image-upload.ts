/**
 * Converte um arquivo para string base64
 * @param file Arquivo a ser convertido
 * @returns Promise com a string base64 (sem o prefixo data:image)
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove o prefixo "data:image/...;base64," para enviar apenas a string base64
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Valida um arquivo de imagem
 * @param file Arquivo a ser validado
 * @param maxSizeMB Tamanho máximo em MB (padrão: 5MB)
 * @returns Objeto com status e mensagem de erro (se houver)
 */
export const validateImageFile = (file: File, maxSizeMB = 5): { valid: boolean; message?: string } => {
  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: 'Por favor, selecione apenas arquivos de imagem.' };
  }

  // Validar tamanho
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, message: `A imagem deve ter no máximo ${maxSizeMB}MB.` };
  }

  return { valid: true };
};

/**
 * Cria uma URL de preview para um arquivo
 * @param file Arquivo para criar preview
 * @returns Promise com a URL do preview
 */
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Faz upload de uma imagem de perfil para a API
 * @param userId ID do usuário
 * @param imageBase64 String base64 da imagem
 * @returns Promise com o resultado do upload
 */
export const uploadProfileImage = async (userId: string, imageBase64: string): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/profile-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        profileImage: imageBase64,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar imagem de perfil');
    }

    return true;
  } catch (error) {
    console.error('Erro ao salvar imagem:', error);
    throw error;
  }
};

/**
 * Processa um arquivo de imagem selecionado (validação + preview)
 * @param file Arquivo selecionado
 * @param maxSizeMB Tamanho máximo em MB
 * @returns Objeto com status, preview e mensagem de erro (se houver)
 */
export const processSelectedImage = async (
  file: File,
  maxSizeMB = 5
): Promise<{ valid: boolean; preview?: string; message?: string }> => {
  // Validar arquivo
  const validation = validateImageFile(file, maxSizeMB);
  if (!validation.valid) {
    return validation;
  }

  // Criar preview
  try {
    const preview = await createImagePreview(file);
    return { valid: true, preview };
  } catch (error) {
    return { valid: false, message: 'Erro ao processar imagem. Tente novamente.' };
  }
};

/**
 * Faz upload de uma imagem para o servidor
 * @param file Arquivo de imagem a ser enviado
 * @returns Promise com a URL da imagem após o upload
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Converter para base64
    const base64 = await fileToBase64(file);

    // Em um ambiente real, aqui seria feita uma chamada para a API
    // Simulando um delay de upload
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulando uma URL retornada pelo servidor
    // Em produção, isso seria substituído pela URL real retornada pela API
    const mockImageUrl = `https://api.example.com/images/${Date.now()}-${file.name}`;

    console.log('Image uploaded successfully:', mockImageUrl);
    return mockImageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
};
