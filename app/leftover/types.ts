export type LeftoverStatus = "active" | "used" | "trashed"

export interface LeftoverItem {
  id: number
  name: string
  category: string
  quantity: string
  size: string
  price: string
  purchase_date: string
  expiration_date: string
  status: LeftoverStatus
}
