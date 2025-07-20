from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from dotenv import load_dotenv

from database import get_db
from models import Recipe as RecipeModel, InventoryItem as InventoryItemModel
from schemas import Recipe, RecipeCreate, InventoryItem, InventoryItemCreate, InventoryItemUpdate
from recommendation_engine import get_recipe_recommendations

load_dotenv()

app = FastAPI(title="EcoEats API", description="Smart food waste reduction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "EcoEats API is running"}

@app.get("/api/recipes/", response_model=List[Recipe])
async def get_recipes(db: Session = Depends(get_db)):
    recipes = db.query(RecipeModel).all()
    return recipes

@app.get("/api/recipes/suggestions/", response_model=List[Recipe])
async def get_recipe_suggestions(db: Session = Depends(get_db)):
    try:
        inventory_items = db.query(InventoryItemModel).all()
        print(f"Found {len(inventory_items)} inventory items")
        for item in inventory_items:
            print(f"  - {item.name} (expires in {item.days_until_expiration} days)")
        
        recommendations = get_recipe_recommendations(db, inventory_items)
        print(f"Generated {len(recommendations)} recommendations")
        return recommendations
    except Exception as e:
        print(f"Error in get_recipe_suggestions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/recipes/{recipe_id}/", response_model=Recipe)
async def get_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = db.query(RecipeModel).filter(RecipeModel.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.get("/api/inventory/", response_model=List[InventoryItem])
async def get_inventory(db: Session = Depends(get_db)):
    items = db.query(InventoryItemModel).all()
    return items

@app.post("/api/inventory/", response_model=InventoryItem)
async def create_inventory_item(item: InventoryItemCreate, db: Session = Depends(get_db)):
    db_item = InventoryItemModel(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/api/inventory/{item_id}/", response_model=InventoryItem)
async def get_inventory_item(item_id: str, db: Session = Depends(get_db)):
    item = db.query(InventoryItemModel).filter(InventoryItemModel.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item

@app.put("/api/inventory/{item_id}/", response_model=InventoryItem)
async def update_inventory_item(item_id: str, item_update: InventoryItemUpdate, db: Session = Depends(get_db)):
    db_item = db.query(InventoryItemModel).filter(InventoryItemModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    for field, value in item_update.dict(exclude_unset=True).items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/inventory/{item_id}/")
async def delete_inventory_item(item_id: str, db: Session = Depends(get_db)):
    db_item = db.query(InventoryItemModel).filter(InventoryItemModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted successfully"}

@app.post("/api/inventory/{item_id}/mark-used/")
async def mark_item_as_used(item_id: str, db: Session = Depends(get_db)):
    db_item = db.query(InventoryItemModel).filter(InventoryItemModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item marked as used"}

@app.post("/api/inventory/{item_id}/mark-discarded/")
async def mark_item_as_discarded(item_id: str, db: Session = Depends(get_db)):
    db_item = db.query(InventoryItemModel).filter(InventoryItemModel.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item marked as discarded"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
