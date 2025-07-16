# inventory/views.py

from rest_framework import viewsets
from .models import InventoryItem
from .serializers import InventoryItemSerializer

# ViewSet automatically provides list(), retrieve(), create(), update(), delete()
class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
