"use client"

import { Heart, User, Building2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type RegisterType = "love-decorations" | "professionals" | "partner-suppliers"

interface UserTypeSelectorProps {
  registerType: RegisterType
  onTypeChange: (type: RegisterType) => void
}

export function UserTypeSelector({ registerType, onTypeChange }: UserTypeSelectorProps) {
  const userTypes = [
    {
      id: "love-decorations" as RegisterType,
      title: "Eu amo decoração",
      description: "Para entusiastas e apaixonados por decoração",
      icon: Heart,
      gradient: "from-pink-500/20 to-rose-500/20",
      iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
      borderColor: "border-pink-500/30",
      selectedBg: "bg-gradient-to-br from-pink-500/10 to-rose-500/10",
    },
    {
      id: "professionals" as RegisterType,
      title: "Profissional",
      description: "Arquitetos, designers e profissionais da área",
      icon: User,
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
      borderColor: "border-blue-500/30",
      selectedBg: "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
    },
    {
      id: "partner-suppliers" as RegisterType,
      title: "Fornecedor Parceiro",
      description: "Empresas, lojistas e fornecedores",
      icon: Building2,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
      borderColor: "border-emerald-500/30",
      selectedBg: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-8 md:pl-4" variants={container} initial="hidden" animate="show">
      {/* Header com decoração */}
      <motion.div className="text-center relative" variants={item}>
        <div className="pt-8">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Junte-se à nossa comunidade
          </h1>
          <p className="text-muted-foreground text-lg">Escolha o tipo de conta que melhor representa você</p>
        </div>
      </motion.div>

      {/* Cards de seleção */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={container}>
        {userTypes.map((type) => {
          const Icon = type.icon
          const isSelected = registerType === type.id

          return (
            <motion.button
              key={type.id}
              type="button"
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl text-left",
                isSelected
                  ? `${type.selectedBg} ${type.borderColor} shadow-lg`
                  : "bg-card/50 border-border/50 hover:border-primary/30 hover:bg-card/70",
              )}
              variants={item}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Conteúdo do card */}
              <div className="relative z-10">
                {/* Ícone */}
                <div className="mb-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
                      isSelected ? type.iconBg : "bg-primary/10 group-hover:bg-primary/20",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-7 w-7 transition-colors duration-300",
                        isSelected ? "text-white" : "text-primary",
                      )}
                    />
                  </div>
                </div>

                {/* Título */}
                <h3
                  className={cn(
                    "font-bold text-lg mb-2 transition-colors duration-300",
                    isSelected ? "text-foreground" : "text-foreground/90 group-hover:text-foreground",
                  )}
                >
                  {type.title}
                </h3>

                {/* Descrição */}
                <p
                  className={cn(
                    "text-sm transition-colors duration-300",
                    isSelected ? "text-foreground/80" : "text-muted-foreground group-hover:text-foreground/70",
                  )}
                >
                  {type.description}
                </p>

                {/* Indicador de seleção */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
