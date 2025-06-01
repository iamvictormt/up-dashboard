const BASE_URL = process.env.NEXT_PUBLIC_FRONT_URL || '';

export const appUrl = {
  base: BASE_URL,
  login: `${BASE_URL}/login`,
  dashboard: `${BASE_URL}/dashboard`,
  profile: `${BASE_URL}/profile`,
  settings: `${BASE_URL}/settings`,
  logout: `${BASE_URL}/logout`,
};
