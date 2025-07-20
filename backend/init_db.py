from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Recipe as RecipeModel, InventoryItem as InventoryItemModel
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

def create_tables():
    """Create all database tables"""
    DATABASE_URL = os.getenv("DATABASE_URL")
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    return engine

def populate_recipes(engine):
    """Populate database with comprehensive recipe data"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    recipes_data = [
        {
            "id": "1",
            "name": "Vegetable Stir Fry",
            "cuisine_type": "Asian",
            "prep_time": 15,
            "uses_ingredients": ["broccoli", "carrots", "bell peppers", "soy sauce"],
            "instructions": [
                "Heat oil in a large pan or wok over high heat",
                "Add vegetables and stir-fry for 3-4 minutes",
                "Add soy sauce and seasonings",
                "Cook for another 2 minutes until vegetables are tender-crisp"
            ],
            "dietary_tags": ["vegetarian", "vegan", "gluten-free"],
            "ingredients": ["1 cup broccoli florets", "1 carrot, sliced", "1 bell pepper, sliced", "2 tbsp soy sauce", "1 tbsp oil"]
        },
        {
            "id": "2", 
            "name": "Banana Smoothie",
            "cuisine_type": "American",
            "prep_time": 5,
            "uses_ingredients": ["bananas", "milk", "honey"],
            "instructions": [
                "Peel and slice bananas",
                "Add all ingredients to blender",
                "Blend until smooth",
                "Serve immediately"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["2 ripe bananas", "1 cup milk", "1 tbsp honey", "1/2 cup ice"]
        },
        {
            "id": "3",
            "name": "Tomato Basil Pasta",
            "cuisine_type": "Italian", 
            "prep_time": 20,
            "uses_ingredients": ["pasta", "tomatoes", "basil", "garlic"],
            "instructions": [
                "Cook pasta according to package directions",
                "Heat oil in pan, add garlic",
                "Add tomatoes and cook until soft",
                "Add cooked pasta and fresh basil",
                "Toss and serve"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["8 oz pasta", "2 cups diced tomatoes", "1/4 cup fresh basil", "3 cloves garlic", "2 tbsp olive oil"]
        },
        {
            "id": "4",
            "name": "Apple Cinnamon Oatmeal",
            "cuisine_type": "American",
            "prep_time": 10,
            "uses_ingredients": ["oats", "apples", "cinnamon", "milk"],
            "instructions": [
                "Bring milk to boil in saucepan",
                "Add oats and reduce heat",
                "Cook for 5 minutes, stirring occasionally", 
                "Add diced apples and cinnamon",
                "Cook 2 more minutes and serve"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["1 cup rolled oats", "1 apple, diced", "1 tsp cinnamon", "2 cups milk", "2 tbsp honey"]
        },
        {
            "id": "5",
            "name": "Chicken Caesar Salad",
            "cuisine_type": "American",
            "prep_time": 15,
            "uses_ingredients": ["chicken breast", "lettuce", "parmesan", "croutons"],
            "instructions": [
                "Grill chicken breast until cooked through",
                "Slice chicken into strips",
                "Toss lettuce with Caesar dressing",
                "Top with chicken, parmesan, and croutons"
            ],
            "dietary_tags": [],
            "ingredients": ["1 chicken breast", "4 cups romaine lettuce", "1/4 cup parmesan cheese", "1/2 cup croutons", "3 tbsp Caesar dressing"]
        },
        {
            "id": "6",
            "name": "Avocado Toast",
            "cuisine_type": "American",
            "prep_time": 5,
            "uses_ingredients": ["avocado", "bread", "lemon", "salt"],
            "instructions": [
                "Toast bread until golden",
                "Mash avocado with lemon juice and salt",
                "Spread avocado mixture on toast",
                "Season with pepper and serve"
            ],
            "dietary_tags": ["vegetarian", "vegan"],
            "ingredients": ["1 ripe avocado", "2 slices bread", "1 tbsp lemon juice", "salt to taste"]
        },
        {
            "id": "7",
            "name": "Scrambled Eggs with Spinach",
            "cuisine_type": "American",
            "prep_time": 8,
            "uses_ingredients": ["eggs", "spinach", "butter", "cheese"],
            "instructions": [
                "Heat butter in non-stick pan",
                "Add spinach and cook until wilted",
                "Beat eggs and add to pan",
                "Scramble gently, add cheese before serving"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["3 eggs", "2 cups fresh spinach", "1 tbsp butter", "1/4 cup shredded cheese"]
        },
        {
            "id": "8",
            "name": "Greek Yogurt Parfait",
            "cuisine_type": "Mediterranean",
            "prep_time": 5,
            "uses_ingredients": ["yogurt", "berries", "granola", "honey"],
            "instructions": [
                "Layer yogurt in glass or bowl",
                "Add berries and granola",
                "Repeat layers",
                "Drizzle with honey"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["1 cup Greek yogurt", "1/2 cup mixed berries", "1/4 cup granola", "1 tbsp honey"]
        },
        {
            "id": "9",
            "name": "Pancakes",
            "cuisine_type": "American",
            "prep_time": 15,
            "uses_ingredients": ["flour", "milk", "eggs", "butter"],
            "instructions": [
                "Mix dry ingredients in bowl",
                "Whisk milk, eggs, and melted butter",
                "Combine wet and dry ingredients",
                "Cook on griddle until bubbles form, flip and cook until golden"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["1 cup flour", "1 cup milk", "1 egg", "2 tbsp melted butter", "1 tsp baking powder"]
        },
        {
            "id": "10",
            "name": "French Toast",
            "cuisine_type": "French",
            "prep_time": 12,
            "uses_ingredients": ["bread", "eggs", "milk", "cinnamon"],
            "instructions": [
                "Beat eggs, milk, and cinnamon",
                "Dip bread slices in mixture",
                "Cook in buttered pan until golden",
                "Serve with syrup or fruit"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["4 slices bread", "2 eggs", "1/4 cup milk", "1/2 tsp cinnamon", "butter for cooking"]
        },
        {
            "id": "11",
            "name": "Chicken Noodle Soup",
            "cuisine_type": "American",
            "prep_time": 30,
            "uses_ingredients": ["chicken", "noodles", "carrots", "celery", "onion"],
            "instructions": [
                "Sauté onion, carrots, and celery",
                "Add chicken broth and bring to boil",
                "Add chicken and noodles",
                "Simmer until noodles are tender"
            ],
            "dietary_tags": [],
            "ingredients": ["2 cups cooked chicken", "8 oz egg noodles", "2 carrots diced", "2 celery stalks", "1 onion diced", "6 cups chicken broth"]
        },
        {
            "id": "12",
            "name": "Caprese Salad",
            "cuisine_type": "Italian",
            "prep_time": 10,
            "uses_ingredients": ["tomatoes", "mozzarella", "basil", "olive oil"],
            "instructions": [
                "Slice tomatoes and mozzarella",
                "Arrange alternating on plate",
                "Add fresh basil leaves",
                "Drizzle with olive oil and balsamic"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["2 large tomatoes", "8 oz fresh mozzarella", "1/4 cup fresh basil", "2 tbsp olive oil", "1 tbsp balsamic vinegar"]
        },
        {
            "id": "13",
            "name": "Tuna Salad Sandwich",
            "cuisine_type": "American",
            "prep_time": 10,
            "uses_ingredients": ["tuna", "bread", "mayonnaise", "celery"],
            "instructions": [
                "Drain tuna and flake with fork",
                "Mix with mayonnaise and diced celery",
                "Season with salt and pepper",
                "Serve on bread with lettuce"
            ],
            "dietary_tags": [],
            "ingredients": ["1 can tuna", "2 slices bread", "2 tbsp mayonnaise", "1 celery stalk diced", "lettuce leaves"]
        },
        {
            "id": "14",
            "name": "Quinoa Bowl",
            "cuisine_type": "Mediterranean",
            "prep_time": 25,
            "uses_ingredients": ["quinoa", "chickpeas", "cucumber", "tomatoes", "feta"],
            "instructions": [
                "Cook quinoa according to package directions",
                "Dice cucumber and tomatoes",
                "Combine quinoa, vegetables, and chickpeas",
                "Top with feta and olive oil dressing"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["1 cup quinoa", "1 can chickpeas", "1 cucumber", "2 tomatoes", "1/2 cup feta cheese", "olive oil dressing"]
        },
        {
            "id": "15",
            "name": "BLT Sandwich",
            "cuisine_type": "American",
            "prep_time": 10,
            "uses_ingredients": ["bacon", "lettuce", "tomatoes", "bread"],
            "instructions": [
                "Cook bacon until crispy",
                "Toast bread slices",
                "Layer bacon, lettuce, and tomato",
                "Add mayonnaise and assemble sandwich"
            ],
            "dietary_tags": [],
            "ingredients": ["6 strips bacon", "4 leaves lettuce", "2 tomatoes sliced", "3 slices bread", "mayonnaise"]
        },
        {
            "id": "16",
            "name": "Beef Stir Fry",
            "cuisine_type": "Asian",
            "prep_time": 20,
            "uses_ingredients": ["beef", "broccoli", "bell peppers", "soy sauce", "garlic"],
            "instructions": [
                "Slice beef thinly against grain",
                "Heat oil in wok over high heat",
                "Stir-fry beef until browned",
                "Add vegetables and sauce, cook until tender-crisp"
            ],
            "dietary_tags": [],
            "ingredients": ["1 lb beef sirloin", "2 cups broccoli", "1 bell pepper", "3 tbsp soy sauce", "2 cloves garlic", "2 tbsp oil"]
        },
        {
            "id": "17",
            "name": "Spaghetti Carbonara",
            "cuisine_type": "Italian",
            "prep_time": 20,
            "uses_ingredients": ["spaghetti", "eggs", "bacon", "parmesan", "garlic"],
            "instructions": [
                "Cook spaghetti until al dente",
                "Cook bacon until crispy",
                "Beat eggs with parmesan",
                "Toss hot pasta with egg mixture and bacon"
            ],
            "dietary_tags": [],
            "ingredients": ["1 lb spaghetti", "4 eggs", "6 strips bacon", "1 cup parmesan cheese", "2 cloves garlic"]
        },
        {
            "id": "18",
            "name": "Grilled Salmon",
            "cuisine_type": "American",
            "prep_time": 15,
            "uses_ingredients": ["salmon", "lemon", "olive oil", "herbs"],
            "instructions": [
                "Preheat grill to medium-high",
                "Brush salmon with olive oil",
                "Season with herbs and lemon",
                "Grill 4-5 minutes per side"
            ],
            "dietary_tags": [],
            "ingredients": ["4 salmon fillets", "1 lemon", "2 tbsp olive oil", "mixed herbs", "salt and pepper"]
        },
        {
            "id": "19",
            "name": "Chicken Curry",
            "cuisine_type": "Indian",
            "prep_time": 35,
            "uses_ingredients": ["chicken", "onion", "tomatoes", "curry powder", "coconut milk"],
            "instructions": [
                "Sauté onion until golden",
                "Add chicken and brown",
                "Add tomatoes and curry powder",
                "Simmer with coconut milk until tender"
            ],
            "dietary_tags": [],
            "ingredients": ["2 lbs chicken thighs", "1 onion", "2 tomatoes", "2 tbsp curry powder", "1 can coconut milk"]
        },
        {
            "id": "20",
            "name": "Vegetable Lasagna",
            "cuisine_type": "Italian",
            "prep_time": 60,
            "uses_ingredients": ["lasagna noodles", "zucchini", "spinach", "ricotta", "mozzarella"],
            "instructions": [
                "Cook lasagna noodles",
                "Sauté vegetables",
                "Layer noodles, vegetables, and cheese",
                "Bake at 375°F for 45 minutes"
            ],
            "dietary_tags": ["vegetarian"],
            "ingredients": ["12 lasagna noodles", "2 zucchini", "2 cups spinach", "2 cups ricotta", "2 cups mozzarella"]
        }
    ]
    
    try:
        for recipe_data in recipes_data:
            existing = db.query(RecipeModel).filter(RecipeModel.id == recipe_data["id"]).first()
            if not existing:
                recipe = RecipeModel(**recipe_data)
                db.add(recipe)
        
        db.commit()
        print(f"Successfully added {len(recipes_data)} recipes to database")
        
    except Exception as e:
        print(f"Error populating recipes: {e}")
        db.rollback()
    finally:
        db.close()

def populate_sample_inventory(engine):
    """Add some sample inventory items for testing"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    sample_items = [
        {
            "id": "inv-1",
            "name": "Broccoli",
            "category": "Vegetables",
            "quantity": 2,
            "purchase_date": datetime.now() - timedelta(days=2),
            "expiration_date": datetime.now() + timedelta(days=3),
            "days_until_expiration": 3,
            "total_shelf_life": 5
        },
        {
            "id": "inv-2", 
            "name": "Bananas",
            "category": "Fruits",
            "quantity": 6,
            "purchase_date": datetime.now() - timedelta(days=1),
            "expiration_date": datetime.now() + timedelta(days=2),
            "days_until_expiration": 2,
            "total_shelf_life": 3
        },
        {
            "id": "inv-3",
            "name": "Tomatoes",
            "category": "Vegetables", 
            "quantity": 4,
            "purchase_date": datetime.now() - timedelta(days=3),
            "expiration_date": datetime.now() + timedelta(days=4),
            "days_until_expiration": 4,
            "total_shelf_life": 7
        }
    ]
    
    try:
        for item_data in sample_items:
            existing = db.query(InventoryItemModel).filter(InventoryItemModel.id == item_data["id"]).first()
            if not existing:
                item = InventoryItemModel(**item_data)
                db.add(item)
        
        db.commit()
        print(f"Successfully added {len(sample_items)} inventory items to database")
        
    except Exception as e:
        print(f"Error populating inventory: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating database tables...")
    engine = create_tables()
    print("Tables created successfully!")
    
    print("Populating recipes...")
    populate_recipes(engine)
    
    print("Populating sample inventory...")
    populate_sample_inventory(engine)
    
    print("Database initialization complete!")
