export interface Recipe {
  id: string
  name: string
  cuisine_type: string
  prep_time: number
  uses_ingredients: string[]
  instructions: string[]
  dietary_tags: string[]
  ingredients: string[]
}
