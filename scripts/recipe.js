import { fetchUnsplashImage } from "./unsplash.js";

const API_KEY = "ffe5303e839d4e03834efa15bb49de01";
const recipeDetail = document.getElementById("recipeDetail");

const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

if (recipeId) {
  getRecipeDetails(recipeId);
} else {
  recipeDetail.innerHTML = "<p>Recipe ID not found.</p>";
}

async function getRecipeDetails(id) {
  try {
    const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
    if (!res.ok) throw new Error("No data");

    const recipe = await res.json();
    const imageUrl = await fetchUnsplashImage(recipe.title) || recipe.image;

    renderRecipe(recipe, imageUrl);
  } catch (error) {
    recipeDetail.innerHTML = "<p>Could not load recipe details.</p>";
    console.error(error);
  }
}

function renderRecipe(recipe, imageUrl) {
  recipeDetail.innerHTML = `
  <button class="fav-btn" data-id="${recipe.id}" data-title="${recipe.title}" data-img="${recipe.image}">❤️ Add to Favorites</button>
  <h2>${recipe.title}</h2>
  <img src="${imageUrl}" alt="${recipe.title}" style="width:100%;max-width:600px;border-radius:8px;"/>
  <h3>Ingredients:</h3>
  <ul>
    ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
  </ul>
  <h3>Instructions:</h3>
  <p>${recipe.instructions || "No instructions available."}</p>
  `;
}
