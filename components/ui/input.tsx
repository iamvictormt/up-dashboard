import * as React from 'react';

import { cn } from '@/lib/utils';

// default: superfícies escuras (tema global), com espaço para ícone nas laterais.
// light: cartões e modais claros (creme/branco). Sobrescreve só cor, borda, padding e altura.
const lightInput =
  'h-11 px-3 rounded-xl border-[#511A2B]/20 bg-white/80 text-[#511A2B] placeholder:text-[#511A2B]/50 focus:border-[#511A2B]/40 focus-visible:ring-[#511A2B]/20';

type InputProps = React.ComponentProps<'input'> & { variant?: 'default' | 'light' };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-11 pr-11 h-12',
          variant === 'light' && lightInput,
          className
        )}
        ref={ref}
        autoComplete="new-password"
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
