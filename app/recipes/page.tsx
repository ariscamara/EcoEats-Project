"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Search, UtensilsCrossed, Clock, ChevronDown, ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import type { Recipe } from "@/types/recipe"
import { recipeAPI } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        const data = await recipeAPI.getAll() as Recipe[]
        setRecipes(data)
      } catch (err) {
        setError("Failed to load recipes")
        console.error("Error fetching recipes:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const filteredRecipes = recipes.filter((recipe) => {
    // Filter by search query
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.uses_ingredients.some((ingredient) => ingredient.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by dietary tags
    const matchesDietary =
      selectedDietary.length === 0 || selectedDietary.some((tag) => recipe.dietary_tags.includes(tag))

    // Filter by cuisine type
    const matchesCuisine = selectedCuisine.length === 0 || selectedCuisine.includes(recipe.cuisine_type)

    return matchesSearch && matchesDietary && matchesCuisine
  })

  const toggleDietaryTag = (tag: string) => {
    setSelectedDietary((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const toggleCuisineType = (cuisine: string) => {
    setSelectedCuisine((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
  }

  const allDietaryTags = Array.from(new Set(recipes.flatMap((recipe) => recipe.dietary_tags)))
  const allCuisineTypes = Array.from(new Set(recipes.map((recipe) => recipe.cuisine_type)))

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
            <p className="mt-2 text-muted-foreground">Loading recipes...</p>
          </div>
        </div>
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
          <DashboardHeader
            heading="Recipe Suggestions"
            description="Discover recipes based on your inventory and preferences."
          >
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
          </DashboardHeader>
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search recipes or ingredients..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2 bg-transparent">
                      Dietary
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {allDietaryTags.map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={selectedDietary.includes(tag)}
                        onCheckedChange={() => toggleDietaryTag(tag)}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2 bg-transparent">
                      Cuisine
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {allCuisineTypes.map((cuisine) => (
                      <DropdownMenuCheckboxItem
                        key={cuisine}
                        checked={selectedCuisine.includes(cuisine)}
                        onCheckedChange={() => toggleCuisineType(cuisine)}
                      >
                        {cuisine}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Recipes</TabsTrigger>
                <TabsTrigger value="expiring">Using Expiring Items</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRecipes.length === 0 ? (
                    <div className="text-center py-6 md:col-span-2 lg:col-span-3">
                      <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No recipes found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filters to find what you're looking for.
                      </p>
                    </div>
                  ) : (
                    filteredRecipes.map((recipe) => (
                      <Card key={recipe.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{recipe.name}</CardTitle>
                          <CardDescription className="flex items-center">
                            <span>{recipe.cuisine_type}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {recipe.prep_time} mins
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm font-medium">Ingredients:</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {recipe.uses_ingredients.map((ingredient) => (
                                  <Badge key={ingredient} variant="outline">
                                    {ingredient}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Tags:</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {recipe.dietary_tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link href={`/recipes/${recipe.id}`} className="w-full">
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View Recipe</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="expiring" className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRecipes
                    .filter((recipe) =>
                      recipe.uses_ingredients.some((ingredient) =>
                        ["Chicken Breast", "Milk", "Spinach"].includes(ingredient),
                      ),
                    )
                    .map((recipe) => (
                      <Card key={recipe.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{recipe.name}</CardTitle>
                          <CardDescription className="flex items-center">
                            <span>{recipe.cuisine_type}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {recipe.prep_time} mins
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <div className="text-sm font-medium">Uses expiring ingredients:</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {recipe.uses_ingredients
                                  .filter((ingredient) => ["Chicken Breast", "Milk", "Spinach"].includes(ingredient))
                                  .map((ingredient) => (
                                    <Badge
                                      key={ingredient}
                                      variant="outline"
                                      className="bg-red-50 text-red-600 border-red-200"
                                    >
                                      {ingredient}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Other ingredients:</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {recipe.uses_ingredients
                                  .filter((ingredient) => !["Chicken Breast", "Milk", "Spinach"].includes(ingredient))
                                  .map((ingredient) => (
                                    <Badge key={ingredient} variant="outline">
                                      {ingredient}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link href={`/recipes/${recipe.id}`} className="w-full">
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">View Recipe</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="favorites" className="space-y-4">
                <div className="text-center py-12">
                  <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No favorite recipes yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Save your favorite recipes for quick access.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}
