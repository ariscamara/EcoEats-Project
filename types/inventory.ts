export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  purchase_date: string
  expiration_date: string
  days_until_expiration: number
  total_shelf_life: number
}
