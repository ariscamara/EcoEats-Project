import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, ShoppingCart, UtensilsCrossed } from "lucide-react"
import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/dashboard")

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">EcoEats</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="bg-white text-black">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Reduce Food Waste,
                  <br />
                  Save Money,
                  <br />
                  Save the Planet
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EcoEats helps you track your food inventory, alerts you when items are about to expire, and suggests
                  delicious recipes to use them up before they go bad.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button variant="outline" className="bg-white text-black">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-video rounded-xl bg-white p-4 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 rounded-xl" />
                  <div className="relative z-10 flex flex-col h-full justify-between p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Your Inventory</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                          <span>Milk</span>
                          <span className="text-red-600 text-sm">Expires tomorrow</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-md">
                          <span>Spinach</span>
                          <span className="text-yellow-600 text-sm">Expires in 3 days</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                          <span>Eggs</span>
                          <span className="text-green-600 text-sm">Expires in 10 days</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Recipe Suggestions</span>
                      </div>
                      <div className="p-2 bg-green-100 rounded-md">
                        <p className="font-medium">Spinach and Egg Frittata</p>
                        <p className="text-sm text-gray-600">Uses: Spinach, Eggs, Milk</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to reduce food waste
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EcoEats provides a comprehensive solution to help you manage your food inventory and reduce waste.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Inventory Tracking</h3>
                  <p className="text-gray-500">
                    Easily add grocery items to your inventory with expiration date tracking.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2" />
                    <path d="M10 8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 8" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Expiration Alerts</h3>
                  <p className="text-gray-500">
                    Get notified when your food items are about to expire so you can use them in time.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Recipe Suggestions</h3>
                  <p className="text-gray-500">
                    Receive AI-generated recipe suggestions based on ingredients that need to be used soon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple steps to reduce your food waste
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EcoEats makes it easy to track your food and get the most out of your groceries.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Add Your Groceries</h3>
                  <p className="text-gray-500">
                    Enter your grocery items manually or scan barcodes to quickly add them to your inventory.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Monitor Expiration Dates</h3>
                  <p className="text-gray-500">
                    View your dashboard to see which items are nearing expiration and need to be used soon.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Get Recipe Suggestions</h3>
                  <p className="text-gray-500">
                    Receive personalized recipe suggestions that help you use up ingredients before they expire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">
                  About EcoEats
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Our mission to reduce food waste
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EcoEats was created to address the critical issue of food waste in American households. With 30-40% of
                  food being wasted annually, we're committed to providing tools that help families save money and
                  reduce environmental impact.
                </p>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our team of passionate developers and food enthusiasts has created a comprehensive solution that
                  transforms how households interact with their groceries, making it easier than ever to manage food
                  effectively.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md aspect-video rounded-xl bg-white p-4 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-50 rounded-xl" />
                  <div className="relative z-10 flex flex-col h-full justify-center items-center p-4 space-y-4">
                    <Leaf className="h-16 w-16 text-green-600" />
                    <div className="text-center">
                      <h3 className="text-xl font-bold">Join the Movement</h3>
                      <p className="text-gray-500 mt-2">
                        Be part of the solution to reduce food waste and create a more sustainable future.
                      </p>
                    </div>
                    <Link href="/signup">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">Sign Up Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">EcoEats</span>
            </div>
            <p className="text-gray-500 md:text-base/relaxed">Smart food waste reduction for a better planet.</p>
          </div>
          <div className="md:ml-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="grid gap-3 text-sm">
              <div className="font-medium">Product</div>
              <Link href="#features" className="text-gray-500 hover:underline">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-500 hover:underline">
                How It Works
              </Link>
              <Link href="#" className="text-gray-500 hover:underline">
                Pricing
              </Link>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="font-medium">Company</div>
              <Link href="#about" className="text-gray-500 hover:underline">
                About
              </Link>
              <Link href="#" className="text-gray-500 hover:underline">
                Blog
              </Link>
              <Link href="#" className="text-gray-500 hover:underline">
                Careers
              </Link>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="font-medium">Legal</div>
              <Link href="#" className="text-gray-500 hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-500 hover:underline">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-gray-500">
          <div className="container px-4 md:px-6">© 2025 EcoEats. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
