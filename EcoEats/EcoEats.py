from flask import Flask, render_template, request, redirect, url_for

# Initialize the Flask application
app = Flask(__name__)

# Hardcoded Recipe Data
# This dictionary stores all the available recipes.
# Each key is the recipe name (lowercase for easy lookup), and its value is another dictionary
# containing 'ingredients' (a list of strings) and 'instructions' (a list of strings for steps).
recipes = {
    "scrambled eggs": {
        "ingredients": ["eggs", "milk", "butter", "salt", "pepper"],
        "instructions": [
            "Crack eggs into a bowl, add a splash of milk, salt, and pepper.",
            "Whisk until yolks and whites are combined.",
            "Melt butter in a non-stick pan over medium heat.",
            "Pour in the egg mixture.",
            "Stir gently with a spatula, pushing cooked egg from the edges to the center.",
            "Cook until desired consistency is reached (usually 3-5 minutes). Serve immediately."
        ]
    },
    "pasta with tomato sauce": {
        "ingredients": ["pasta", "canned tomatoes", "onion", "garlic", "olive oil", "salt", "basil"],
        "instructions": [
            "Cook pasta according to package directions until al dente.",
            "While pasta cooks, heat olive oil in a pan over medium heat.",
            "Add chopped onion and sauté until softened (about 5 minutes).",
            "Add minced garlic and cook for 1 minute until fragrant.",
            "Pour in canned tomatoes, crush them with a spoon, and season with salt.",
            "Simmer for 15-20 minutes, allowing the sauce to thicken.",
            "Stir in fresh basil.",
            "Drain pasta and add it to the sauce, tossing to combine. Serve hot."
        ]
    },
    "tuna sandwich": {
        "ingredients": ["canned tuna", "mayonnaise", "celery", "bread", "salt", "pepper"],
        "instructions": [
            "Drain canned tuna.",
            "In a bowl, flake the tuna with a fork.",
            "Add mayonnaise, finely chopped celery, salt, and pepper.",
            "Mix well until all ingredients are combined.",
            "Spread the tuna mixture evenly on slices of bread. Serve."
        ]
    },
    "bean tacos": {
        "ingredients": ["canned beans", "tortillas", "onion", "garlic", "chili powder", "cumin", "lettuce", "cheese", "salsa"],
        "instructions": [
            "Drain and rinse canned beans.",
            "In a pan, sauté chopped onion and minced garlic until softened.",
            "Add beans, chili powder, and cumin. Mash some of the beans to create a creamier texture.",
            "Heat tortillas according to package directions.",
            "Fill tortillas with the bean mixture.",
            "Top with shredded lettuce, cheese, and salsa. Serve immediately."
        ]
    },
    "stir fried rice": {
        "ingredients": ["cooked rice", "eggs", "soy sauce", "vegetable oil", "carrots", "peas", "onion", "garlic"],
        "instructions": [
            "Heat vegetable oil in a large wok or pan over high heat.",
            "Add chopped onion and cook for 1 minute.",
            "Add minced garlic, diced carrots, and peas. Stir-fry for 3-4 minutes until vegetables are tender-crisp.",
            "Push vegetables to one side of the pan. Pour whisked eggs into the empty side and scramble them.",
            "Once eggs are cooked, break them into smaller pieces and mix with the vegetables.",
            "Add cooked rice to the pan.",
            "Pour soy sauce over the rice and vegetables. Stir-fry, breaking up any clumps of rice, until everything is well combined and heated through (about 5 minutes). Serve hot."
        ]
    }
}

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        user_ingredients_str = request.form.get("ingredients")
        # Split the input string by comma, strip leading/trailing whitespace, and convert to lowercase.
        # This makes the ingredient matching case-insensitive and flexible to user input format.
        user_ingredients = [ing.strip().lower() for ing in user_ingredients_str.split(",") if ing.strip()]
        # Redirect to the recipes page, passing the processed ingredients as a comma-separated string
        return redirect(url_for("show_recipes", ingredients=",".join(user_ingredients)))
    # For GET requests, render the index.html template (the ingredient input form)
    return render_template("index.html")

@app.route("/recipes")
def show_recipes():
    # Get the 'ingredients' query parameter from the URL. Default to an empty string if not present.
    ingredients_param = request.args.get("ingredients", "")
    # Process the user ingredients from the URL parameter, similar to how they were processed in the index route.
    user_ingredients = [ing.strip().lower() for ing in ingredients_param.split(",") if ing.strip()]

    matched_recipes = []
    # Iterate through all hardcoded recipes
    for recipe_name, data in recipes.items():
        if all(ing in data["ingredients"] for ing in user_ingredients):
            matched_recipes.append({"name": recipe_name.title(), "ingredients": data["ingredients"]})

    # Render the recipes.html template, passing the matched recipes and the original user ingredients
    return render_template("recipes.html", recipes=matched_recipes, user_ingredients=user_ingredients)

@app.route("/recipe/<recipe_name>")
def show_instructions(recipe_name):
    # Convert the URL recipe name to lowercase to match the keys in the 'recipes' dictionary.
    recipe_key = recipe_name.lower()
    # Retrieve the recipe data using the lowercase key.
    recipe_data = recipes.get(recipe_key)

    # Render the instructions.html template, passing the recipe details for display.
    # recipe_name.title() is used to present the recipe name cleanly like "Scrambled Eggs".
    return render_template("instructions.html",
                           recipe_name=recipe_name.title(),
                           ingredients=recipe_data["ingredients"],
                           instructions=recipe_data["instructions"])

# This ensures that the Flask development server runs only when the script is executed directly.
if __name__ == "__main__":
    # app.run(debug=True) enables debug mode
    # and automatically reloads the server on code changes.
    app.run(debug=True)


