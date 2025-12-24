interface RiskBadgeProps {
  level: "low" | "medium" | "high"
  className?: string
}

export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  const styles = {
    low: "bg-green-500/10 text-green-700 dark:text-green-400",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    high: "bg-red-500/10 text-red-700 dark:text-red-400",
  }

  const labels = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
  }

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[level]} ${className}`}>
      {labels[level]}
    </span>
  )
}
