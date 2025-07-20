"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Leaf, ArrowLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [dietaryPreference, setDietaryPreference] = useState("none")
  const [allergies, setAllergies] = useState({
    nuts: false,
    dairy: false,
    gluten: false,
    shellfish: false,
    eggs: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // TODO: Replace with actual API call to Django backend
      const settingsData = {
        notifications,
        email_notifications: emailNotifications,
        push_notifications: pushNotifications,
        dietary_preference: dietaryPreference,
        allergies,
      }

      // const response = await fetch('/api/user/settings/', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-CSRFToken': getCsrfToken(), // For Django CSRF protection
      //   },
      //   body: JSON.stringify(settingsData),
      // })

      // if (!response.ok) {
      //   throw new Error('Failed to save settings')
      // }

      console.log("Settings data to be sent to Django:", settingsData)

      // Show success message
      alert("Settings saved successfully!")
    } catch (err) {
      console.error("Error saving settings:", err)
      alert("Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
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
          <DashboardHeader heading="Settings" description="Manage your account settings and preferences.">
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
          </DashboardHeader>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you want to receive notifications about your food inventory.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="notifications" className="flex flex-col space-y-1">
                    <span>Enable Notifications</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Receive alerts about expiring food items.
                    </span>
                  </Label>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>
                {notifications && (
                  <div className="space-y-4 pl-6 pt-2">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>
                  Set your dietary preferences to receive personalized recipe suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={dietaryPreference} onValueChange={setDietaryPreference} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">No Restrictions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="vegetarian" />
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegan" id="vegan" />
                    <Label htmlFor="vegan">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pescatarian" id="pescatarian" />
                    <Label htmlFor="pescatarian">Pescatarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="keto" id="keto" />
                    <Label htmlFor="keto">Keto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paleo" id="paleo" />
                    <Label htmlFor="paleo">Paleo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="halal" id="halal" />
                    <Label htmlFor="halal">Halal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kosher" id="kosher" />
                    <Label htmlFor="kosher">Kosher</Label>
                  </div>
                </RadioGroup>
                <div className="space-y-2 pt-2">
                  <Label>Allergies and Intolerances</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nuts"
                        checked={allergies.nuts}
                        onCheckedChange={(checked) => setAllergies({ ...allergies, nuts: checked === true })}
                      />
                      <Label htmlFor="nuts">Nuts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dairy"
                        checked={allergies.dairy}
                        onCheckedChange={(checked) => setAllergies({ ...allergies, dairy: checked === true })}
                      />
                      <Label htmlFor="dairy">Dairy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gluten"
                        checked={allergies.gluten}
                        onCheckedChange={(checked) => setAllergies({ ...allergies, gluten: checked === true })}
                      />
                      <Label htmlFor="gluten">Gluten</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shellfish"
                        checked={allergies.shellfish}
                        onCheckedChange={(checked) => setAllergies({ ...allergies, shellfish: checked === true })}
                      />
                      <Label htmlFor="shellfish">Shellfish</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="eggs"
                        checked={allergies.eggs}
                        onCheckedChange={(checked) => setAllergies({ ...allergies, eggs: checked === true })}
                      />
                      <Label htmlFor="eggs">Eggs</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSaveSettings}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </DashboardShell>
      </main>
    </div>
  )
}
