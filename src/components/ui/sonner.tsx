"use client"

import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors={false}
      expand={true}
      duration={2000}
      icons={{
        success: <CheckCircle className="h-5 w-5" />,
        error: <XCircle className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",

          success:
            "group-[.toaster]:!bg-background group-[.toaster]:!text-green-600 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-green-600",
          error:
            "group-[.toaster]:!bg-background group-[.toaster]:!text-red-600 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-red-600",
          warning:
            "group-[.toaster]:!bg-background group-[.toaster]:!text-amber-500 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-amber-500",
          info: "group-[.toaster]:!bg-background group-[.toaster]:!text-blue-500 group-[.toaster]:!border-l-4 group-[.toaster]:!border-l-blue-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
