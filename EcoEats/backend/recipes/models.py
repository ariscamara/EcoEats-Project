from django.db import models

class Recipe(models.Model):
    """
    Represents a recipe that can use inventory items.
    """
    name = models.CharField(max_length=100)  # Recipe name (e.g., "Omelette")
    cuisine_type = models.CharField(max_length=50, blank=True)  # Optional cuisine type (e.g., "Italian")
    prep_time = models.IntegerField()  # Prep time in minutes
    instructions = models.TextField()  # Full instructions

    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    """
    Represents a link between a recipe and its ingredients.
    """
    recipe = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # Ingredient name (e.g., "Eggs")
    quantity = models.FloatField()  # Amount needed
    unit = models.CharField(max_length=20)  # Measurement unit (e.g., "pieces", "cups")

    def __str__(self):
        return f"{self.quantity} {self.unit} {self.name} for {self.recipe.name}"
