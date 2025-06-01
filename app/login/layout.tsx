import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"

export const metadata: Metadata = {
  title: "UP Connection",
  description: "Faça login ou cadastre-se na UP Connection",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>{children}</>
  )
}
