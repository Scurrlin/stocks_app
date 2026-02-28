"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "#f0f0f0",
          "--normal-text": "#000000",
          "--normal-border": "#d4d4d4",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
