"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/mural")
  }, [router])

  return (
    <div className="min-h-screen bg-[#FFEDC1] w-full flex items-center justify-center">
      <div className="animate-pulse text-[#511A2B]">Redirecionando...</div>
    </div>
  )
}
