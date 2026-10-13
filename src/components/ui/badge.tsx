import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "danger" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-glamea-primary text-white border-transparent",
    secondary: "bg-glamea-secondary text-glamea-primary border-transparent",
    outline: "text-glamea-primary border-glamea-primary border",
    success: "bg-glamea-success text-white border-transparent",
    danger: "bg-glamea-danger text-white border-transparent",
    warning: "bg-amber-100 text-amber-800 border-transparent", // basic default warning colors
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-glamea-primary focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
