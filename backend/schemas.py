from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RecipeBase(BaseModel):
    name: str
    cuisine_type: str
    prep_time: int
    uses_ingredients: List[str]
    instructions: List[str]
    dietary_tags: List[str]
    ingredients: List[str]

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class InventoryItemBase(BaseModel):
    name: str
    category: str
    quantity: int
    purchase_date: datetime
    expiration_date: datetime
    days_until_expiration: int
    total_shelf_life: int

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    purchase_date: Optional[datetime] = None
    expiration_date: Optional[datetime] = None
    days_until_expiration: Optional[int] = None
    total_shelf_life: Optional[int] = None

class InventoryItem(InventoryItemBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
