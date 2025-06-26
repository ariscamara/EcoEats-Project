# EcoEats-Project
Smart Food Waste Reduction Application

## Table of Contents
- [About EcoEats](#about-ecoeats)
- [Motivation](#motivation)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [How to Use](#how-to-use)
- [Technical Challenges](#technical-challenges)
- [Team](#team)
- [Release Notes](#release-notes)

## About EcoEats

EcoEats is an intelligent web application designed to combat household food waste. It provides a comprehensive food management system that transforms how households interact with their groceries by combining sophisticated food tracking with AI-powered recipe generation. Our goal is to help users utilize their ingredients before they spoil, turning potential waste into easily planned meals and piece of mind.

## Motivation

Food waste is a significant environmental and economic challenge in the United States, with households discarding 30-40% of their food supply annually. This contributes to financial losses for families and generates harmful methane emissions in landfills. A primary driver of this waste at the consumer level is poor food management practices – busy lifestyles often lead to forgotten purchase dates and expiration timelines, resulting in spoiled produce, expired dairy, and neglected leftovers.

Existing solutions often fall short, focusing either solely on tracking or providing ingredient-based recipes without considering expiration urgency. EcoEats fills this gap by offering an integrated solution that not only monitors food freshness but also proactively suggests recipes specifically designed to use ingredients nearing their expiration dates. By empowering consumers, the end-users of the food supply chain, we aim to achieve the highest possible reduction in food waste.

## Core Features

EcoEats streamlines the food management process through three primary services:

1.  **Smart Food Inventory Input:**
    * A streamlined interface for users to input their grocery data.
    * Automatic assignment of estimated expiration timelines based on a comprehensive food database.

2.  **Real-time Freshness Dashboard & Alerts:**
    * A dynamic dashboard providing clear visibility into the freshness status of all stored food items.
    * Proactive alerts to notify users as items approach their expiration dates, preventing spoilage.

3.  **AI-Powered Recipe Generation:**
    * A unique "spoilage feature" that tracks ingredients nearing expiration.
    * Customized recipe suggestions that prioritize the use of these soon-to-expire items.
    * AI-powered creation of multiple meal options, offering flexibility and maximizing ingredient utilization. The system intelligently identifies combinations of ingredients expiring around the same time and generates recipes incorporating them (e.g., salad-based meals for lettuce, tomatoes, and cheese expiring soon).

## Technology Stack

EcoEats is being developed using:

* **Primary Language:** Python
* **Web Framework:** Flask (for backend processing and web application development)
* **Frontend:** HTML, CSS (potentially Tailwind for styling)
* **Database:** (To be implemented) A comprehensive food database for expiration timelines, storage, and variations.
* **AI Integration:** Future integration with machine learning models or APIs (e.g., OpenAI's GPT models) for sophisticated recipe generation.

## How to Use

To run the EcoEats application locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/EcoEats.git](https://github.com/your-username/EcoEats.git)
    cd EcoEats
    ```
2.  **Set up a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install Flask
    ```
4.  **Run the application:**
    ```bash
    python app.py
    ```
5.  **Access the application:**
    Open your web browser and navigate to `http://127.0.0.1:5000/`.

### Basic Usage:

Currently, the application allows you to:

* **Enter Ingredients:** On the homepage, type a comma-separated list of ingredients you have (e.g., `eggs, milk, butter`).
* **Find Recipes:** Submit the ingredients to see a list of recipes you can make with *all* of the ingredients you provided.
* **View Instructions:** Click on a suggested recipe name to view its detailed ingredients and step-by-step instructions.

## Technical Challenges

Developing EcoEats involves several complex technical hurdles:

* **Accurate Expiration Prediction:** Building a reliable system that accounts for varied storage conditions, purchase freshness, and item characteristics.
* **Feasible & Appetizing AI-Generated Recipes:** Balancing ingredient utilization with meal quality, flavor compatibility, cooking complexity, and cultural appropriateness.
* **User Engagement:** Overcoming the behavioral challenge of manual food entry by providing sufficient value and a streamlined user experience.
* **Scalability:** Maintaining responsive performance for database queries, recipe generation, and notifications as the user base grows.
* **Component Integration:** Coordinating multiple technical components (database, AI, UI, notifications) into a cohesive and reliable application.

## Team

Our diverse team brings a range of skills to successfully develop EcoEats:

* **Carlos Jordan:** Project Manager, AI and Machine Learning Engineer
* **Aristide Camara:** Requirements Engineer
* **Sophia Harding:** Frontend & UI Developer, Quality Analyst
* **Komlan Akakpo:** Architect

Roles of Scribe and Tech Support will be shared among all team members.

## Release Notes

### Milestone 1 (Current Working Version)

**What's currently working:**

* **Basic Recipe Lookup:** Users can input a comma-separated list of ingredients.
* **Ingredient-Based Filtering:** The application matches provided ingredients against a hardcoded database of recipes.
* **Recipe Display:** If a match is found (meaning the user has *all* ingredients for a recipe), the recipe name is displayed.
* **Instruction Viewing:** Clicking on a displayed recipe name navigates the user to a page showing the full list of ingredients and step-by-step instructions for that recipe.
* **Hardcoded Recipes:** The application currently uses a fixed set of recipes (Scrambled Eggs, Pasta with Tomato Sauce, Tuna Sandwich, Bean Tacos, Stir Fried Rice) with their respective ingredients and instructions.

**Limitations of this release:**

* **No Food Inventory Management:** The application does not yet track individual food items, expiration dates, or freshness status.
* **No AI Recipe Generation:** Recipe suggestions are based purely on exact ingredient matches from a static list, not dynamic AI creation or prioritization of expiring items.
* **No User Accounts/Persistence:** Data is not saved between sessions.
* **No Barcode Scanning or Automated Input:** All ingredient input is manual.
* **No Alerts or Dashboard:** The core dashboard and expiration alert features are not yet implemented.
* **Limited Recipe Database:** Recipes are hardcoded, not dynamic or extensible.
* **No Dietary Preferences:** Dietary restrictions are not considered in recipe matching.

This initial release establishes the foundational web application structure and demonstrates basic recipe retrieval based on user-provided ingredients. Future milestones will build upon this to incorporate the full suite of EcoEats features.
