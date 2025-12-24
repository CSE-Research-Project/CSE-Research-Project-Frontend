// TODO: Replace fakeApi with real backend endpoints

import companiesData from "@/data/mock/companies.json"
import watchlistData from "@/data/mock/watchlist.json"
import ohlcvData from "@/data/mock/ohlcv_snapshot.json"
import riskResultData from "@/data/mock/risk_result.json"
import predictionResultData from "@/data/mock/prediction_result.json"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export interface Company {
  symbol: string
  name: string
  sector: string
}

export interface WatchlistItem {
  symbol: string
  name: string
  lastClose: number
  volume: number
  return1d: number
  return5d: number
  riskLevel: "low" | "medium" | "high"
}

export interface OhlcvSnapshot {
  symbol: string
  name: string
  open: number
  high: number
  low: number
  close: number
  prevClose: number
  volume: number
  date: string
}

export interface RiskMetrics {
  var95: number
  cvar: number
  beta: number
  volatility20d: number
  sharpeRatio: number
  maxDrawdown: number
}

export interface RiskResult {
  symbol: string
  asofDate: string
  riskMetrics: RiskMetrics
  drawdownData: Array<{ day: number; drawdown: number }>
  volatilityData: Array<{ day: number; volatility: number }>
  returnsData: Array<{ range: string; count: number }>
}

export interface PredictionResult {
  symbol: string
  asofDate: string
  openToday: number
  predOpenTplus5: number
  confidence: "low" | "medium" | "high"
  forecastPoints: Array<{ day: number; price: number }>
  baselinePoints: Array<{ day: number; price: number }>
  deltaPoints: Array<{ day: number; deltaPrice: number; deltaPct: number }>
}

export const searchTickers = async (query: string): Promise<Company[]> => {
  await delay(300)
  const q = query.toLowerCase()
  return companiesData.companies.filter((c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
}

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  await delay(400)
  return watchlistData.watchlist
}

export const getOhlcvSnapshot = async (symbol: string): Promise<OhlcvSnapshot | null> => {
  await delay(300)
  const data = (ohlcvData as any)[symbol]
  return data || null
}

export const runRiskAnalysis = async (
  symbol: string,
  _dateRange: { start: string; end: string },
  _riskProfile: string,
): Promise<RiskResult> => {
  await delay(1000)
  return {
    ...riskResultData,
    symbol,
  }
}

export const predictNextWeekOpen = async (symbol: string): Promise<PredictionResult> => {
  await delay(1200)
  return {
    ...predictionResultData,
    symbol,
  }
}
