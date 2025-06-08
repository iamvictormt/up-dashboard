export const fetchAddressByZipCode = async (zipCode: string) => {
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
