export interface Recipe {
  id: string
  name: string
  cuisineType: string
  prepTime: number
  usesIngredients: string[]
  instructions: string[]
  dietaryTags: string[]
  ingredients: string[]
}
