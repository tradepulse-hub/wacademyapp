"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth" // Importar useAuth
import { claimAirdrop, getAirdropStatus } from "@/lib/airdropService" // Importar funções de airdrop
import { toast } from "@/hooks/use-toast" // Para notificações

export const XP_PER_LEVEL = 100 // XP necessário para cada nível - Exportado

export function useXP() {
  const [totalXP, setTotalXP] = useState(0.0)
  const [claimedLevel, setClaimedLevel] = useState(1) // Nível que o usuário reivindicou
  const [isClaimingAirdrop, setIsClaimingAirdrop] = useState(false)
  const [airdropStatus, setAirdropStatus] = useState<any>(null) // Status do airdrop
  const { isAuthenticated, walletAddress } = useAuth() // Obter estado da carteira

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
      const derivedLevel = Math.floor(Number.parseFloat(storedTotalXP || "0") / XP_PER_LEVEL) + 1
      setClaimedLevel(derivedLevel)
    }
  }, [])

  // Salvar XP e nível reivindicado no localStorage sempre que eles mudarem
  useEffect(() => {
    localStorage.setItem("worldAcademyTotalXP", totalXP.toString())
    localStorage.setItem("worldAcademyClaimedLevel", claimedLevel.toString())
  }, [totalXP, claimedLevel])

  // Função para buscar o status do airdrop
  const fetchAirdropStatus = useCallback(async () => {
    if (isAuthenticated && walletAddress) {
      const status = await getAirdropStatus(walletAddress)
      setAirdropStatus(status)
      console.log("Airdrop Status:", status)
    } else {
      setAirdropStatus(null)
    }
  }, [isAuthenticated, walletAddress])

  // Buscar status do airdrop ao montar e quando o estado da carteira mudar
  useEffect(() => {
    fetchAirdropStatus()
    // Adicionar listener para o evento de atualização de saldo
    window.addEventListener("tpf_balance_updated", fetchAirdropStatus)
    return () => {
      window.removeEventListener("tpf_balance_updated", fetchAirdropStatus)
    }
  }, [fetchAirdropStatus])

  const addXP = (amount: number) => {
    // Corrigido: Adiciona a quantidade total de XP sem redução
    setTotalXP((prevXP) => prevXP + amount)
  }

  const xpForCurrentLevel = totalXP - (claimedLevel - 1) * XP_PER_LEVEL
  const xpPercentage = (xpForCurrentLevel / XP_PER_LEVEL) * 100

  // Determina se um nível pode ser reivindicado (baseado em XP)
  const canClaimLevelUpXP = xpForCurrentLevel >= XP_PER_LEVEL

  // Função para reivindicar o airdrop (agora integrada com o contrato)
  const claimLevelUp = useCallback(async () => {
    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Erro",
        description: "Por favor, conecte sua carteira para reivindicar recompensas.",
        variant: "destructive",
      })
      return
    }

    if (!airdropStatus || !airdropStatus.canClaim) {
      let message = "Você não pode reivindicar o airdrop agora."
      if (airdropStatus?.isBlocked) {
        message = "Seu endereço está bloqueado para reivindicar airdrops."
      } else if (airdropStatus?.claimsToday >= airdropStatus?.maxDailyClaims) {
        message = `Você atingiu o limite diário de ${airdropStatus.maxDailyClaims} reivindicações.`
      }
      toast({
        title: "Erro na Reivindicação",
        description: message,
        variant: "destructive",
      })
      return
    }

    setIsClaimingAirdrop(true)
    try {
      const result = await claimAirdrop(walletAddress)
      if (result.success) {
        toast({
          title: "Reivindicação de Airdrop Bem-Sucedida!",
          description: `Você reivindicou ${airdropStatus.airdropAmount} WAY tokens. Tx ID: ${result.txId}`,
          variant: "default",
        })
        // Após o airdrop, o nível de XP local ainda pode ser incrementado se o XP for suficiente
        if (canClaimLevelUpXP) {
          setClaimedLevel((prevLevel) => prevLevel + 1)
        }
        fetchAirdropStatus() // Atualizar status do airdrop
      } else {
        toast({
          title: "Erro na Reivindicação",
          description: result.error || "Falha ao reivindicar o airdrop.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Erro ao reivindicar airdrop:", error)
      toast({
        title: "Erro Inesperado",
        description: error.message || "Ocorreu um erro ao tentar reivindicar o airdrop.",
        variant: "destructive",
      })
    } finally {
      setIsClaimingAirdrop(false)
    }
  }, [isAuthenticated, walletAddress, airdropStatus, canClaimLevelUpXP, fetchAirdropStatus])

  return {
    totalXP,
    level: claimedLevel,
    xpPercentage,
    addXP,
    canClaimLevelUp: canClaimLevelUpXP && airdropStatus?.canClaim, // Só pode reivindicar se tiver XP e puder fazer airdrop
    claimLevelUp,
    isClaimingAirdrop,
    airdropStatus,
  }
}
