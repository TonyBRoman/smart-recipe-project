import { fetchUnsplashImage } from "./unsplash.js";
import { loadHeaderFooter } from "./loadHeaderFooter.js";
import { createAddToDayButton } from "./addToDayButton.js";

loadHeaderFooter();

const API_KEY = "ffe5303e839d4e03834efa15bb49de01";
const recipeDetail = document.getElementById("recipeDetail");

const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");
let currentRecipe = null; 

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
    currentRecipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image
    };

    const imageUrl = await fetchUnsplashImage(recipe.title) || recipe.image;
    renderRecipe(recipe, imageUrl);

  } catch (error) {
    recipeDetail.innerHTML = "<p>Could not load recipe details.</p>";
    console.error(error);
  }
}

function renderRecipe(recipe, imageUrl) {
  recipeDetail.innerHTML = `
    <img src="${imageUrl}" alt="${recipe.title}" class="recipe-image" />
    <h2>${recipe.title}</h2>

    <div class="recipe-buttons">
      <button id="favButton">❤️ Add to Favorites</button>
      <div id="addToDayContainer"></div>
    </div>

    <div class="recipe-meta">
      <h3>Ingredients</h3>
      <ul>
        ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
      </ul>

      <h3>Instructions</h3>
      <p>${recipe.instructions || "No instructions available."}</p>
    </div>
  `;

  const favButton = document.getElementById("favButton");
  if (favButton) {
    favButton.addEventListener("click", () => {
      addToFavorites(currentRecipe);
    });
  }

  const addToDayContainer = document.getElementById("addToDayContainer");
  const addToDayBtn = createAddToDayButton(currentRecipe, (recipe, selectedDay) => {
    let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
    if (!mealPlan[selectedDay]) mealPlan[selectedDay] = [];

    if (!mealPlan[selectedDay].some(r => r.id === recipe.id)) {
      mealPlan[selectedDay].push(recipe);
      localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
      alert(`Recipe added to ${selectedDay}!`);
    } else {
      alert("Recipe already added to this day.");
    }
  });
  addToDayContainer.appendChild(addToDayBtn);
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

