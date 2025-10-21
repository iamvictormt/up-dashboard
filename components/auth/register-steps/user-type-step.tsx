'use client';

import { motion } from 'framer-motion';
import { Heart, User, Building2 } from 'lucide-react';

type UserType = 'love-decorations' | 'professionals' | 'partner-suppliers';

interface UserTypeStepProps {
  selectedType: UserType;
  onSelect: (type: UserType) => void;
}

export function UserTypeStep({ selectedType, onSelect }: UserTypeStepProps) {
  const userTypes = [
    {
      id: 'love-decorations' as UserType,
      title: 'Eu amo decoração',
      description: 'Para entusiastas e apaixonados por decoração',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
      borderColor: 'border-pink-200 hover:border-pink-300',
      selectedBorder: 'border-pink-500',
    },
    {
      id: 'professionals' as UserType,
      title: 'Profissionais de Decoração',
      description: 'Arquitetos, designers e profissionais da área',
      icon: User,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200 hover:border-blue-300',
      selectedBorder: 'border-blue-500',
    },
    {
      id: 'partner-suppliers' as UserType,
      title: 'Lojista Parceiro',
      description: 'Empresas, lojistas e fornecedores',
      icon: Building2,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200 hover:border-emerald-300',
      selectedBorder: 'border-emerald-500',
    },
  ];

  return (
    <div className="space-y-4">
      {userTypes.map((type, index) => {
        const Icon = type.icon;
        const isSelected = selectedType === type.id;

        return (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`
              relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
              ${isSelected ? `${type.bgColor} ${type.selectedBorder} shadow-md` : `bg-white ${type.borderColor}`}
            `}
            onClick={() => onSelect(type.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`
                w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${type.color}
              `}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">{type.title}</h3>
                <p className="text-slate-600 text-sm">{type.description}</p>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}

      <p className="text-center text-sm text-muted-foreground mt-6">Você não poderá alterar essas informações depois</p>
    </div>
  );
}
