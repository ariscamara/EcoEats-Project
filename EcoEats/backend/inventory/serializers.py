# inventory/serializers.py

from rest_framework import serializers
from .models import InventoryItem

# Serializer to convert InventoryItem objects to/from JSON
class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'  # include all model fields
