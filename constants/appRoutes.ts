const BASE_URL = process.env.NEXT_PUBLIC_FRONT_URL || '';

export const appUrl = {
  base: BASE_URL,
  mural: `${BASE_URL}/mural`,
  login: `${BASE_URL}/auth/entrar`,
  dashboard: `${BASE_URL}/painel`,
  myStore: `${BASE_URL}/minha-loja`,
  profile: `${BASE_URL}/perfil`,
  settings: `${BASE_URL}/configuracoes`,
  logout: `${BASE_URL}/sair`,
  help: `${BASE_URL}/ajuda`,
};
