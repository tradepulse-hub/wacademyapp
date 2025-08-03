"use client"

import { useState, useEffect } from "react"

export const XP_PER_LEVEL = 100 // XP necessário para cada nível - Exportado

export function useXP() {
  const [totalXP, setTotalXP] = useState(0.0)
  const [claimedLevel, setClaimedLevel] = useState(1) // Nível que o usuário reivindicou

  // Carregar XP e nível reivindicado do localStorage ao montar
  useEffect(() => {
    const storedTotalXP = localStorage.getItem("worldAcademyTotalXP")
    const storedClaimedLevel = localStorage.getItem("worldAcademyClaimedLevel")

    if (storedTotalXP) {
      setTotalXP(Number.parseFloat(storedTotalXP))
    }
    if (storedClaimedLevel) {
      setClaimedLevel(Number.parseInt(storedClaimedLevel, 10))
    } else {
      // Se claimedLevel não estiver armazenado, derive-o do totalXP
      // Isso lida com casos onde totalXP pode ser > 100 mas o nível ainda é 1
      const derivedLevel = Math.floor(Number.parseFloat(storedTotalXP || "0") / XP_PER_LEVEL) + 1
      setClaimedLevel(derivedLevel)
    }
  }, [])

  // Salvar XP e nível reivindicado no localStorage sempre que eles mudarem
  useEffect(() => {
    localStorage.setItem("worldAcademyTotalXP", totalXP.toString())
    localStorage.setItem("worldAcademyClaimedLevel", claimedLevel.toString())
  }, [totalXP, claimedLevel])

  const addXP = (amount: number) => {
    setTotalXP((prevXP) => prevXP + amount)
  }

  // Calcula o XP para o nível atual reivindicado
  const xpForCurrentLevel = totalXP - (claimedLevel - 1) * XP_PER_LEVEL
  const xpPercentage = (xpForCurrentLevel / XP_PER_LEVEL) * 100

  // Determina se um nível pode ser reivindicado
  const canClaimLevelUp = xpForCurrentLevel >= XP_PER_LEVEL

  const claimLevelUp = () => {
    if (canClaimLevelUp) {
      setClaimedLevel((prevLevel) => prevLevel + 1)
      // totalXP permanece como está, a porcentagem visual será "resetada" devido ao incremento de claimedLevel
    }
  }

  return {
    totalXP,
    level: claimedLevel, // Renomeado para 'level' para uso externo
    xpPercentage, // Esta é a porcentagem dentro do nível atual
    addXP,
    canClaimLevelUp,
    claimLevelUp,
  }
}
