'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Shield, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const carouselData = [
  {
    icon: Users,
    title: 'Conecte-se com Profissionais',
    description: 'Encontre e conecte-se com milhares de profissionais qualificados em diversas áreas do mercado.',
    stats: '500+',
    statsLabel: 'profissionais ativos',
    color: 'from-blue-500 to-cyan-400',
    bgPattern: 'bg-gradient-to-br from-blue-500/20 to-cyan-400/20',
  },
  {
    icon: TrendingUp,
    title: 'Expanda Seus Negócios',
    description: 'Aumente sua visibilidade, encontre novos clientes e faça sua empresa crescer exponencialmente.',
    stats: '300%',
    statsLabel: 'mais visibilidade',
    color: 'from-purple-500 to-pink-400',
    bgPattern: 'bg-gradient-to-br from-purple-500/20 to-pink-400/20',
  },
  {
    icon: Shield,
    title: 'Ambiente Seguro',
    description: 'Plataforma verificada com profissionais autenticados, avaliações reais e transações protegidas.',
    stats: '99.8%',
    statsLabel: 'de satisfação',
    color: 'from-emerald-500 to-teal-400',
    bgPattern: 'bg-gradient-to-br from-emerald-500/20 to-teal-400/20',
  },
  {
    icon: Heart,
    title: 'Comunidade Ativa',
    description: 'Participe de discussões, compartilhe experiências e aprenda com outros profissionais.',
    stats: '50+',
    statsLabel: 'posts diários',
    color: 'from-rose-500 to-pink-400',
    bgPattern: 'bg-gradient-to-br from-rose-500/20 to-pink-400/20',
  },
  {
    icon: Star,
    title: 'Oportunidades Exclusivas',
    description: 'Acesse workshops, eventos e oportunidades de negócio disponíveis apenas para membros.',
    stats: '100+',
    statsLabel: 'eventos mensais',
    color: 'from-amber-500 to-orange-400',
    bgPattern: 'bg-gradient-to-br from-amber-500/20 to-orange-400/20',
  },
];

export function RegisterCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentData = carouselData[currentSlide];

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden w-full"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 h-[35vh]"
          >
            {/* Icon */}
            <div className="relative place-self-center">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${currentData.color} rounded-3xl flex items-center justify-center shadow-2xl shadow-black/20`}
              >
                {React.createElement(currentData.icon, { className: 'w-10 h-10 text-white' })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">{currentData.title}</h2>
              <p className="text-xl text-white/80 leading-relaxed">{currentData.description}</p>
            </div>

            {/* Stats */}
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${currentData.color} bg-clip-text text-transparent`}
                >
                  {currentData.stats}
                </div>
                <div className="text-sm text-white/70 font-medium">{currentData.statsLabel}</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/70 font-medium">Ativo agora</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-32">
          <button
            onClick={prevSlide}
            className="group w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-3">
            {carouselData.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className="relative group">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/60 group-hover:scale-110'
                  }`}
                />
                {index === currentSlide && (
                  <div className="absolute inset-0 w-3 h-3 bg-white/30 rounded-full animate-ping" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="group w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-white/60 to-white/40"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear', repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      )}
    </div>
  );
}
