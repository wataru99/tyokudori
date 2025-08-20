"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

// Temporary basic checkbox implementation until @radix-ui/react-checkbox is installed
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string
    onCheckedChange?: (checked: boolean) => void
  }
>(({ className, checked, onChange, onCheckedChange, ...props }, ref) => {
  // Map onCheckedChange to onChange if provided
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked)
    } else if (onChange) {
      onChange(e)
    }
  }, [onChange, onCheckedChange])

  return (
    <div className="relative">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={handleChange}
        readOnly={!onChange && !onCheckedChange}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-white checked:bg-primary checked:border-primary",
          className
        )}
        {...props}
      />
      {checked && (
        <Check className="h-3 w-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }