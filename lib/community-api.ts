import api from '@/services/api';
import type { Community } from '@/types/community';

// Mock data for communities
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Arquitetura & Design',
    description: 'Discussões sobre projetos arquitetônicos, tendências de design e inspirações.',
    color: '#4F46E5',
    icon: 'Building',
  },
  {
    id: '2',
    name: 'Reformas & DIY',
    description: 'Compartilhe suas experiências de reforma e projetos faça-você-mesmo.',
    color: '#10B981',
    icon: 'Hammer',
  },
  {
    id: '3',
    name: 'Materiais & Fornecedores',
    description: 'Recomendações e discussões sobre materiais de construção e fornecedores.',
    color: '#F59E0B',
    icon: 'Package',
  },
  {
    id: '4',
    name: 'Decoração',
    description: 'Ideias e inspirações para decoração de interiores.',
    color: '#EC4899',
    icon: 'Paintbrush',
  },
  {
    id: '5',
    name: 'Paisagismo',
    description: 'Discussões sobre projetos de paisagismo, plantas e jardins.',
    color: '#059669',
    icon: 'Flower2',
  },
  {
    id: '6',
    name: 'Tecnologia & Inovação',
    description: 'Novidades tecnológicas para construção e automação residencial.',
    color: '#6366F1',
    icon: 'Cpu',
  },
  {
    id: '7',
    name: 'Networking',
    description: 'Conecte-se com outros profissionais da área.',
    color: '#8B5CF6',
    icon: 'Users',
  },
];

export async function fetchCommunities(): Promise<Community[]> {
  const response = await api.get('communities');
  return response.data || [];
}

export async function fetchCommunityById(id: string): Promise<Community> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, this would be an API call
  // return fetch(`/api/communities/${id}`).then(res => res.json())

  const community = mockCommunities.find((c) => c.id === id);
  if (!community) {
    throw new Error(`Community with id ${id} not found`);
  }

  return community;
}
