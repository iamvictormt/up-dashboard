'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-[#46142b] text-white shadow-lg hover:bg-[#46142b]/90 hover:shadow-xl hover:shadow-[#46142b]/20 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-[#F5B13D] text-white shadow-lg hover:bg-[#F5B13D]/90 hover:shadow-xl hover:shadow-[#F5B13D]/20 hover:scale-[1.02] active:scale-[0.98] font-semibold",
        accent:
          "bg-[#d56235] text-white shadow-lg hover:bg-[#e06d3e] hover:shadow-xl hover:shadow-[#d56235]/20 hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-[#d01c2a] text-white shadow-lg hover:bg-[#dc2633] hover:shadow-xl hover:shadow-[#d01c2a]/20 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border-2 border-[#6c2144] bg-transparent text-[#6c2144] hover:bg-[#6c2144] hover:text-white shadow-sm hover:shadow-md",
        ghost: "text-[#6c2144] hover:bg-[#6c2144]/10 hover:text-[#6c2144]",
        gradient:
          "bg-gradient-to-r from-[#6c2144] to-[#d56235] text-white shadow-lg hover:from-[#7d2650] hover:to-[#e06d3e] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        golden:
          "bg-gradient-to-r from-[#ffc560] to-[#d56235] text-white shadow-lg hover:from-[#ffb84d] hover:to-[#e06d3e] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] font-semibold",
      },
      size: {
        xs: "h-6 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : icon ? (
            icon
          ) : null}
          {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
