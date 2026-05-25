export interface StateCityOption {
  state: string;
  label: string;
  cities: string[];
}

export const ALL_STATES_VALUE = 'ALL_STATES';
export const ALL_CITIES_VALUE = 'ALL_CITIES';

export const BRAZIL_LOCATION_OPTIONS: StateCityOption[] = [
  { state: 'AC', label: 'Acre', cities: ['Rio Branco', 'Cruzeiro do Sul'] },
  { state: 'AL', label: 'Alagoas', cities: ['Maceió', 'Arapiraca'] },
  { state: 'AP', label: 'Amapá', cities: ['Macapá', 'Santana'] },
  { state: 'AM', label: 'Amazonas', cities: ['Manaus', 'Parintins'] },
  {
    state: 'BA',
    label: 'Bahia',
    cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
  },
  {
    state: 'CE',
    label: 'Ceará',
    cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'],
  },
  { state: 'DF', label: 'Distrito Federal', cities: ['Brasília'] },
  {
    state: 'ES',
    label: 'Espírito Santo',
    cities: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica'],
  },
  {
    state: 'GO',
    label: 'Goiás',
    cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'],
  },
  { state: 'MA', label: 'Maranhão', cities: ['São Luís', 'Imperatriz'] },
  {
    state: 'MT',
    label: 'Mato Grosso',
    cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis'],
  },
  { state: 'MS', label: 'Mato Grosso do Sul', cities: ['Campo Grande', 'Dourados'] },
  {
    state: 'MG',
    label: 'Minas Gerais',
    cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora'],
  },
  { state: 'PA', label: 'Pará', cities: ['Belém', 'Ananindeua', 'Santarém'] },
  { state: 'PB', label: 'Paraíba', cities: ['João Pessoa', 'Campina Grande'] },
  {
    state: 'PR',
    label: 'Paraná',
    cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa'],
  },
  {
    state: 'PE',
    label: 'Pernambuco',
    cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru'],
  },
  { state: 'PI', label: 'Piauí', cities: ['Teresina', 'Parnaíba'] },
  {
    state: 'RJ',
    label: 'Rio de Janeiro',
    cities: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Cabo Frio'],
  },
  {
    state: 'RN',
    label: 'Rio Grande do Norte',
    cities: ['Natal', 'Mossoró', 'Parnamirim'],
  },
  {
    state: 'RS',
    label: 'Rio Grande do Sul',
    cities: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas'],
  },
  { state: 'RO', label: 'Rondônia', cities: ['Porto Velho', 'Ji-Paraná'] },
  { state: 'RR', label: 'Roraima', cities: ['Boa Vista'] },
  {
    state: 'SC',
    label: 'Santa Catarina',
    cities: ['Florianópolis', 'Joinville', 'Blumenau', 'São José'],
  },
  {
    state: 'SP',
    label: 'São Paulo',
    cities: [
      'São Paulo',
      'Campinas',
      'Santos',
      'Ribeirão Preto',
      'São José dos Campos',
      'Sorocaba',
    ],
  },
  { state: 'SE', label: 'Sergipe', cities: ['Aracaju', 'Nossa Senhora do Socorro'] },
  { state: 'TO', label: 'Tocantins', cities: ['Palmas', 'Araguaína'] },
];
