"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const { toast } = useToast()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    // Update HTML element
    document.documentElement.classList.toggle("dark")

    // Store preference
    localStorage.setItem("theme", newTheme)

    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} mode`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      {/* Theme Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9 bg-transparent">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Regional Settings</CardTitle>
          <CardDescription>Configure your regional preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <div className="space-y-1">
              <p className="font-medium">Currency</p>
              <p className="text-sm text-muted-foreground">Display prices in your preferred currency</p>
            </div>
            <div className="bg-muted px-4 py-2 rounded font-semibold">LKR</div>
          </div>
          <p className="text-xs text-muted-foreground border-t pt-4">
            All prices are displayed in Sri Lankan Rupees (LKR). This setting is locked and cannot be changed.
          </p>
        </CardContent>
      </Card>

      {/* Data & Disclaimer */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Data & Compliance</CardTitle>
          <CardDescription>Important information about data usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold mb-1">CSE Data Delay</h4>
              <p className="text-muted-foreground">
                All data displayed on this platform is delayed by 15-30 minutes as per Colombo Stock Exchange (CSE)
                regulations. Real-time data requires a premium subscription directly through CSE.
              </p>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-semibold mb-1">Financial Disclaimer</h4>
              <p className="text-muted-foreground">
                This platform is provided for informational purposes only and does not constitute financial advice. The
                predictions and analysis are generated using machine learning models trained on historical data. Past
                performance does not guarantee future results. Market conditions, economic factors, and unexpected
                events can significantly impact stock prices.
              </p>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-semibold mb-1">Risk Warning</h4>
              <p className="text-muted-foreground">
                Stock market investments carry inherent risk, including potential loss of principal. The CSE Investment
                Platform is not responsible for any financial losses incurred based on information or predictions
                provided on this platform. Always conduct your own due diligence and consult with a qualified financial
                advisor before making investment decisions.
              </p>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-semibold mb-1">Model Limitations</h4>
              <p className="text-muted-foreground">
                Prediction models have inherent limitations. They may not account for sudden market shocks, regulatory
                changes, geopolitical events, or company-specific news. Use predictions as one of many factors in your
                investment decision-making process, not as the sole basis for decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="bg-muted/30 border-border">
        <CardHeader>
          <CardTitle className="text-lg">About CSE Investment Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Platform:</strong> Next.js 15 with TypeScript, TailwindCSS, and Recharts
          </p>
          <p>
            <strong>Purpose:</strong> Provide retail investors with AI-powered tools for financial risk analysis and
            price prediction for stocks listed on the Colombo Stock Exchange.
          </p>
          <p>
            <strong>Status:</strong> Frontend complete. Backend integration coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
