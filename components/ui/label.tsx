"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
)

type LabelIndicator = "required" | "optional" | "none"

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    required?: boolean
    optional?: boolean
    indicator?: LabelIndicator
  }

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, required, optional, indicator, htmlFor, ...props }, ref) => {
  const [inferredIndicator, setInferredIndicator] = React.useState<LabelIndicator>("none")

  React.useEffect(() => {
    if (indicator || required || optional || !htmlFor) return

    const control = document.getElementById(htmlFor)

    if (
      control instanceof HTMLInputElement ||
      control instanceof HTMLTextAreaElement ||
      control instanceof HTMLSelectElement
    ) {
      setInferredIndicator(control.required || control.getAttribute("aria-required") === "true" ? "required" : "optional")
    }
  }, [htmlFor, indicator, optional, required])

  const resolvedIndicator: LabelIndicator =
    indicator ?? (required ? "required" : optional ? "optional" : inferredIndicator)

  return (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), "inline-flex items-center gap-1", className)} htmlFor={htmlFor} {...props}>
      {children}
      {resolvedIndicator === "required" && (
        <span className="font-semibold text-destructive" aria-label="obrigatório">
          *
        </span>
      )}
      {resolvedIndicator === "optional" && (
        <span className="text-xs font-normal text-muted-foreground/70" aria-label="opcional">
          (opcional)
        </span>
      )}
    </LabelPrimitive.Root>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
