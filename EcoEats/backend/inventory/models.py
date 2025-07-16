from django.db import models

class InventoryItem(models.Model):
    """
    Represents a food item in the user's inventory.
    """
    name = models.CharField(max_length=100)  # Name of the item (e.g., "Milk")
    quantity = models.FloatField()  # Quantity available (e.g., 1.5 for 1.5 gallons)
    unit = models.CharField(max_length=20)  # Unit of measurement (e.g., "gallon", "dozen")
    purchase_date = models.DateField()  # When the item was purchased
    expiration_date = models.DateField()  # When the item will expire
    added_at = models.DateTimeField(auto_now_add=True)  # Timestamp when item was added

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"
   