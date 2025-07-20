#!/usr/bin/env python3

import requests
import json
import re

def normalize_ingredient_name(ingredient: str) -> str:
    """Normalize ingredient names for better matching - copied from backend"""
    ingredient = ingredient.lower().strip()
    ingredient = re.sub(r'\d+\s*(cups?|tbsp|tsp|oz|lbs?|grams?|kg|ml|l)\s*', '', ingredient)
    ingredient = re.sub(r'\b(a|an|the|of|in|with|and|or)\b', '', ingredient)
    ingredient = ' '.join(ingredient.split())
    return ingredient

def test_matching():
    inventory_response = requests.get("http://localhost:8001/api/inventory/")
    inventory = inventory_response.json()
    
    print("=== AVAILABLE INGREDIENTS (normalized) ===")
    available_ingredients = [item['name'] for item in inventory]
    normalized_available = [normalize_ingredient_name(ing) for ing in available_ingredients]
    
    for orig, norm in zip(available_ingredients, normalized_available):
        print(f"  '{orig}' -> '{norm}'")
    
    recipes_response = requests.get("http://localhost:8001/api/recipes/")
    recipes = recipes_response.json()[:10]  # First 10 recipes
    
    print(f"\n=== TESTING {len(recipes)} RECIPES ===")
    matches_found = 0
    
    for recipe in recipes:
        recipe_ingredients = recipe['uses_ingredients']
        normalized_recipe = [normalize_ingredient_name(ing) for ing in recipe_ingredients]
        
        all_match = True
        matches = []
        
        for recipe_ing in normalized_recipe:
            found_match = False
            for available_ing in normalized_available:
                if recipe_ing == available_ing:
                    matches.append(f"'{recipe_ing}' matches '{available_ing}'")
                    found_match = True
                    break
            
            if not found_match:
                all_match = False
                break
        
        if all_match and len(recipe_ingredients) > 0:
            matches_found += 1
            print(f"\n✅ MATCH: {recipe['name']}")
            print(f"   Recipe ingredients: {recipe_ingredients}")
            print(f"   Normalized: {normalized_recipe}")
            for match in matches:
                print(f"   {match}")
        elif len(matches) > 0:
            print(f"\n❌ PARTIAL: {recipe['name']} ({len(matches)}/{len(recipe_ingredients)} ingredients)")
            print(f"   Recipe ingredients: {recipe_ingredients}")
            for match in matches:
                print(f"   {match}")
    
    print(f"\n=== SUMMARY ===")
    print(f"Total recipes tested: {len(recipes)}")
    print(f"Exact matches found: {matches_found}")

if __name__ == "__main__":
    test_matching()
