from sqlalchemy import Column, String, Integer, DateTime, JSON, Float
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime

class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    cuisine_type = Column(String, nullable=False)
    prep_time = Column(Integer, nullable=False)
    uses_ingredients = Column(JSON, nullable=False)
    instructions = Column(JSON, nullable=False)
    dietary_tags = Column(JSON, nullable=False)
    ingredients = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    purchase_date = Column(DateTime, nullable=False)
    expiration_date = Column(DateTime, nullable=False)
    days_until_expiration = Column(Integer, nullable=False)
    total_shelf_life = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
