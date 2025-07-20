import requests
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Recipe as RecipeModel
from database import engine
import os
from dotenv import load_dotenv
import time

load_dotenv()

def fetch_recipe_by_id(meal_id):
    """Fetch a single recipe by ID from TheMealDB"""
    url = f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get('meals', [])
    return []

def fetch_recipes_by_letter(letter):
    """Fetch all recipes starting with a specific letter"""
    url = f"https://www.themealdb.com/api/json/v1/1/search.php?f={letter}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get('meals', [])
    return []

def fetch_random_recipe():
    """Fetch a random recipe"""
    url = "https://www.themealdb.com/api/json/v1/1/random.php"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get('meals', [])
    return []

def convert_themealdb_to_our_format(meal_data):
    """Convert TheMealDB format to our Recipe model format"""
    if not meal_data:
        return None
    
    meal = meal_data[0] if isinstance(meal_data, list) else meal_data
    
    ingredients = []
    uses_ingredients = []
    
    for i in range(1, 21):
        ingredient_key = f"strIngredient{i}"
        measure_key = f"strMeasure{i}"
        
        ingredient = meal.get(ingredient_key) or ""
        measure = meal.get(measure_key) or ""
        
        if isinstance(ingredient, str):
            ingredient = ingredient.strip()
        if isinstance(measure, str):
            measure = measure.strip()
        
        if ingredient and ingredient.lower() not in ["null", ""]:
            if measure and measure.lower() not in ["null", ""]:
                ingredients.append(f"{measure} {ingredient}")
            else:
                ingredients.append(ingredient)
            uses_ingredients.append(ingredient.lower())
    
    instructions_text = meal.get("strInstructions") or ""
    instructions = []
    if instructions_text and isinstance(instructions_text, str):
        steps = instructions_text.replace("\r\n", "\n").split("\n")
        instructions = [step.strip() for step in steps if step.strip()]
    
    dietary_tags = []
    category = meal.get("strCategory") or ""
    if isinstance(category, str):
        category = category.lower()
        if "vegetarian" in category or "veggie" in category:
            dietary_tags.append("vegetarian")
        if "vegan" in category:
            dietary_tags.append("vegan")
    
    prep_time = 30
    if len(instructions) > 8:
        prep_time = 60
    elif len(instructions) < 4:
        prep_time = 15
    
    return {
        "id": meal.get("idMeal") or str(hash(meal.get("strMeal", "unknown"))),
        "name": meal.get("strMeal") or "Unknown Recipe",
        "cuisine_type": meal.get("strArea") or "International",
        "prep_time": prep_time,
        "uses_ingredients": uses_ingredients,
        "instructions": instructions,
        "dietary_tags": dietary_tags,
        "ingredients": ingredients
    }

def populate_themealdb_recipes():
    """Populate database with recipes from TheMealDB"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        print("Clearing existing recipes...")
        db.query(RecipeModel).delete()
        db.commit()
        
        all_recipes = []
        
        print("Fetching recipes from TheMealDB...")
        for letter in "abcdefghijklmnopqrstuvwxyz":
            print(f"Fetching recipes starting with '{letter}'...")
            recipes = fetch_recipes_by_letter(letter)
            if recipes:
                all_recipes.extend(recipes)
            time.sleep(0.1)
        
        print(f"Found {len(all_recipes)} recipes from TheMealDB")
        
        added_count = 0
        for meal_data in all_recipes:
            recipe_data = convert_themealdb_to_our_format([meal_data])
            if recipe_data:
                try:
                    recipe = RecipeModel(**recipe_data)
                    db.add(recipe)
                    added_count += 1
                except Exception as e:
                    print(f"Error adding recipe {recipe_data.get('name', 'Unknown')}: {e}")
                    continue
        
        db.commit()
        print(f"Successfully added {added_count} recipes from TheMealDB to database")
        
        total_count = db.query(RecipeModel).count()
        print(f"Total recipes in database: {total_count}")
        
        return added_count
        
    except Exception as e:
        print(f"Error populating recipes: {e}")
        db.rollback()
        return 0
    finally:
        db.close()

if __name__ == "__main__":
    print("Fetching recipes from TheMealDB API...")
    count = populate_themealdb_recipes()
    if count > 0:
        print("TheMealDB recipe population complete!")
    else:
        print("TheMealDB recipe population failed!")
