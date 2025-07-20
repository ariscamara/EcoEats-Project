"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, Plus, ShoppingCart, UtensilsCrossed, User, Settings, LogOut, Home } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import type { InventoryItem } from "@/types/inventory"
import type { Recipe } from "@/types/recipe"
import { inventoryAPI, recipeAPI } from "@/lib/api"

export default function DashboardPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)

      const inventoryData = await inventoryAPI.getAll() as InventoryItem[]
      const recipesData = await recipeAPI.getSuggestions() as Recipe[]
      
      setInventoryItems(inventoryData)
      setRecipes(recipesData)
    } catch (err) {
      setError("Failed to load data")
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getExpirationStatus = (days_until_expiration: number) => {
    if (days_until_expiration <= 2) return "critical"
    if (days_until_expiration <= 5) return "warning"
    return "good"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "good":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-600"
      case "warning":
        return "bg-yellow-600"
      case "good":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const calculateFreshnessPercentage = (days_until_expiration: number, total_shelf_life: number) => {
    const percentage = (days_until_expiration / total_shelf_life) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  const markItemAsUsed = async (id: string) => {
    try {
      await inventoryAPI.markUsed(id)
      await fetchData()
    } catch (err) {
      console.error("Error marking item as used:", err)
    }
  }

  const markItemAsDiscarded = async (id: string) => {
    try {
      await inventoryAPI.markDiscarded(id)
      await fetchData()
    } catch (err) {
      console.error("Error marking item as discarded:", err)
    }
  }

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
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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
            <p className="text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full bg-transparent">
              <User className="h-4 w-4" />
              <span className="sr-only">User</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-14 flex-col border-r md:flex lg:w-64">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Home className="h-6 w-6" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>
          </div>
          <nav className="grid gap-2 p-2">
            <Link
              href="/dashboard"
              className="flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-accent-foreground"
            >
              <Home className="h-5 w-5" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>
            <Link
              href="/inventory"
              className="flex h-10 items-center gap-2 rounded-md px-4 text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden lg:inline">Inventory</span>
            </Link>
            <Link
              href="/recipes"
              className="flex h-10 items-center gap-2 rounded-md px-4 text-muted-foreground hover:text-foreground"
            >
              <UtensilsCrossed className="h-5 w-5" />
              <span className="hidden lg:inline">Recipes</span>
            </Link>
            <Link
              href="/settings"
              className="flex h-10 items-center gap-2 rounded-md px-4 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden lg:inline">Settings</span>
            </Link>
          </nav>
          <div className="mt-auto p-4">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span className="hidden lg:inline">Log Out</span>
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <DashboardShell>
            <DashboardHeader heading="Dashboard" description="Monitor your food inventory and get recipe suggestions.">
              <Link href="/inventory/add">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </Link>
            </DashboardHeader>
            <Tabs defaultValue="inventory" className="space-y-4">
              <TabsList>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="recipes">Recipe Suggestions</TabsTrigger>
              </TabsList>
              <TabsContent value="inventory" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Expiring Soon</CardTitle>
                      <CardDescription>Items that need to be used within the next 3 days.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {inventoryItems.filter((item) => item.days_until_expiration <= 3).length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Total Items</CardTitle>
                      <CardDescription>Total number of items in your inventory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{inventoryItems.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Recipe Suggestions</CardTitle>
                      <CardDescription>Recipes based on your expiring ingredients.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{recipes.length}</div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Monitor the freshness of your food items.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inventoryItems.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No items in your inventory.</p>
                          <Link href="/inventory/add" className="mt-2 inline-block">
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                              <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        inventoryItems.map((item) => {
                          const status = getExpirationStatus(item.days_until_expiration)
                          const statusColor = getStatusColor(status)
                          const progressColor = getProgressColor(status)
                          const freshnessPercentage = calculateFreshnessPercentage(
                            item.days_until_expiration,
                            item.total_shelf_life,
                          )

                          return (
                            <div key={item.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.days_until_expiration === 0
                                      ? "Expires today"
                                      : item.days_until_expiration === 1
                                        ? "Expires tomorrow"
                                        : `Expires in ${item.days_until_expiration} days`}
                                  </div>
                                </div>
                                <Badge className={statusColor}>
                                  {status === "critical" ? "Use now" : status === "warning" ? "Use soon" : "Fresh"}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Freshness</span>
                                  <span>{Math.round(freshnessPercentage)}%</span>
                                </div>
                                <Progress
                                  value={freshnessPercentage}
                                  className="h-2"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => markItemAsUsed(item.id)}>
                                  Mark as Used
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 bg-transparent"
                                  onClick={() => markItemAsDiscarded(item.id)}
                                >
                                  Discard
                                </Button>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="recipes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recipe Suggestions</CardTitle>
                    <CardDescription>Recipes based on ingredients that need to be used soon.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {recipes.length === 0 ? (
                        <div className="text-center py-6 md:col-span-2 lg:col-span-3">
                          <p className="text-muted-foreground">No recipe suggestions available.</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add more items to your inventory to get recipe suggestions.
                          </p>
                        </div>
                      ) : (
                        recipes.map((recipe) => (
                          <Card key={recipe.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{recipe.name}</CardTitle>
                              <CardDescription>
                                {recipe.cuisine_type} • {recipe.prep_time} mins
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div>
                                  <div className="text-sm font-medium">Uses expiring ingredients:</div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {recipe.uses_ingredients.map((ingredient) => (
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
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                  View Recipe
                                </Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}
