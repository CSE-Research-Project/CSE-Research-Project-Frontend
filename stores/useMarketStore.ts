import { create } from "zustand"

interface MarketStore {
  watchlist: Array<{
    symbol: string
    name: string
    lastClose: number
    volume: number
    return1d: number
    return5d: number
    riskLevel: "low" | "medium" | "high"
  }>
  selectedSymbol: string | null
  searchQuery: string
  setWatchlist: (watchlist: any[]) => void
  setSelectedSymbol: (symbol: string | null) => void
  setSearchQuery: (query: string) => void
}

export const useMarketStore = create<MarketStore>((set) => ({
  watchlist: [],
  selectedSymbol: null,
  searchQuery: "",
  setWatchlist: (watchlist) => set({ watchlist }),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
