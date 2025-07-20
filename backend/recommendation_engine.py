from sqlalchemy.orm import Session
from models import Recipe as RecipeModel, InventoryItem as InventoryItemModel
from typing import List, Dict, Tuple
import re

def normalize_ingredient_name(ingredient: str) -> str:
    """Normalize ingredient names for better matching"""
    ingredient = ingredient.lower().strip()
    ingredient = re.sub(r'\d+\s*(cups?|tbsp|tsp|oz|lbs?|grams?|kg|ml|l)\s*', '', ingredient)
    ingredient = re.sub(r'\b(a|an|the|of|in|with|and|or)\b', '', ingredient)
    ingredient = ' '.join(ingredient.split())
    return ingredient

def calculate_ingredient_match_score(recipe_ingredients: List[str], available_ingredients: List[str]) -> float:
    """Calculate exact ingredient match score - only return 1.0 if ALL ingredients are available"""
    if not recipe_ingredients:
        return 0.0
    
    normalized_recipe = [normalize_ingredient_name(ing) for ing in recipe_ingredients]
    normalized_available = [normalize_ingredient_name(ing) for ing in available_ingredients]
    
    for recipe_ing in normalized_recipe:
        found_match = False
        for available_ing in normalized_available:
            if (recipe_ing == available_ing or
                (recipe_ing == "egg" and available_ing == "eggs") or
                (recipe_ing == "eggs" and available_ing == "egg") or
                (recipe_ing == "flour" and available_ing == "plain flour") or
                (recipe_ing == "plain flour" and available_ing == "flour") or
                (recipe_ing == "oil" and "oil" in available_ing) or
                ("oil" in recipe_ing and available_ing == "oil")):
                found_match = True
                break
        
        if not found_match:
            return 0.0
    
    return 1.0

def calculate_expiration_urgency_score(inventory_items: List[InventoryItemModel], recipe_ingredients: List[str]) -> float:
    """Calculate urgency score based on expiring ingredients used in recipe"""
    urgency_score = 0.0
    matching_items = []
    
    for item in inventory_items:
        for ingredient in recipe_ingredients:
            if (normalize_ingredient_name(item.name) in normalize_ingredient_name(ingredient) or 
                normalize_ingredient_name(ingredient) in normalize_ingredient_name(item.name)):
                matching_items.append(item)
                break
    
    if not matching_items:
        return 0.0
    
    for item in matching_items:
        if item.days_until_expiration <= 2:
            urgency_score += 3.0  # Critical urgency
        elif item.days_until_expiration <= 5:
            urgency_score += 2.0  # High urgency
        elif item.days_until_expiration <= 10:
            urgency_score += 1.0  # Medium urgency
        else:
            urgency_score += 0.5  # Low urgency
    
    return urgency_score / len(matching_items)

def calculate_recipe_complexity_score(recipe: RecipeModel) -> float:
    """Calculate complexity score - simpler recipes get higher scores"""
    base_score = 1.0
    
    if len(recipe.ingredients) <= 5:
        base_score += 0.3
    elif len(recipe.ingredients) <= 8:
        base_score += 0.1
    
    if recipe.prep_time <= 15:
        base_score += 0.3
    elif recipe.prep_time <= 30:
        base_score += 0.1
    
    if len(recipe.instructions) <= 5:
        base_score += 0.2
    
    return base_score

def get_recipe_recommendations(db: Session, inventory_items: List[InventoryItemModel], limit: int = 10) -> List[RecipeModel]:
    """Get recipe recommendations based on available inventory - only exact matches"""
    if not inventory_items:
        return []  # No recommendations if no inventory
    
    available_ingredients = [item.name for item in inventory_items]
    all_recipes = db.query(RecipeModel).all()
    
    exact_match_recipes = []
    
    for recipe in all_recipes:
        ingredient_match_score = calculate_ingredient_match_score(recipe.uses_ingredients, available_ingredients)
        
        if ingredient_match_score == 1.0:
            urgency_score = calculate_expiration_urgency_score(inventory_items, recipe.uses_ingredients)
            complexity_score = calculate_recipe_complexity_score(recipe)
            
            total_score = (
                urgency_score * 10.0 +          # Highest priority: use expiring items
                complexity_score * 1.0          # Secondary: simpler recipes
            )
            
            exact_match_recipes.append((recipe, total_score, urgency_score))
    
    exact_match_recipes.sort(key=lambda x: (x[2], x[1]), reverse=True)
    return [recipe for recipe, total_score, urgency_score in exact_match_recipes[:limit]]
