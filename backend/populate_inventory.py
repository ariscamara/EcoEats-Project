import os
import sys
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import InventoryItem
from database import Base
import uuid

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ecoeats_user:secure_password_123@ecoeats-db.c123456789.us-east-2.rds.amazonaws.com:5432/ecoeats_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def add_inventory_items():
    db = SessionLocal()
    
    try:
        inventory_items = [
            {
                "name": "Eggs",
                "category": "Dairy & Eggs",
                "quantity": 12,
                "days_until_expiration": 7,
                "total_shelf_life": 21
            },
            {
                "name": "Flour",
                "category": "Pantry",
                "quantity": 1000,
                "days_until_expiration": 180,
                "total_shelf_life": 365
            },
            {
                "name": "Butter",
                "category": "Dairy & Eggs",
                "quantity": 250,
                "days_until_expiration": 14,
                "total_shelf_life": 30
            },
            {
                "name": "Onions",
                "category": "Vegetables",
                "quantity": 3,
                "days_until_expiration": 21,
                "total_shelf_life": 30
            },
            {
                "name": "Garlic",
                "category": "Vegetables",
                "quantity": 1,
                "days_until_expiration": 30,
                "total_shelf_life": 60
            },
            {
                "name": "Chicken Breast",
                "category": "Meat",
                "quantity": 500,
                "days_until_expiration": 3,
                "total_shelf_life": 5
            },
            {
                "name": "Ground Beef",
                "category": "Meat",
                "quantity": 400,
                "days_until_expiration": 2,
                "total_shelf_life": 3
            },
            {
                "name": "Rice",
                "category": "Pantry",
                "quantity": 1000,
                "days_until_expiration": 365,
                "total_shelf_life": 730
            },
            {
                "name": "Pasta",
                "category": "Pantry",
                "quantity": 500,
                "days_until_expiration": 300,
                "total_shelf_life": 365
            },
            {
                "name": "Cheese",
                "category": "Dairy & Eggs",
                "quantity": 200,
                "days_until_expiration": 10,
                "total_shelf_life": 21
            },
            {
                "name": "Milk",
                "category": "Dairy & Eggs",
                "quantity": 1000,
                "days_until_expiration": 5,
                "total_shelf_life": 7
            },
            {
                "name": "Bread",
                "category": "Bakery",
                "quantity": 1,
                "days_until_expiration": 4,
                "total_shelf_life": 7
            },
            {
                "name": "Potatoes",
                "category": "Vegetables",
                "quantity": 5,
                "days_until_expiration": 14,
                "total_shelf_life": 21
            },
            {
                "name": "Carrots",
                "category": "Vegetables",
                "quantity": 6,
                "days_until_expiration": 12,
                "total_shelf_life": 21
            },
            {
                "name": "Spinach",
                "category": "Vegetables",
                "quantity": 100,
                "days_until_expiration": 3,
                "total_shelf_life": 7
            },
            {
                "name": "Mushrooms",
                "category": "Vegetables",
                "quantity": 200,
                "days_until_expiration": 5,
                "total_shelf_life": 10
            },
            {
                "name": "Bell Peppers",
                "category": "Vegetables",
                "quantity": 3,
                "days_until_expiration": 8,
                "total_shelf_life": 14
            },
            {
                "name": "Olive Oil",
                "category": "Pantry",
                "quantity": 500,
                "days_until_expiration": 365,
                "total_shelf_life": 730
            },
            {
                "name": "Salt",
                "category": "Pantry",
                "quantity": 500,
                "days_until_expiration": 1825,
                "total_shelf_life": 3650
            },
            {
                "name": "Lemon",
                "category": "Fruits",
                "quantity": 3,
                "days_until_expiration": 6,
                "total_shelf_life": 14
            }
        ]
        
        for item_data in inventory_items:
            purchase_date = datetime.now() - timedelta(days=(item_data["total_shelf_life"] - item_data["days_until_expiration"]))
            expiration_date = datetime.now() + timedelta(days=item_data["days_until_expiration"])
            
            inventory_item = InventoryItem(
                id=str(uuid.uuid4()),
                name=item_data["name"],
                category=item_data["category"],
                quantity=item_data["quantity"],
                purchase_date=purchase_date,
                expiration_date=expiration_date,
                days_until_expiration=item_data["days_until_expiration"],
                total_shelf_life=item_data["total_shelf_life"]
            )
            
            db.add(inventory_item)
        
        db.commit()
        print(f"Successfully added {len(inventory_items)} inventory items to the database")
        
        for item in inventory_items:
            print(f"  - {item['name']} (expires in {item['days_until_expiration']} days)")
            
    except Exception as e:
        db.rollback()
        print(f"Error adding inventory items: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    add_inventory_items()
