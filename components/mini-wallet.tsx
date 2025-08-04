"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  Minimize2,
  RefreshCw,
  Send,
  Wallet,
} from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

// Definindo TOKENS para corresponder ao serviço de swap (mocked for UI display)
const TOKENS = [
  {
    address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003",
    symbol: "WLD",
    name: "Worldcoin",
    decimals: 18,
    logo: "/placeholder.svg?height=32&width=32",
    color: "#000000",
  },
  {
    address: "0x834a73c0a83F3BCe349A116FFB2A4c2d1C651E45",
    symbol: "TPF",
    name: "TPulseFi",
    decimals: 18,
    logo: "/placeholder.svg?height=32&width=32",
    color: "#00D4FF",
  },
  {
    address: "0xEdE54d9c024ee80C85ec0a75eD2d8774c7Fbac9B",
    symbol: "WDD",
    name: "Drachma",
    decimals: 18,
    logo: "/placeholder.svg?height=32&width=32",
    color: "#FFD700",
  },
  {
    address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logo: "/placeholder.svg?height=32&width=32",
    color: "#2775CA",
  },
  {
    address: "0x5fa570E9c8514cdFaD81DB6ce0A327D55251fBD4",
    symbol: "KPP",
    name: "KeplerPay",
    decimals: 18,
    logo: "/placeholder.svg?height=32&width=32",
    color: "#6A0DAD",
  },
]

interface TokenBalance {
  symbol: string
  name: string
  address: string
  balance: string
  decimals: number
  icon?: string
  formattedBalance: string
}

interface Transaction {
  id: string
  type: "sent" | "received"
  token: string
  amount: string
  address: string
  status: "pending" | "confirmed" | "failed"
  timestamp: number
  hash: string
}

interface MiniWalletProps {
  walletAddress?: string // Made optional for mocking
}

// Supported languages
const SUPPORTED_LANGUAGES = ["en", "pt", "es", "id"] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

// Translations for mini wallet
const translations = {
  en: {
    connected: "Connected",
    tokens: "Tokens",
    send: "Send",
    receive: "Receive",
    history: "History",
    swap: "Swap",
    back: "Back",
    sendTokens: "Send Tokens",
    receiveTokens: "Receive Tokens",
    swapTokens: "Swap Tokens",
    transactionHistory: "Transaction History",
    tokenDetails: "Token Details",
    currentPrice: "Current Price",
    priceChange24h: "24h Change",
    priceChart: "Price Chart",
    token: "Token",
    amount: "Amount",
    recipientAddress: "Recipient Address",
    sending: "Sending...",
    swapping: "Swapping...",
    loadingPrice: "Loading price...",
    yourWalletAddress: "Your Wallet Address:",
    networkWarning: "Only send Worldchain network supported tokens to this address.",
    sendWarning:
      "Only send assets supported by the Worldchain network, do not send to exchanges, your sending may result in loss of assets",
    sendSuccess: "Successfully sent",
    sendFailed: "Send failed",
    swapSuccess: "Successfully swapped",
    swapFailed: "Swap failed",
    copyAddress: "Copy Address",
    minimize: "Minimize",
    disconnect: "Disconnect",
    refreshBalances: "Refresh Balances",
    available: "Available",
    noTransactions: "No recent transactions",
    sent: "Sent",
    received: "Received",
    pending: "Pending",
    confirmed: "Confirmed",
    failed: "Failed",
    viewOnExplorer: "View on Explorer",
    loadMore: "Load More",
    loading: "Loading...",
    from: "From",
    to: "To",
    getQuote: "Get Quote",
    gettingQuote: "Getting Quote...",
    youWillReceive: "You will receive",
    priceImpact: "Price Impact",
    swapRate: "Swap Rate",
    selectToken: "Select Token",
    enterAmount: "Enter amount to see quote",
    quoteError: "Failed to get quote",
    insufficientBalance: "Insufficient balance",
    networkError: "Network error",
    tryAgain: "Try again",
    priceUnavailable: "Price data unavailable",
    refreshPrice: "Refresh Price",
  },
  pt: {
    connected: "Conectado",
    tokens: "Tokens",
    send: "Enviar",
    receive: "Receber",
    history: "Histórico",
    swap: "Trocar",
    back: "Voltar",
    sendTokens: "Enviar Tokens",
    receiveTokens: "Receber Tokens",
    swapTokens: "Trocar Tokens",
    transactionHistory: "Histórico de Transações",
    tokenDetails: "Detalhes do Token",
    currentPrice: "Preço Atual",
    priceChange24h: "Mudança 24h",
    priceChart: "Gráfico de Preço",
    token: "Token",
    amount: "Quantidade",
    recipientAddress: "Endereço do Destinatário",
    sending: "Enviando...",
    swapping: "Trocando...",
    loadingPrice: "Carregando preço...",
    yourWalletAddress: "Seu Endereço da Carteira:",
    networkWarning: "Apenas envie para o seu endereço tokens suportados da rede Worldchain.",
    sendWarning:
      "Apenas envia ativos suportados pela rede Worldchain, não envie para exchanges, o seu envio poderá significar a perda dos ativos",
    sendSuccess: "Enviado com sucesso",
    sendFailed: "Falha no envio",
    swapSuccess: "Trocado com sucesso",
    swapFailed: "Falha na troca",
    copyAddress: "Copiar Endereço",
    minimize: "Minimizar",
    disconnect: "Desconectar",
    refreshBalances: "Atualizar Saldos",
    available: "Disponível",
    noTransactions: "Sem transações recentes",
    sent: "Enviado",
    received: "Recibido",
    pending: "Pendente",
    confirmed: "Confirmado",
    failed: "Falhou",
    viewOnExplorer: "Ver no Explorer",
    loadMore: "Carregar Mais",
    loading: "Carregando...",
    from: "De",
    to: "Para",
    getQuote: "Obter Cotação",
    gettingQuote: "Obtendo Cotação...",
    youWillReceive: "Você receberá",
    priceImpact: "Impacto no Preço",
    swapRate: "Taxa de Troca",
    selectToken: "Selecionar Token",
    enterAmount: "Digite o valor para ver a cotação",
    quoteError: "Falha ao obter cotação",
    insufficientBalance: "Saldo insuficiente",
    networkError: "Erro de rede",
    tryAgain: "Tente novamente",
    priceUnavailable: "Dados de preço indisponíveis",
    refreshPrice: "Atualizar Preço",
  },
  es: {
    connected: "Conectado",
    tokens: "Tokens",
    send: "Enviar",
    receive: "Recibir",
    history: "Historial",
    swap: "Intercambiar",
    back: "Volver",
    sendTokens: "Enviar Tokens",
    receiveTokens: "Recibir Tokens",
    swapTokens: "Intercambiar Tokens",
    transactionHistory: "Historial de Transacciones",
    tokenDetails: "Detalles del Token",
    currentPrice: "Precio Actual",
    priceChange24h: "Cambio 24h",
    priceChart: "Gráfico de Precio",
    token: "Token",
    amount: "Cantidad",
    recipientAddress: "Dirección del Destinatario",
    sending: "Enviando...",
    swapping: "Intercambiando...",
    loadingPrice: "Cargando precio...",
    yourWalletAddress: "Tu Dirección de Billetera:",
    networkWarning: "Solo envía tokens soportados por la red Worldchain a esta dirección.",
    sendWarning:
      "Solo envía activos soportados por la red Worldchain, no envíes a exchanges, tu envío podría resultar en la pérdida de activos",
    sendSuccess: "Enviado exitosamente",
    sendFailed: "Envío fallido",
    swapSuccess: "Intercambiado exitosamente",
    swapFailed: "Intercambio fallido",
    copyAddress: "Copiar Dirección",
    minimize: "Minimizar",
    disconnect: "Desconectar",
    refreshBalances: "Actualizar Saldos",
    available: "Disponible",
    noTransactions: "Sin transacciones recientes",
    sent: "Enviado",
    received: "Recibido",
    pending: "Pendente",
    confirmed: "Confirmado",
    failed: "Falló",
    viewOnExplorer: "Ver en Explorer",
    loadMore: "Cargar Más",
    loading: "Cargando...",
    from: "Desde",
    to: "Hacia",
    getQuote: "Obtener Cotización",
    gettingQuote: "Obteniendo Cotización...",
    youWillReceive: "Recibirás",
    priceImpact: "Impacto en el Precio",
    swapRate: "Tasa de Intercambio",
    selectToken: "Seleccionar Token",
    enterAmount: "Ingresa cantidad para ver cotización",
    quoteError: "Error al obtener cotización",
    insufficientBalance: "Saldo insuficiente",
    networkError: "Error de red",
    tryAgain: "Intentar de nuevo",
    priceUnavailable: "Datos de precio no disponibles",
    refreshPrice: "Actualizar Precio",
  },
  id: {
    connected: "Terhubung",
    tokens: "Token",
    send: "Kirim",
    receive: "Terima",
    history: "Riwayat",
    swap: "Tukar",
    back: "Kembali",
    sendTokens: "Kirim Token",
    receiveTokens: "Terima Token",
    swapTokens: "Tukar Token",
    transactionHistory: "Riwayat Transaksi",
    tokenDetails: "Detail Token",
    currentPrice: "Harga Saat Ini",
    priceChange24h: "Perubahan 24j",
    priceChart: "Grafik Harga",
    token: "Token",
    amount: "Jumlah",
    recipientAddress: "Alamat Penerima",
    sending: "Mengirim...",
    swapping: "Menukar...",
    loadingPrice: "Memuat harga...",
    yourWalletAddress: "Alamat Dompet Anda:",
    networkWarning: "Hanya kirim token yang didukung jaringan Worldchain ke alamat ini.",
    sendWarning:
      "Hanya kirim aset yang didukung oleh jaringan Worldchain, jangan kirim ke exchange, pengiriman Anda dapat mengakibatkan kehilangan aset",
    sendSuccess: "Berhasil dikirim",
    sendFailed: "Pengiriman gagal",
    swapSuccess: "Berhasil ditukar",
    swapFailed: "Penukaran gagal",
    copyAddress: "Salin Alamat",
    minimize: "Minimalkan",
    disconnect: "Putuskan",
    refreshBalances: "Perbarui Saldo",
    available: "Tersedia",
    noTransactions: "Tidak ada transaksi terbaru",
    sent: "Dikirim",
    received: "Diterima",
    pending: "Tertunda",
    confirmed: "Dikonfirmasi",
    failed: "Gagal",
    viewOnExplorer: "Lihat di Explorer",
    loadMore: "Muat Lebih Banyak",
    loading: "Memuat...",
    from: "Dari",
    to: "Ke",
    getQuote: "Dapatkan Kutipan",
    gettingQuote: "Mendapatkan Kutipan...",
    youWillReceive: "Anda akan menerima",
    priceImpact: "Dampak Harga",
    swapRate: "Tingkat Tukar",
    selectToken: "Pilih Token",
    enterAmount: "Masukkan jumlah untuk melihat kutipan",
    quoteError: "Gagal mendapatkan kutipan",
    insufficientBalance: "Saldo tidak mencuciente",
    networkError: "Kesalahan jaringan",
    tryAgain: "Coba lagi",
    priceUnavailable: "Data harga tidak tersedia",
    refreshPrice: "Perbarui Harga",
  },
}

type ViewMode = "main" | "send" | "receive" | "history" | "swap"

export default function MiniWallet({ walletAddress = "0xMockWalletAddress1234567890abcdef" }: MiniWalletProps) {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>("en")
  const [viewMode, setViewMode] = useState<ViewMode>("main")
  const [copied, setCopied] = useState(false)
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false)
  const [sendForm, setSendForm] = useState({
    token: "TPF",
    amount: "",
    recipient: "",
  })
  const [swapForm, setSwapForm] = useState({
    tokenFrom: "WLD",
    tokenTo: "TPF",
    amountFrom: "",
    amountTo: "",
  })
  const [sending, setSending] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [gettingQuote, setGettingQuote] = useState(false)
  const [swapQuote, setSwapQuote] = useState<any>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)

  const TRANSACTIONS_PER_PAGE = 5

  // Load saved language
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language") as SupportedLanguage
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setCurrentLang(savedLanguage)
    }
  }, [])

  // Get translations for current language
  const t = translations[currentLang]

  const formatAddress = useCallback((address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  const copyAddress = useCallback(() => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [walletAddress])

  // Mocked loadBalances
  const loadBalances = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Mock data for balances
      const mockBalances: TokenBalance[] = [
        {
          symbol: "WLD",
          name: "Worldcoin",
          address: "0x...",
          balance: "100.5",
          decimals: 18,
          formattedBalance: "100.50",
        },
        {
          symbol: "TPF",
          name: "TPulseFi",
          address: "0x...",
          balance: "500.25",
          decimals: 18,
          formattedBalance: "500.25",
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          address: "0x...",
          balance: "75.123456",
          decimals: 6,
          formattedBalance: "75.123456",
        },
        { symbol: "WDD", name: "Drachma", address: "0x...", balance: "0", decimals: 18, formattedBalance: "0" },
        {
          symbol: "KPP",
          name: "KeplerPay",
          address: "0x...",
          balance: "123.45",
          decimals: 18,
          formattedBalance: "123.45",
        },
      ]
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      setBalances(mockBalances)
    } catch (error) {
      setError("Failed to load balances (mocked)")
    } finally {
      setLoading(false)
    }
  }, [])

  // Mocked loadTransactionHistory
  const loadTransactionHistory = useCallback(
    async (reset = false) => {
      try {
        if (reset) {
          setLoadingHistory(true)
          setCurrentPage(0)
          setDisplayedTransactions([])
        } else {
          setLoadingMore(true)
        }

        // Mock data for transactions
        const mockTransactions: Transaction[] = [
          {
            id: "1",
            type: "sent",
            token: "WLD",
            amount: "10",
            address: "0xabc...def",
            status: "confirmed",
            timestamp: Date.now() - 3600000,
            hash: "0xmockhash1",
          },
          {
            id: "2",
            type: "received",
            token: "TPF",
            amount: "50",
            address: "0xdef...ghi",
            status: "confirmed",
            timestamp: Date.now() - 7200000,
            hash: "0xmockhash2",
          },
          {
            id: "3",
            type: "sent",
            token: "USDC",
            amount: "5",
            address: "0xghi...jkl",
            status: "pending",
            timestamp: Date.now() - 1800000,
            hash: "0xmockhash3",
          },
          {
            id: "4",
            type: "received",
            token: "WLD",
            amount: "20",
            address: "0xjkl...mno",
            status: "confirmed",
            timestamp: Date.now() - 10800000,
            hash: "0xmockhash4",
          },
          {
            id: "5",
            type: "sent",
            token: "TPF",
            amount: "100",
            address: "0xopq...rst",
            status: "failed",
            timestamp: Date.now() - 14400000,
            hash: "0xmockhash5",
          },
          {
            id: "6",
            type: "received",
            token: "USDC",
            amount: "10",
            address: "0xuvw...xyz",
            status: "confirmed",
            timestamp: Date.now() - 18000000,
            hash: "0xmockhash6",
          },
          {
            id: "7",
            type: "sent",
            token: "WLD",
            amount: "2",
            address: "0x123...456",
            status: "pending",
            timestamp: Date.now() - 21600000,
            hash: "0xmockhash7",
          },
        ]

        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

        setAllTransactions(mockTransactions)

        const newDisplayCount = (currentPage + 1) * TRANSACTIONS_PER_PAGE
        const newDisplayed = mockTransactions.slice(0, Math.min(mockTransactions.length, newDisplayCount))

        setDisplayedTransactions(newDisplayed)
        setHasMoreTransactions(mockTransactions.length > newDisplayCount)
      } catch (error) {
        // console.error("❌ Error loading transaction history:", error) // Removed verbose log
      } finally {
        setLoadingHistory(false)
        setLoadingMore(false)
      }
    },
    [currentPage],
  )

  const loadMoreTransactions = useCallback(async () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)

    const newDisplayCount = (nextPage + 1) * TRANSACTIONS_PER_PAGE

    if (allTransactions.length >= newDisplayCount) {
      const newDisplayed = allTransactions.slice(0, newDisplayCount)
      setDisplayedTransactions(newDisplayed)
      setHasMoreTransactions(allTransactions.length > newDisplayCount)
    } else {
      await loadTransactionHistory(false)
    }
  }, [allTransactions, currentPage, loadTransactionHistory])

  const refreshBalances = useCallback(async () => {
    setRefreshing(true)
    await loadBalances()
    setRefreshing(false)
  }, [loadBalances])

  // Mocked handleSend
  const handleSend = useCallback(async () => {
    if (!sendForm.amount || !sendForm.recipient) return

    setSending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay
      const success = Math.random() > 0.2 // 80% success rate for mock

      if (success) {
        alert(`✅ ${t.sendSuccess} ${sendForm.amount} ${sendForm.token}!`)
        setViewMode("main")
        setSendForm({ token: "TPF", amount: "", recipient: "" })
        await refreshBalances()
        await loadTransactionHistory(true)
      } else {
        alert(`❌ ${t.sendFailed}: Mocked error`)
      }
    } catch (error) {
      console.error("❌ Send error (mocked):", error)
      alert(`❌ ${t.sendFailed}. ${t.tryAgain}`)
    } finally {
      setSending(false)
    }
  }, [sendForm, t.sendSuccess, t.sendFailed, t.tryAgain, refreshBalances, loadTransactionHistory])

  // Mocked getSwapQuote
  const getSwapQuote = useCallback(
    async (amountFrom: string, tokenFromSymbol: string, tokenToSymbol: string) => {
      if (
        !amountFrom ||
        Number.parseFloat(amountFrom) <= 0 ||
        isNaN(Number.parseFloat(amountFrom)) ||
        tokenFromSymbol === tokenToSymbol
      ) {
        setSwapQuote(null)
        setSwapForm((prev) => ({ ...prev, amountTo: "" }))
        setQuoteError(null)
        return
      }

      setGettingQuote(true)
      setQuoteError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

        const mockQuote = {
          outAmount: (Number.parseFloat(amountFrom) * 0.98).toString(), // Simulate 2% slippage
          data: "0xmockdata",
          to: "0xmockcontract",
          value: "0",
        }
        setSwapQuote(mockQuote)
        setSwapForm((prev) => ({
          ...prev,
          amountTo: (Number.parseFloat(amountFrom) * 0.98).toFixed(6),
        }))
      } catch (error) {
        setQuoteError(t.quoteError)
        setSwapQuote(null)
        setSwapForm((prev) => ({ ...prev, amountTo: "" }))
      } finally {
        setGettingQuote(false)
      }
    },
    [t.quoteError],
  )

  // Auto-quote effect with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (swapForm.amountFrom && swapForm.tokenFrom && swapForm.tokenTo) {
        getSwapQuote(swapForm.amountFrom, swapForm.tokenFrom, swapForm.tokenTo)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [swapForm.amountFrom, swapForm.tokenFrom, swapForm.tokenTo, getSwapQuote])

  // Mocked handleSwap
  const handleSwap = useCallback(async () => {
    if (!swapQuote || !swapForm.amountFrom || !swapForm.tokenFrom || !swapForm.tokenTo) return

    setSwapping(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500)) // Simulate network delay
      const success = Math.random() > 0.2 // 80% success rate for mock

      if (success) {
        alert(
          `✅ ${t.swapSuccess} ${swapForm.amountFrom} ${swapForm.tokenFrom} for ${swapForm.amountTo} ${swapForm.tokenTo}!`,
        )
        setViewMode("main")
        setSwapForm({
          tokenFrom: "WLD",
          tokenTo: "TPF",
          amountFrom: "",
          amountTo: "",
        })
        setSwapQuote(null)
        await refreshBalances()
        await loadTransactionHistory(true)
      } else {
        alert(`❌ ${t.swapFailed}: Mocked error`)
      }
    } catch (error) {
      console.error("❌ Swap error (mocked):", error)
      alert(`❌ ${t.swapFailed}. ${t.tryAgain}`)
    } finally {
      setSwapping(false)
    }
  }, [swapQuote, swapForm, t.swapSuccess, t.swapFailed, t.tryAgain, refreshBalances, loadTransactionHistory])

  const handleBackToMain = useCallback(() => {
    setViewMode("main")
    setSendForm({ token: "TPF", amount: "", recipient: "" })
    setSwapForm({
      tokenFrom: "WLD",
      tokenTo: "TPF",
      amountFrom: "",
      amountTo: "",
    })
    setSwapQuote(null)
    setQuoteError(null)
  }, [])

  const openTransactionInExplorer = useCallback((hash: string) => {
    // Mocked explorer URL
    const explorerUrl = `https://explorer.worldchain.com/tx/${hash}`
    window.open(explorerUrl, "_blank")
  }, [])

  const formatTimestamp = useCallback((timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400"
      case "pending":
        return "text-yellow-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }, [])

  useEffect(() => {
    if (walletAddress) {
      loadBalances()
      loadTransactionHistory(true)
    }
  }, [walletAddress, loadBalances, loadTransactionHistory])

  const formatBalance = useCallback((balance: string): string => {
    const num = Number.parseFloat(balance)
    if (num === 0) return "0"
    if (num < 0.000001) return "<0.000001" // Show more precision for very small amounts
    if (num < 1) return num.toFixed(6) // Show up to 6 decimal places for numbers less than 1
    if (num < 1000) return num.toFixed(2) // Keep 2 decimal places for numbers between 1 and 1000
    if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
    return `${(num / 1000000).toFixed(1)}M`
  }, [])

  const getTokenIcon = useCallback((symbol: string) => {
    const token = TOKENS.find((t) => t.symbol === symbol)
    return token?.logo || "/placeholder.svg?height=32&width=32"
  }, [])

  const getTokenColor = useCallback((symbol: string) => {
    const token = TOKENS.find((t) => t.symbol === symbol)
    return token?.color || "#00D4FF"
  }, [])

  const handleSwapTokens = useCallback(() => {
    setSwapForm((prev) => ({
      ...prev,
      tokenFrom: prev.tokenTo,
      tokenTo: prev.tokenFrom,
      amountFrom: prev.amountTo, // Swap amounts too for better UX
      amountTo: prev.amountFrom,
    }))
    setSwapQuote(null) // Clear quote as tokens changed
    setQuoteError(null)
  }, [setSwapForm, setSwapQuote, setQuoteError])

  if (isMinimized) {
    return (
      <>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-gray-100/60 to-gray-200/60 backdrop-blur-xl border border-gray-300/50 rounded-full p-3 shadow-lg fixed top-20 right-4 z-40"
        >
          <button onClick={() => setIsMinimized(false)} className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-gray-700" />
            <span className="text-gray-800 text-sm font-medium">{formatAddress(walletAddress)}</span>
          </button>
        </motion.div>
      </>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="bg-gradient-to-br from-gray-50 to-gray-200 backdrop-blur-xl border border-gray-300 rounded-2xl shadow-lg ring-1 ring-gray-200 min-w-[320px] max-w-[380px] overflow-hidden fixed top-20 right-4 z-40"
      >
        <AnimatePresence mode="wait">
          {/* Main View */}
          {viewMode === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-3"
            >
              {/* Banner de Promoção */}
              <Image
                src="/placeholder.svg?height=100&width=350"
                alt="Swap Reward Prize Pool Banner"
                width={175} // Metade da largura original
                height={50} // Metade da altura original
                className="w-full rounded-lg mb-4"
                priority={true}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-xs">{t.connected}</p>
                    <p className="text-gray-400 text-[10px]">{formatAddress(walletAddress)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={copyAddress}
                    className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-200"
                    title={t.copyAddress}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-200"
                    title="Minimize to icon"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                  {/* Disconnect button removed as per "tira as dependencias" */}
                </div>
              </div>

              {/* Balances Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowBalances(!showBalances)}
                      className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors"
                    >
                      {showBalances ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span className="text-gray-800 text-xs font-medium">{t.tokens}</span>
                    </button>
                  </div>
                  <button
                    onClick={refreshBalances}
                    disabled={refreshing}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    title={t.refreshBalances}
                  >
                    <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {showBalances && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 max-h-[200px] overflow-y-auto pr-1"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center py-4">
                          <RefreshCw className="w-4 h-4 text-gray-400 animate-spin mr-2" />
                          <span className="text-gray-400 text-sm">{t.loading}</span>
                        </div>
                      ) : error ? (
                        <div className="flex items-center justify-center py-4">
                          <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                          <span className="text-red-400 text-sm">{error}</span>
                        </div>
                      ) : balances.filter((token) => Number.parseFloat(token.balance) > 0).length === 0 ? (
                        <div className="text-center py-4">
                          <span className="text-gray-400 text-sm">No tokens found</span>
                        </div>
                      ) : (
                        balances
                          .filter((token) => Number.parseFloat(token.balance) > 0) // Filter out zero balance tokens
                          .map((token, index) => {
                            return (
                              <motion.button
                                key={token.symbol}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl p-2 hover:bg-gray-200 transition-all duration-200 group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex items-center justify-center">
                                      <img
                                        src={getTokenIcon(token.symbol) || "/placeholder.svg"}
                                        alt={token.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <p className="text-gray-800 font-medium text-xs text-left">{token.symbol}</p>
                                      <p className="text-gray-500 text-[10px] text-left">{token.name}</p>
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col items-end">
                                    <p className="text-gray-800 font-medium text-xs">
                                      {showBalances ? formatBalance(token.balance) : "••••"}
                                    </p>
                                  </div>
                                </div>
                              </motion.button>
                            )
                          })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Actions */}
              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setViewMode("send")}
                    className="flex flex-col items-center justify-center space-y-1 py-1.5 px-1.5 bg-gray-200/50 hover:bg-gray-300/50 border border-gray-300/50 rounded-lg transition-all duration-200 text-gray-800 hover:text-gray-900"
                  >
                    <Send className="w-3 h-3" />
                    <span className="text-xs font-medium">{t.send}</span>
                  </button>
                  <button
                    onClick={() => setViewMode("receive")}
                    className="flex flex-col items-center justify-center space-y-1 py-1.5 px-1.5 bg-gray-200/50 hover:bg-gray-300/50 border border-gray-300/50 rounded-lg transition-all duration-200 text-gray-800 hover:text-gray-900"
                  >
                    <ArrowDownLeft className="w-3 h-3" />
                    <span className="text-xs font-medium">{t.receive}</span>
                  </button>
                  <button
                    onClick={() => setViewMode("swap")}
                    className="flex flex-col items-center justify-center space-y-1 py-1.5 px-1.5 bg-gray-200/50 hover:bg-gray-300/50 border border-gray-300/50 rounded-lg transition-all duration-200 text-gray-800 hover:text-gray-900"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span className="text-xs font-medium">{t.swap}</span>
                  </button>
                  <button
                    onClick={() => setViewMode("history")}
                    className="flex flex-col items-center justify-center space-y-1 py-1.5 px-1.5 bg-gray-200/50 hover:bg-gray-300/50 border border-gray-300/50 rounded-lg transition-all duration-200 text-gray-800 hover:text-gray-900"
                  >
                    <History className="w-3 h-3" />
                    <span className="text-xs font-medium">{t.history}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Send View */}
          {viewMode === "send" && (
            <motion.div
              key="send"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handleBackToMain}
                  className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.back}</span>
                </button>
                <h3 className="font-semibold text-gray-800">{t.sendTokens}</h3>
                <div className="w-6"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">{t.token}</label>
                  <select
                    value={sendForm.token}
                    onChange={(e) =>
                      setSendForm((prev) => ({
                        ...prev,
                        token: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-cyan-400"
                  >
                    {balances.map((token) => (
                      <option key={token.symbol} value={token.symbol} className="bg-gray-50 text-gray-800">
                        {token.symbol} ({t.available}: {formatBalance(token.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">{t.amount}</label>
                  <input
                    type="number"
                    value={sendForm.amount}
                    onChange={(e) =>
                      setSendForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">{t.recipientAddress}</label>
                  <input
                    type="text"
                    value={sendForm.recipient}
                    onChange={(e) =>
                      setSendForm((prev) => ({
                        ...prev,
                        recipient: e.target.value,
                      }))
                    }
                    placeholder="0x..."
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-800 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-xs">{t.sendWarning}</p>
                  </div>
                </div>

                <button
                  onClick={handleSend}
                  disabled={sending || !sendForm.amount || !sendForm.recipient}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:opacity-50 text-gray-800 font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>{t.sending}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>{t.send}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Receive View */}
          {viewMode === "receive" && (
            <motion.div
              key="receive"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handleBackToMain}
                  className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.back}</span>
                </button>
                <h3 className="font-semibold text-gray-800">{t.receiveTokens}</h3>
                <div className="w-6"></div>
              </div>

              <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-32 h-32 mx-auto bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">QR Code</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-800 text-sm mb-2">{t.yourWalletAddress}</p>
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 break-all">
                    <p className="text-gray-800 text-sm font-mono">{walletAddress}</p>
                  </div>
                  <button
                    onClick={copyAddress}
                    className="mt-2 flex items-center justify-center space-x-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{t.copyAddress}</span>
                  </button>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-xs">{t.networkWarning}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Swap View */}
          {viewMode === "swap" && (
            <motion.div
              key="swap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handleBackToMain}
                  className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.back}</span>
                </button>
                <h3 className="font-semibold text-gray-800">{t.swapTokens}</h3>
                <div className="w-6"></div>
              </div>

              <div className="space-y-4">
                {/* From Token Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">{t.from}</label>
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={getTokenIcon(swapForm.tokenFrom) || "/placeholder.svg"}
                          alt={swapForm.tokenFrom}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                          }}
                        />
                        <select
                          value={swapForm.tokenFrom}
                          onChange={(e) =>
                            setSwapForm((prev) => ({
                              ...prev,
                              tokenFrom: e.target.value,
                              amountTo: "",
                              amountFrom: "",
                            }))
                          }
                          className="bg-transparent text-gray-800 font-medium focus:outline-none"
                        >
                          {TOKENS.map((token) => (
                            <option key={token.symbol} value={token.symbol} className="bg-gray-50 text-gray-800">
                              {token.symbol}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">
                          {t.available}: {balances.find((b) => b.symbol === swapForm.tokenFrom)?.balance || "0"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={swapForm.amountFrom}
                      onChange={(e) =>
                        setSwapForm((prev) => ({
                          ...prev,
                          amountFrom: e.target.value,
                        }))
                      }
                      placeholder="0.00"
                      className="w-full bg-transparent text-gray-800 text-lg font-medium focus:outline-none"
                    />
                  </div>
                </div>

                {/* Swap Arrow Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSwapTokens}
                    className="p-2 bg-gray-300/50 hover:bg-gray-400/50 transition-colors text-gray-800"
                    title="Swap tokens"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                {/* To Token Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">{t.to}</label>
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={getTokenIcon(swapForm.tokenTo) || "/placeholder.svg"}
                        alt={swapForm.tokenTo}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                        }}
                      />
                      <select
                        value={swapForm.tokenTo}
                        onChange={(e) =>
                          setSwapForm((prev) => ({
                            ...prev,
                            tokenTo: e.target.value,
                            amountTo: "",
                            amountFrom: "",
                          }))
                        }
                        className="bg-transparent text-gray-800 font-medium focus:outline-none"
                      >
                        {TOKENS.map((token) => (
                          <option key={token.symbol} value={token.symbol} className="bg-gray-50 text-gray-800">
                            {token.symbol}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-gray-800 text-lg font-medium">
                      {gettingQuote ? (
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span className="text-gray-500">{t.gettingQuote}</span>
                        </div>
                      ) : swapForm.amountTo ? (
                        swapForm.amountTo
                      ) : (
                        <span className="text-gray-600">{t.enterAmount}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quote Error */}
                {quoteError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-xs">{quoteError}</p>
                    </div>
                  </div>
                )}

                {/* Swap Button */}
                <button
                  onClick={handleSwap}
                  disabled={
                    swapping ||
                    !swapForm.amountFrom ||
                    !swapForm.amountTo ||
                    !swapQuote ||
                    gettingQuote ||
                    !!quoteError ||
                    swapForm.tokenFrom === swapForm.tokenTo
                  }
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:opacity-50 text-gray-800 font-medium py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {swapping ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.swapping}</span>
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="w-4 h-4" />
                      <span>{t.swap}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* History View */}
          {viewMode === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handleBackToMain}
                  className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.back}</span>
                </button>
                <h3 className="font-semibold text-gray-800">{t.transactionHistory}</h3>
                <div className="w-6"></div>
              </div>

              <div className="space-y-3">
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-4">
                    <RefreshCw className="w-4 h-4 text-gray-400 animate-spin mr-2" />
                    <span className="text-gray-400 text-sm">{t.loading}</span>
                  </div>
                ) : displayedTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">{t.noTransactions}</p>
                  </div>
                ) : (
                  <>
                    {displayedTransactions.map((tx, index) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-100 border border-gray-300 rounded-lg p-3 hover:bg-gray-200 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              tx.type === "sent" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {tx.type === "sent" ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium text-sm">
                              {tx.type === "sent" ? t.sent : t.received} {tx.token}
                            </p>
                            <p className="text-gray-500 text-xs">{formatAddress(tx.address)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-800 font-medium text-sm">
                            {tx.type === "sent" ? "-" : "+"}
                            {tx.amount}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs ${getStatusColor(tx.status)}`}>
                              {tx.status === "confirmed" ? t.confirmed : tx.status === "pending" ? t.pending : t.failed}
                            </span>
                            <button
                              onClick={() => openTransactionInExplorer(tx.hash)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title={t.viewOnExplorer}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">{formatTimestamp(tx.timestamp)}</div>
                      </motion.div>
                    ))}

                    {hasMoreTransactions && (
                      <button
                        onClick={loadMoreTransactions}
                        disabled={loadingMore}
                        className="w-full bg-gray-300/50 hover:bg-gray-400/70 disabled:opacity-50 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        {loadingMore ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{t.loading}</span>
                          </>
                        ) : (
                          <span>{t.loadMore}</span>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
