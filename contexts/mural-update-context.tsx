"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface MuralUpdateContextType {
  updateCount: number
  triggerUpdate: () => void
}

const MuralUpdateContext = createContext<MuralUpdateContextType>({
  updateCount: 0,
  triggerUpdate: () => {},
})

export function MuralUpdateProvider({ children }: { children: React.ReactNode }) {
  const [updateCount, setUpdateCount] = useState(0)

  const triggerUpdate = useCallback(() => {
    console.log("veio aqui")
    setUpdateCount((prev) => prev + 1)
  }, [])

  return <MuralUpdateContext.Provider value={{ updateCount, triggerUpdate }}>{children}</MuralUpdateContext.Provider>
}

export const useMuralUpdate = () => useContext(MuralUpdateContext)
