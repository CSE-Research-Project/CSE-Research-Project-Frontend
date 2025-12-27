"use client"

import { useState } from "react"
import { runRiskAnalysis, getOhlcvSnapshot, type OhlcvSnapshot } from "@/lib/fakeApi"
import { useRiskStore } from "@/stores/useRiskStore"
import { TickerSearch } from "@/components/ticker-search"
import { KpiCard } from "@/components/kpi-card"
import { ChartCard } from "@/components/chart-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Building2, TrendingUp, TrendingDown, Activity } from "lucide-react"

// Mock data generator for financial ratios
const generateFinancialData = (years: number[]) => {
  return years.map(year => ({
    year: year.toString(),
    workingCapital: Math.random() * 500000 + 200000,
    netProfit: Math.random() * 300000 + 100000,
    margin: Math.random() * 30 + 10,
    workingCapitalRatio: Math.random() * 2 + 1,
    currentRatio: Math.random() * 2.5 + 1
  }))
}

// Mock company info generator
const getMockCompanyInfo = (symbol: string) => {
  const companies: Record<string, any> = {
    "ASPI": { name: "Asia Pacific Wire & Cable Corporation PLC", industry: "Manufacturing", marketCap: "LKR 1.8B", employees: "850", founded: "1998" },
    "DIMO": { name: "Dimo Holdings Limited", industry: "Auto & Components", marketCap: "LKR 3.2B", employees: "1,500", founded: "1993" },
    "DIALOG": { name: "Dialog Axiata PLC", industry: "Telecommunications", marketCap: "LKR 125B", employees: "3,200", founded: "1995" },
    "SLTL": { name: "Sri Lanka Telecom Limited", industry: "Telecommunications", marketCap: "LKR 45B", employees: "2,100", founded: "1991" },
    "COMB": { name: "Colombo Commercial Warehousing Company PLC", industry: "Trading", marketCap: "LKR 2.1B", employees: "650", founded: "2000" },
    "MTL": { name: "Melstacorp Limited", industry: "Manufacturing", marketCap: "LKR 8.5B", employees: "2,800", founded: "1990" },
    "CARSONS": { name: "Carsons Cumberbatch PLC", industry: "Trading", marketCap: "LKR 15B", employees: "4,500", founded: "1844" },
    "SOFTLOGIC": { name: "Softlogic Holdings PLC", industry: "Retail", marketCap: "LKR 12B", employees: "3,800", founded: "1991" }
  }
  return companies[symbol] || { name: symbol, industry: "Technology", marketCap: "LKR 2.5B", employees: "1,250", founded: "2008" }
}

// Mock 3-month health forecast generator
const getMockHealthForecast = () => {
  const statuses = ["Excellent", "Healthy", "Good", "Fair"]
  const trends = ["positive", "negative"]
  return {
    status: statuses[Math.floor(Math.random() * 2)], // Mostly positive
    trend: trends[Math.floor(Math.random() * trends.length)],
    confidence: Math.floor(Math.random() * 15) + 75 // 75-90%
  }
}

export default function RiskAnalysisPage() {
  const { inputs, results, loading, setInputs, setResults, setLoading } = useRiskStore()
  const [snapshot, setSnapshot] = useState<OhlcvSnapshot | null>(null)
  const [selectedRatio, setSelectedRatio] = useState<string>("workingCapital")
  const [yearRange, setYearRange] = useState<string>("2020-2025")
  const [showFinancialHealth, setShowFinancialHealth] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [healthForecast, setHealthForecast] = useState<any>(null)
  const { toast } = useToast()

  // Generate financial data based on selected year range
  const getYearsFromRange = (range: string) => {
    const [start, end] = range.split("-").map(Number)
    const years = []
    for (let i = start; i <= end; i++) {
      years.push(i)
    }
    return years
  }

  const financialData = generateFinancialData(getYearsFromRange(yearRange))

  const handleSearch = (company: any) => {
    setInputs({ ...inputs, symbol: company.symbol })
    setSnapshot(null)
    setResults(null)
    setShowFinancialHealth(true)
    setCompanyInfo(getMockCompanyInfo(company.symbol))
    setHealthForecast(getMockHealthForecast())
  }

  const handleAnalyze = async () => {
    if (!inputs.symbol) {
      toast({ title: "Error", description: "Please select a stock", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // Get OHLCV snapshot
      const snap = await getOhlcvSnapshot(inputs.symbol)
      setSnapshot(snap)

      // Run risk analysis
      const result = await runRiskAnalysis(inputs.symbol, inputs.dateRange, inputs.riskProfile)
      setResults(result)
    } catch (error) {
      toast({ title: "Error", description: "Failed to run analysis", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getRatioLabel = (ratio: string) => {
    const labels: Record<string, string> = {
      workingCapital: "Working Capital",
      netProfit: "Net Profit",
      margin: "Margin (%)",
      workingCapitalRatio: "Working Capital Ratio",
      currentRatio: "Current Ratio"
    }
    return labels[ratio] || ratio
  }

  const getHealthScore = () => {
    // Mock calculation - score out of 6
    return 4.5
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 5) return "text-green-600 dark:text-green-400"
    if (score >= 3.5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Financial Risk Analysis</h1>
        <p className="text-muted-foreground">Analyze portfolio risk metrics and volatility trends</p>
      </div>

      {/* Input Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Analysis Configuration</CardTitle>
          <CardDescription>Select a stock and configure your risk analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Stock Selection</label>
            <TickerSearch onSelect={handleSearch} placeholder="Search for a company..." />
          </div>

          <Button onClick={handleAnalyze} disabled={!inputs.symbol || loading} className="w-full md:w-auto">
            {loading ? "Running Analysis..." : "Run Risk Analysis"}
          </Button>
        </CardContent>
      </Card>

      {/* Company Financial Health - Show after search */}
      {showFinancialHealth && inputs.symbol && (
        <>
          {/* Company Basic Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-semibold">{companyInfo?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <p className="text-sm font-semibold">{companyInfo?.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Market Cap</p>
                  <p className="text-sm font-semibold">{companyInfo?.marketCap}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Employees</p>
                  <p className="text-sm font-semibold">{companyInfo?.employees}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="text-sm font-semibold">{companyInfo?.founded}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Health Forecast */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Company Next 3 Month Financial Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-2xl font-bold flex items-center gap-2">
                    {healthForecast?.status}
                    {healthForecast?.trend === "positive" ? (
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Confidence: {healthForecast?.confidence}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Forecast Period</p>
                  <p className="text-sm font-semibold">Jan 2026 - Mar 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>


                    {/* Risk Analysis Explanation */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Risk Analysis Explanation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1">What these metrics mean:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    <strong>VaR (Value at Risk):</strong> Maximum loss expected with 95% confidence over a given
                    period
                  </li>
                  <li>
                    <strong>CVaR:</strong> Average loss when VaR is exceeded, providing tail risk insight
                  </li>
                  <li>
                    <strong>Beta:</strong> Measure of volatility relative to the market ({">"}  1 = more volatile)
                  </li>
                  <li>
                    <strong>Volatility:</strong> Standard deviation of returns, indicating price fluctuation
                  </li>
                  <li>
                    <strong>Sharpe Ratio:</strong> Risk-adjusted return metric (higher is better)
                  </li>
                  <li>
                    <strong>Max Drawdown:</strong> Largest percentage decline from peak to trough
                  </li>
                </ul>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  <strong>Disclaimer:</strong> This analysis is based on historical data and mock calculations.
                  Not financial advice. Consult a qualified advisor.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Financial Ratios Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Financial Ratios Analysis</CardTitle>
              <CardDescription>Historical trends of key financial metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Ratio</label>
                  <Select value={selectedRatio} onValueChange={setSelectedRatio}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workingCapital">Working Capital</SelectItem>
                      <SelectItem value="netProfit">Net Profit</SelectItem>
                      <SelectItem value="margin">Margin</SelectItem>
                      <SelectItem value="workingCapitalRatio">Working Capital Ratio</SelectItem>
                      <SelectItem value="currentRatio">Current Ratio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Time Period</label>
                  <Select value={yearRange} onValueChange={setYearRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2012-2025">2012 - 2025</SelectItem>
                      <SelectItem value="2015-2025">2015 - 2025</SelectItem>
                      <SelectItem value="2020-2025">2020 - 2025</SelectItem>
                      <SelectItem value="2022-2025">2022 - 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                    <XAxis
                      dataKey="year"
                      stroke="var(--color-muted-foreground)"
                      label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      label={{ value: getRatioLabel(selectedRatio), angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                      }}
                      formatter={(value: any) => {
                        if (selectedRatio === 'margin') return `${value.toFixed(2)}%`
                        if (selectedRatio.includes('Ratio')) return value.toFixed(2)
                        return `LKR ${value.toFixed(0)}`
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={selectedRatio}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name={getRatioLabel(selectedRatio)}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Company Health Check Score */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Company Health Check</CardTitle>
              <CardDescription>Overall financial health assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Score Display */}
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Health Score</p>
                  <p className={`text-6xl font-bold ${getHealthScoreColor(getHealthScore())}`}>
                    {getHealthScore().toFixed(1)}
                    <span className="text-2xl text-muted-foreground">/6.0</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {getHealthScore() >= 5 ? "Excellent" : getHealthScore() >= 3.5 ? "Good" : "Needs Improvement"}
                  </p>
                </div>

                {/* Health Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">0.9/1.0</p>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '90%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Profitability</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">0.8/1.0</p>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '80%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Solvency</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">0.7/1.0</p>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">0.8/1.0</p>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '80%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Growth</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">0.6/1.0</p>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Market Position</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">0.7/1.0</p>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Snapshot Card */}
          {snapshot && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Market Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Open</p>
                    <p className="text-lg font-semibold">{snapshot.open.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">High</p>
                    <p className="text-lg font-semibold">{snapshot.high.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Low</p>
                    <p className="text-lg font-semibold">{snapshot.low.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Close</p>
                    <p className="text-lg font-semibold">{snapshot.close.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Volume</p>
                    <p className="text-lg font-semibold">{(snapshot.volume / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risk Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              label="Value at Risk (95%)"
              value={`LKR ${results.riskMetrics.var95.toFixed(2)}`}
              description="Maximum expected loss"
            />
            <KpiCard
              label="Conditional VaR"
              value={`LKR ${results.riskMetrics.cvar.toFixed(2)}`}
              description="Expected loss beyond VaR"
            />
            <KpiCard label="Beta" value={results.riskMetrics.beta.toFixed(2)} description="Market correlation" />
            <KpiCard
              label="Volatility (20D)"
              value={`${results.riskMetrics.volatility20d.toFixed(2)}%`}
              description="Price variation"
            />
            <KpiCard
              label="Sharpe Ratio"
              value={results.riskMetrics.sharpeRatio.toFixed(2)}
              description="Risk-adjusted return"
            />
            <KpiCard
              label="Max Drawdown"
              value={`${results.riskMetrics.maxDrawdown.toFixed(2)}%`}
              description="Peak-to-trough decline"
              trend={{ value: Math.abs(results.riskMetrics.maxDrawdown), isPositive: false }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Drawdown Curve" description="Historical peak-to-trough decline">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.drawdownData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line type="monotone" dataKey="drawdown" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Rolling Volatility (20D)" description="Volatility trend over time">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.volatilityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Line type="monotone" dataKey="volatility" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Returns Distribution" description="Frequency of returns in different ranges">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.returnsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                <XAxis dataKey="range" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Export Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => toast({ title: "Coming soon", description: "PDF export" })}>
              Export as PDF
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Coming soon", description: "CSV export" })}>
              Export as CSV
            </Button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!showFinancialHealth && !results && !loading && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">Select a stock and run the analysis to see results</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
