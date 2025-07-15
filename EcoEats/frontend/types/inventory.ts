export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  purchaseDate: Date
  expirationDate: Date
  daysUntilExpiration: number
  totalShelfLife: number
}
