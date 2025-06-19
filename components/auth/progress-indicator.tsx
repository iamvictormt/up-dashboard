'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  steps: number;
  currentStep: number;
  title: string;
}

export function ProgressIndicator({ steps, currentStep, title }: ProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground">
          Etapa {currentStep} de {steps}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length: steps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                      ? 'bg-green-100 text-green-600 border-2 border-green-600'
                      : 'bg-slate-100 text-slate-400'
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </motion.div>

              {index < steps - 1 && (
                <div
                  className={`
                    w-8 h-0.5 mx-2 transition-colors duration-300
                    ${isCompleted ? 'bg-green-600' : 'bg-slate-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
