import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface KpiCardProps {
  label: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  loading?: boolean
}

export function KpiCard({ label, value, description, trend, loading }: KpiCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        ) : (
          <>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {description && <CardDescription className="mt-1 text-xs">{description}</CardDescription>}
            {trend && (
              <div
                className={`mt-2 inline-block rounded px-2 py-1 text-xs font-medium ${trend.isPositive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
