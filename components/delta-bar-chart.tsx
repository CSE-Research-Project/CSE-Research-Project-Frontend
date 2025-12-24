"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DeltaPoint {
  day: number
  deltaPrice: number
  deltaPct: number
}

interface DeltaBarChartProps {
  deltaData: DeltaPoint[]
}

export function DeltaBarChart({ deltaData }: DeltaBarChartProps) {
  const data = deltaData.map((d) => ({
    day: `Day +${d.day}`,
    delta: d.deltaPrice,
    deltaPct: d.deltaPct,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
        <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
        <YAxis stroke="var(--color-muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
          cursor={{ fill: "var(--color-muted)" }}
          formatter={(value: number) => [`LKR ${value.toFixed(2)}`, "Price Change"]}
        />
        <Bar dataKey="delta" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
