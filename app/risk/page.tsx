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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function RiskAnalysisPage() {
  const { inputs, results, loading, setInputs, setResults, setLoading } = useRiskStore()
  const [snapshot, setSnapshot] = useState<OhlcvSnapshot | null>(null)
  const { toast } = useToast()

  const handleSearch = (company: any) => {
    setInputs({ ...inputs, symbol: company.symbol })
    setSnapshot(null)
    setResults(null)
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
            <TickerSearch onSelect={handleSearch} placeholder="Search for a stock..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Profile</label>
              <Select value={inputs.riskProfile} onValueChange={(v) => setInputs({ ...inputs, riskProfile: v as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAnalyze} disabled={!inputs.symbol || loading} className="w-full md:w-auto">
            {loading ? "Running Analysis..." : "Run Risk Analysis"}
          </Button>
        </CardContent>
      </Card>

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

          {/* Accordion */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="explanation">
                  <AccordionTrigger>Risk Analysis Explanation</AccordionTrigger>
                  <AccordionContent className="space-y-3">
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
                          <strong>Beta:</strong> Measure of volatility relative to the market ({">"} 1 = more volatile)
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

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
      {!results && !loading && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">Select a stock and run the analysis to see results</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
