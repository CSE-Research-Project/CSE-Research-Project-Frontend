"use client"

import { useEffect, useState } from "react"
import { getWatchlist, type WatchlistItem } from "@/lib/fakeApi"
import { KpiCard } from "@/components/kpi-card"
import { DataTable } from "@/components/data-table"
import { RiskBadge } from "@/components/risk-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWatchlist = async () => {
      const data = await getWatchlist()
      setWatchlist(data)
      setLoading(false)
    }
    fetchWatchlist()
  }, [])

  const columns = [
    { key: "symbol", label: "Symbol" },
    { key: "name", label: "Name" },
    { key: "lastClose", label: "Last Close (LKR)", format: (v: number) => `${v.toFixed(2)}` },
    { key: "volume", label: "Volume", format: (v: number) => (v / 1000000).toFixed(1) + "M" },
    {
      key: "return1d",
      label: "1D Return",
      format: (v: number) => (
        <span className={v >= 0 ? "text-green-600" : "text-red-600"}>
          {v >= 0 ? "+" : ""}
          {v.toFixed(2)}%
        </span>
      ),
    },
    {
      key: "return5d",
      label: "5D Return",
      format: (v: number) => (
        <span className={v >= 0 ? "text-green-600" : "text-red-600"}>
          {v >= 0 ? "+" : ""}
          {v.toFixed(2)}%
        </span>
      ),
    },
    { key: "riskLevel", label: "Risk", format: (v: string) => <RiskBadge level={v as any} /> },
  ]

  const totalPortfolioValue = watchlist.reduce((sum, item) => sum + item.lastClose * 100, 0)
  const avgReturn =
    watchlist.length > 0 ? watchlist.reduce((sum, item) => sum + item.return1d, 0) / watchlist.length : 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's your portfolio overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Portfolio Value"
          value={`${(totalPortfolioValue / 1000000).toFixed(1)}M`}
          description="LKR"
          loading={loading}
        />
        <KpiCard
          label="Weekly P/L"
          value="+245,500"
          description="LKR"
          trend={{ value: 2.5, isPositive: true }}
          loading={loading}
        />
        <KpiCard label="Risk Score" value="42/100" description="Medium Risk" loading={loading} />
        <KpiCard label="Volatility (20D)" value="18.45%" trend={{ value: -1.2, isPositive: true }} loading={loading} />
        <KpiCard label="Max Drawdown" value="-12.34%" loading={loading} />
      </div>

      {/* Watchlist & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Your Watchlist</CardTitle>
              <CardDescription>Track your favorite stocks</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={watchlist} loading={loading} />
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar insights */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Top Movers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                watchlist
                  .sort((a, b) => b.return1d - a.return1d)
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.symbol} className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="font-semibold">{item.symbol}</span>
                      <span className="text-green-600 font-bold">+{item.return1d.toFixed(2)}%</span>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">High Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                watchlist
                  .filter((item) => item.riskLevel === "high")
                  .slice(0, 2)
                  .map((item) => (
                    <div key={item.symbol} className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="font-semibold">{item.symbol}</span>
                      <RiskBadge level="high" />
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Disclaimer */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> This platform is for informational purposes only. All data is delayed by CSE.
            This is not financial advice. Always consult with a qualified financial advisor before making investment
            decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
