import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border/50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive/20",
        outline: "border border-border text-foreground bg-card hover:bg-accent hover:text-accent-foreground",
        success: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
        info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }