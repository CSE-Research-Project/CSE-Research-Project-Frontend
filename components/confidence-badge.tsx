interface ConfidenceBadgeProps {
  confidence: "low" | "medium" | "high"
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const styles = {
    low: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    medium: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    high: "bg-green-500/10 text-green-700 dark:text-green-400",
  }

  const labels = {
    low: "Low Confidence",
    medium: "Medium Confidence",
    high: "High Confidence",
  }

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[confidence]}`}>
      {labels[confidence]}
    </span>
  )
}
