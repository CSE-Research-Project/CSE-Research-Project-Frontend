"use client"

import { useState } from "react"
import { predictNextWeekOpen, getOhlcvSnapshot, type OhlcvSnapshot } from "@/lib/fakeApi"
import { usePredictStore } from "@/stores/usePredictStore"
import { TickerSearch } from "@/components/ticker-search"
import { ConfidenceBadge } from "@/components/confidence-badge"
import { ChartCard } from "@/components/chart-card"
import { ForecastLineChart } from "@/components/forecast-line-chart"
import { DeltaBarChart } from "@/components/delta-bar-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export default function PredictPage() {
  const { inputs, output, loading, setInputs, setOutput, setLoading } = usePredictStore()
  const [snapshot, setSnapshot] = useState<OhlcvSnapshot | null>(null)
  const { toast } = useToast()

  const handleSearch = (company: any) => {
    setInputs({ symbol: company.symbol })
    setSnapshot(null)
    setOutput(null)
  }

  const handlePredict = async () => {
    if (!inputs.symbol) {
      toast({ title: "Error", description: "Please select a stock", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      // Get OHLCV snapshot
      const snap = await getOhlcvSnapshot(inputs.symbol)
      setSnapshot(snap)

      // Run prediction
      const result = await predictNextWeekOpen(inputs.symbol)
      setOutput(result)
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate prediction", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Next Week Open Price Prediction</h1>
        <p className="text-muted-foreground">AI-powered forecast for next week's opening prices</p>
      </div>

      {/* Input Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Prediction Configuration</CardTitle>
          <CardDescription>Select a stock to generate a prediction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Stock Selection</label>
            <TickerSearch onSelect={handleSearch} placeholder="Search for a stock..." />
          </div>

          {/* Market Snapshot */}
          {snapshot && (
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium">Latest Market Snapshot</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-muted/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Open</p>
                  <p className="text-sm font-semibold">{snapshot.open.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">High</p>
                  <p className="text-sm font-semibold">{snapshot.high.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Low</p>
                  <p className="text-sm font-semibold">{snapshot.low.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Close</p>
                  <p className="text-sm font-semibold">{snapshot.close.toFixed(2)}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="text-sm font-semibold">{(snapshot.volume / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handlePredict} disabled={!inputs.symbol || loading} className="w-full md:w-auto">
            {loading ? "Generating Prediction..." : "Predict Next Week Open"}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {output && (
        <>
          {/* Prediction Summary Card */}
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-2xl">{output.symbol}</CardTitle>
              <CardDescription>AI Prediction for Next Week's Opening</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Today's Open</p>
                  <p className="text-3xl font-bold text-foreground">{output.openToday.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">LKR</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Predicted Open (Day 5)</p>
                  <p className="text-3xl font-bold text-green-600">{output.predOpenTplus5.toFixed(2)}</p>
                  <p className="text-xs text-green-600">
                    +{(output.predOpenTplus5 - output.openToday).toFixed(2)} (
                    {(((output.predOpenTplus5 - output.openToday) / output.openToday) * 100).toFixed(2)}%)
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                    <ConfidenceBadge confidence={output.confidence} />
                  </div>
                </div>
              </div>

              {/* Comparison Bar Chart */}
              <div className="pt-4 space-y-2">
                <p className="text-sm font-medium">Baseline vs Predicted</p>
                <div className="h-16 flex items-end gap-4">
                  <div className="flex-1 bg-blue-500/20 rounded" style={{ height: "40%" }}></div>
                  <div className="flex-1 bg-green-500/20 rounded" style={{ height: "80%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Baseline (Flat)</span>
                  <span>Predicted Path</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Forecast Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="7-Day Forecast Line Chart" description="Predicted vs Baseline price movements">
              <ForecastLineChart
                forecastData={output.forecastPoints}
                baselineData={output.baselinePoints}
                title="Next Week Outlook"
              />
            </ChartCard>

            <ChartCard title="Price Delta / Change" description="Daily price difference from today">
              <DeltaBarChart deltaData={output.deltaPoints} />
            </ChartCard>
          </div>

          {/* Predicted Path Sparkline */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Trend Indicator</CardTitle>
              <CardDescription>Predicted price movement over 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={output.forecastPoints} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                    <XAxis
                      dataKey="day"
                      stroke="var(--color-muted-foreground)"
                      label={{ value: "Day", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis stroke="var(--color-muted-foreground)" hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                      }}
                      formatter={(value: number) => `LKR ${value.toFixed(2)}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* How This Works */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">"How This Works" Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  This prediction model uses machine learning trained on historical CSE stock data. It analyzes patterns
                  in opening prices, trading volume, volatility, and market returns to forecast the most likely opening
                  price for the next trading week.
                </p>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  <strong>Important Disclaimer:</strong> This is NOT financial advice. Predictions are based on
                  historical patterns and may not reflect future market conditions. CSE data is delayed. Always consult
                  with a qualified financial advisor before making investment decisions.
                </p>
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="features">
                  <AccordionTrigger>Model Features (Collapsible)</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">The model uses the following features:</p>
                      <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>open_price
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>high_price
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>low_price
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>close_price
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>prev_close
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>share_volume
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>ret_1
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>gap_1
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>co_ret
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>hl_pct
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>log_vol
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>ret_mean_5
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>ret_std_5
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>ret_mean_20
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>ret_std_20
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>vol_mean_20
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>vol_std_20
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>dow
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty State */}
      {!output && !loading && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">
              Select a stock and click "Predict Next Week Open" to see the forecast
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
