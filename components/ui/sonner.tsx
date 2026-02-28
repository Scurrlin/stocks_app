"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover) !important",
          "--normal-text": "var(--popover-foreground) !important",
          "--normal-border": "var(--border) !important",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          description: "!text-current",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
