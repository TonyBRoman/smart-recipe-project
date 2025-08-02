import { fetchRecipesByIngredients } from "./api.js";
import { fetchUnsplashImage } from "./unsplash.js";
import { loadHeaderFooter } from "./loadHeaderFooter.js";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ingredientForm");
  const input = document.getElementById("ingredientsInput");
  const resultsSection = document.getElementById("recipeResults");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ingredients = input.value.trim();

    if (!ingredients) return;

    const recipes = await fetchRecipesByIngredients(ingredients);
    renderRecipes(recipes);
  });

  async function renderRecipes(recipes) {
    resultsSection.innerHTML = "";

    if (recipes.length === 0) {
      resultsSection.innerHTML = "<p>No recipes found. Try other ingredients.</p>";
      return;
    }

    
    recipes.forEach(async (recipe, index) => {
      const imageUrl = await fetchUnsplashImage(recipe.title) || recipe.image;

      const card = document.createElement("div");
      card.classList.add("recipe-card");
      card.style.animationDelay = `${index * 100}ms`;

      card.innerHTML = `
        <img src="${imageUrl}" alt="${recipe.title}" />
        <h3>${recipe.title}</h3>
        <a href="recipe.html?id=${recipe.id}" class="details-btn">View Details</a>
      `;

      resultsSection.appendChild(card);
    });
  }

  function addToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.some(r => r.id === recipe.id)) {
      favorites.push(recipe);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Recipe added to favorites!");
    } else {
      alert("Recipe already in favorites.");
    }
  }
});
