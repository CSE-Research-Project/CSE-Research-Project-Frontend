"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { newsGetById, newsList, type NewsArticle } from "@/lib/fakeApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

export default function NewsDetail() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string
        const articleData = await newsGetById(id)
        if (articleData) {
          setArticle(articleData)
          // Fetch related articles based on tags
          const allArticles = await newsList()
          const related = allArticles
            .filter((a) => a.id !== id && a.tags.some((tag) => articleData.tags.includes(tag)))
            .slice(0, 3)
          setRelatedArticles(related)
        }
      } catch (error) {
        console.error("Failed to fetch article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Article not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to News
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Article */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-foreground">{article.title}</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{article.source}</span>
                <span>•</span>
                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-foreground leading-relaxed">{article.summary}</p>
              {article.content && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{article.content}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Related Articles Sidebar */}
        <div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Related Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relatedArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground">No related articles found</p>
              ) : (
                relatedArticles.map((relatedArticle) => (
                  <Link key={relatedArticle.id} href={`/news/${relatedArticle.id}`}>
                    <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <h4 className="text-sm font-semibold text-foreground hover:text-primary line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(relatedArticle.publishedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
