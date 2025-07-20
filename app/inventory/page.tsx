"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Plus, Search, Filter, ArrowUpDown, ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import type { InventoryItem } from "@/types/inventory"
import { inventoryAPI } from "@/lib/api"
import { foodCategories } from "@/lib/food-categories"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<"expiring" | "name" | "category">("expiring")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        const data = await inventoryAPI.getAll() as InventoryItem[]
        setInventoryItems(data)
      } catch (err) {
        setError("Failed to load inventory")
        console.error("Error fetching inventory:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
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
      setInventoryItems(inventoryItems.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Error marking item as used:", err)
    }
  }

  const markItemAsDiscarded = async (id: string) => {
    try {
      await inventoryAPI.markDiscarded(id)
      setInventoryItems(inventoryItems.filter((item) => item.id !== id))
    } catch (err) {
      console.error("Error marking item as discarded:", err)
    }
  }

  const filteredItems = inventoryItems
    .filter((item) => {
      // Filter by search query
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by selected categories
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category)

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Sort by selected order
      if (sortOrder === "expiring") {
        return a.days_until_expiration - b.days_until_expiration
      } else if (sortOrder === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortOrder === "category") {
        return a.category.localeCompare(b.category)
      }
      return 0
    })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
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
            <p className="mt-2 text-muted-foreground">Loading inventory...</p>
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
          <DashboardHeader heading="Inventory" description="Manage your food inventory and track expiration dates.">
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
              </Link>
              <Link href="/inventory/add">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </Link>
            </div>
          </DashboardHeader>
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2 bg-transparent">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {foodCategories.map((category) => (
                      <DropdownMenuCheckboxItem
                        key={category.value}
                        checked={selectedCategories.includes(category.value)}
                        onCheckedChange={() => toggleCategory(category.value)}
                      >
                        {category.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex gap-2 bg-transparent">
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === "expiring"}
                      onCheckedChange={() => setSortOrder("expiring")}
                    >
                      Expiring Soon
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === "name"}
                      onCheckedChange={() => setSortOrder("name")}
                    >
                      Name (A-Z)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortOrder === "category"}
                      onCheckedChange={() => setSortOrder("category")}
                    >
                      Category
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Items</CardTitle>
                    <CardDescription>Manage and track all items in your food inventory.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {filteredItems.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No items found.</p>
                          <Link href="/inventory/add" className="mt-2 inline-block">
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                              <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        filteredItems.map((item) => {
                          const status = getExpirationStatus(item.days_until_expiration)
                          const statusColor = getStatusColor(status)
                          const progressColor = getProgressColor(status)
                          const freshnessPercentage = calculateFreshnessPercentage(
                            item.days_until_expiration,
                            item.total_shelf_life,
                          )

                          return (
                            <div key={item.id} className="space-y-2 p-4 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-lg">{item.name}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Badge variant="outline">
                                      {foodCategories.find((cat) => cat.value === item.category)?.label ||
                                        item.category}
                                    </Badge>
                                    <span>•</span>
                                    <span>Qty: {item.quantity}</span>
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
                              <div className="pt-2 text-sm">
                                {item.days_until_expiration === 0
                                  ? "Expires today"
                                  : item.days_until_expiration === 1
                                    ? "Expires tomorrow"
                                    : `Expires in ${item.days_until_expiration} days`}
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
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
              <TabsContent value="expiring" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Expiring Soon</CardTitle>
                    <CardDescription>Items that need to be used within the next 5 days.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {filteredItems.filter((item) => item.days_until_expiration <= 5).length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No items expiring soon.</p>
                        </div>
                      ) : (
                        filteredItems
                          .filter((item) => item.days_until_expiration <= 5)
                          .map((item) => {
                            const status = getExpirationStatus(item.days_until_expiration)
                            const statusColor = getStatusColor(status)
                            const progressColor = getProgressColor(status)
                            const freshnessPercentage = calculateFreshnessPercentage(
                              item.days_until_expiration,
                              item.total_shelf_life,
                            )

                            return (
                              <div key={item.id} className="space-y-2 p-4 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-lg">{item.name}</div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                      <Badge variant="outline">
                                        {foodCategories.find((cat) => cat.value === item.category)?.label ||
                                          item.category}
                                      </Badge>
                                      <span>•</span>
                                      <span>Qty: {item.quantity}</span>
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
                                <div className="pt-2 text-sm font-medium text-red-600">
                                  {item.days_until_expiration === 0
                                    ? "Expires today"
                                    : item.days_until_expiration === 1
                                      ? "Expires tomorrow"
                                      : `Expires in ${item.days_until_expiration} days`}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
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
            </Tabs>
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}
