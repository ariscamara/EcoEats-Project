"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Leaf, ArrowLeft, Barcode, Camera } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { cn } from "@/lib/utils"
import { foodCategories } from "@/lib/food-categories"
import { inventoryAPI } from "@/lib/api"

export default function AddInventoryItemPage() {
  const router = useRouter()
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [purchaseDate, setPurchaseDate] = useState<Date>(new Date())
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)
  const [isScanning, setIsScanning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!expirationDate) {
      alert("Please select an expiration date")
      return
    }
    
    setIsSubmitting(true)

    try {
      const now = new Date()
      const purchaseDateObj = new Date(purchaseDate)
      const expirationDateObj = new Date(expirationDate)
      
      const daysUntilExpiration = Math.ceil((expirationDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const totalShelfLife = Math.ceil((expirationDateObj.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24))

      const itemData = {
        name: itemName,
        category,
        quantity: Number.parseInt(quantity),
        purchase_date: purchaseDate.toISOString(),
        expiration_date: expirationDate.toISOString(),
        days_until_expiration: Math.max(0, daysUntilExpiration),
        total_shelf_life: Math.max(1, totalShelfLife),
      }

      await inventoryAPI.create(itemData)

      router.push("/dashboard")
    } catch (err) {
      console.error("Error adding item:", err)
      alert("Failed to add item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const simulateBarcodeScanning = () => {
    setIsScanning(true)

    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false)
      setItemName("Organic Milk")
      setCategory("dairy")
      setQuantity("1")

      // Set expiration date to 10 days from now
      const expDate = new Date()
      expDate.setDate(expDate.getDate() + 10)
      setExpirationDate(expDate)
    }, 2000)
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
          <DashboardHeader heading="Add Inventory Item" description="Add a new item to your food inventory.">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
          </DashboardHeader>
          <div className="grid gap-4">
            <Tabs defaultValue="manual" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="barcode">Barcode Scan</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <Card>
                  <form onSubmit={handleSubmit}>
                    <CardHeader>
                      <CardTitle>Item Details</CardTitle>
                      <CardDescription>
                        Enter the details of the food item you want to add to your inventory.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="item-name">Item Name</Label>
                        <Input
                          id="item-name"
                          placeholder="e.g., Milk, Apples, Bread"
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {foodCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Purchase Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !purchaseDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {purchaseDate ? format(purchaseDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={purchaseDate}
                                onSelect={(date) => date && setPurchaseDate(date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>Expiration Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !expirationDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {expirationDate ? format(expirationDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={expirationDate}
                                onSelect={(date) => setExpirationDate(date)}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Adding..." : "Add to Inventory"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              <TabsContent value="barcode">
                <Card>
                  <CardHeader>
                    <CardTitle>Scan Barcode</CardTitle>
                    <CardDescription>
                      Scan the barcode on your food item to quickly add it to your inventory.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center space-y-4 p-6 border-2 border-dashed rounded-lg">
                      {isScanning ? (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="animate-pulse">
                            <Camera className="h-16 w-16 text-green-600" />
                          </div>
                          <p className="text-center text-muted-foreground">Scanning...</p>
                        </div>
                      ) : (
                        <>
                          <Barcode className="h-16 w-16 text-green-600" />
                          <p className="text-center text-muted-foreground">
                            Position the barcode in front of your camera to scan.
                          </p>
                          <Button variant="outline" className="mt-4 bg-transparent" onClick={simulateBarcodeScanning}>
                            Simulate Scan
                          </Button>
                        </>
                      )}
                    </div>
                    {itemName && (
                      <div className="space-y-4 mt-6 p-4 border rounded-lg bg-green-50">
                        <h3 className="font-medium">Scanned Item Details:</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-medium">Name:</div>
                          <div>{itemName}</div>
                          <div className="font-medium">Category:</div>
                          <div>{foodCategories.find((cat) => cat.value === category)?.label || category}</div>
                          <div className="font-medium">Expiration Date:</div>
                          <div>{expirationDate ? format(expirationDate, "PPP") : "Not set"}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      disabled={!itemName || isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add to Inventory"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}
