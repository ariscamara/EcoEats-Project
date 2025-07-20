"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Leaf, ArrowLeft, Clock, Users, ChefHat } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import type { Recipe } from "@/types/recipe"
import { API_BASE_URL } from "@/lib/api"

export default function RecipeDetailPage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/recipes/${params.id}/`)
        if (!response.ok) {
          throw new Error('Recipe not found')
        }
        const data = await response.json()
        setRecipe(data)
      } catch (err) {
        console.error("Error fetching recipe:", err)
        setRecipe(null)
        setError("Recipe not found")
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b bg-background">
          <div className="container flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">EcoEats</span>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading recipe...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!recipe || error) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b bg-background">
          <div className="container flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">EcoEats</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <DashboardShell>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold">Recipe not found</h1>
              <p className="text-muted-foreground mt-2">The recipe you're looking for doesn't exist.</p>
              <div className="flex gap-2 justify-center mt-4">
                <Link href="/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                  </Button>
                </Link>
                <Link href="/recipes">
                  <Button>Back to Recipes</Button>
                </Link>
              </div>
            </div>
          </DashboardShell>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">EcoEats</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <DashboardShell>
          <DashboardHeader heading={recipe.name} description={`${recipe.cuisine_type} cuisine`}>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
              </Link>
              <Link href="/recipes">
                <Button variant="outline">Back to Recipes</Button>
              </Link>
            </div>
          </DashboardHeader>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{recipe.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {recipe.prep_time} minutes
                        </span>
                        <span className="flex items-center">
                          <ChefHat className="mr-1 h-4 w-4" />
                          {recipe.cuisine_type}
                        </span>
                        <span className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          2-4 servings
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {recipe.dietary_tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                  <CardDescription>Follow these step-by-step instructions to prepare your meal</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{instruction}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>Everything you need for this recipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uses Expiring Ingredients</CardTitle>
                  <CardDescription>This recipe helps use up these items from your inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recipe.uses_ingredients.map((ingredient) => (
                      <Badge key={ingredient} variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recipe Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Add to Meal Plan</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Save to Favorites
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Share Recipe
                  </Button>
                  <Separator />
                  <Button variant="outline" className="w-full bg-transparent">
                    Print Recipe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}
