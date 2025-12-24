import { create } from "zustand"
import type { RiskResult } from "@/lib/fakeApi"

interface RiskInputs {
  symbol: string
  dateRange: { start: string; end: string }
  riskProfile: "Basic" | "Intermediate" | "Advanced"
}

interface RiskStore {
  inputs: RiskInputs
  results: RiskResult | null
  loading: boolean
  error: string | null
  setInputs: (inputs: RiskInputs) => void
  setResults: (results: RiskResult | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useRiskStore = create<RiskStore>((set) => ({
  inputs: {
    symbol: "",
    dateRange: { start: "", end: "" },
    riskProfile: "Basic",
  },
  results: null,
  loading: false,
  error: null,
  setInputs: (inputs) => set({ inputs }),
  setResults: (results) => set({ results }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
