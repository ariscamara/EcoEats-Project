#!/usr/bin/env python3

import requests
import json

def debug_ingredient_matching():
    inventory_response = requests.get("http://localhost:8001/api/inventory/")
    inventory = inventory_response.json()
    
    print("=== AVAILABLE INGREDIENTS ===")
    available_ingredients = [item['name'] for item in inventory]
    for ing in sorted(available_ingredients):
        print(f"  '{ing}'")
    
    recipes_response = requests.get("http://localhost:8001/api/recipes/")
    recipes = recipes_response.json()[:5]  # First 5 recipes
    
    print("\n=== TESTING RECIPE INGREDIENTS ===")
    for recipe in recipes:
        print(f"\nRecipe: {recipe['name']}")
        print(f"Uses ingredients: {recipe['uses_ingredients']}")
        
        from backend.recommendation_engine import normalize_ingredient_name
        print("Normalized recipe ingredients:")
        for ing in recipe['uses_ingredients']:
            normalized = normalize_ingredient_name(ing)
            print(f"  '{ing}' -> '{normalized}'")
        
        print("Normalized available ingredients:")
        for ing in available_ingredients[:5]:  # First 5 for brevity
            normalized = normalize_ingredient_name(ing)
            print(f"  '{ing}' -> '{normalized}'")

if __name__ == "__main__":
    debug_ingredient_matching()
