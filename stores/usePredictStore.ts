import { create } from "zustand"
import type { PredictionResult } from "@/lib/fakeApi"

interface PredictInputs {
  symbol: string
}

interface PredictStore {
  inputs: PredictInputs
  output: PredictionResult | null
  loading: boolean
  error: string | null
  setInputs: (inputs: PredictInputs) => void
  setOutput: (output: PredictionResult | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const usePredictStore = create<PredictStore>((set) => ({
  inputs: { symbol: "" },
  output: null,
  loading: false,
  error: null,
  setInputs: (inputs) => set({ inputs }),
  setOutput: (output) => set({ output }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}))
