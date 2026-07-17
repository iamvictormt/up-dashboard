const BASE_URL = process.env.NEXT_PUBLIC_FRONT_URL || '';

export const appUrl = {
  base: BASE_URL,
  mural: `${BASE_URL}/mural`,
  serviceProviders: `${BASE_URL}/service-providers`,
  suppliersStore: `${BASE_URL}/suppliers-store`,
  login: `${BASE_URL}/auth/login`,
  dashboard: `${BASE_URL}/dashboard`,
  physicalSales: `${BASE_URL}/physical-sales`,
  myStore: `${BASE_URL}/store-info`,
  profile: `${BASE_URL}/profile`,
  settings: `${BASE_URL}/settings`,
  logout: `${BASE_URL}/logout`,
  help: `${BASE_URL}/help`,
};
