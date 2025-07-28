import { join } from "path"
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { LeftoverItem, LeftoverStatus } from "../types"

const dbDir = join(process.cwd(), "data")
const dbFile = join(dbDir, "leftovers.json")

if (!existsSync(dbDir)) mkdirSync(dbDir)
if (!existsSync(dbFile)) writeFileSync(dbFile, "[]", "utf-8")

export function getAllLeftovers(): LeftoverItem[] {
  const data = readFileSync(dbFile, "utf-8")
  return JSON.parse(data)
}

export function saveAllLeftovers(items: LeftoverItem[]) {
  writeFileSync(dbFile, JSON.stringify(items, null, 2), "utf-8")
}

export function addLeftover(data: Partial<LeftoverItem>): LeftoverItem {
  const id = Date.now()
  const purchase_date = new Date().toISOString().split("T")[0]
  const expiration_date = new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0]

  const newItem: LeftoverItem = {
    id,
    name: data.name || "",
    category: data.category || "",
    quantity: data.quantity || "",
    size: data.size || "",
    price: data.price || "",
    purchase_date,
    expiration_date,
    status: "active",
  }

  const items = getAllLeftovers()
  items.push(newItem)
  saveAllLeftovers(items)
  return newItem
}

export function updateLeftoverStatus(id: number, status: LeftoverStatus) {
  const items = getAllLeftovers()
  const updated = items.map(i => i.id === id ? { ...i, status } : i)
  saveAllLeftovers(updated)
  return { success: true }
}

export function deleteLeftover(id: number) {
  const items = getAllLeftovers()
  const updated = items.filter(i => i.id !== id)
  saveAllLeftovers(updated)
  return { success: true }
}
