"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ForecastPoint {
  day: number
  price: number
}

interface ForecastLineChartProps {
  forecastData: ForecastPoint[]
  baselineData: ForecastPoint[]
  title?: string
}

export function ForecastLineChart({ forecastData, baselineData, title }: ForecastLineChartProps) {
  // Merge data by day
  const mergedData = forecastData.map((f) => {
    const baseline = baselineData.find((b) => b.day === f.day)
    return {
      day: `Day +${f.day}`,
      predicted: f.price,
      baseline: baseline?.price || f.price,
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mergedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
        <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
          cursor={{ stroke: "var(--color-border)" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Predicted Path"
        />
        <Line
          type="monotone"
          dataKey="baseline"
          stroke="#8884d8"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 4 }}
          name="Baseline Path"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
