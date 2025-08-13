import { fetchUnsplashImage } from "./unsplash.js";
import { loadHeaderFooter } from "./loadHeaderFooter.js";
import { createAddToDayButton } from "./addToDayButton.js";
import { showToast } from "./toast.js";

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
    currentRecipe = recipe;

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
    <button id="favButton">❤️ Add to Favorites</button>
    <div id="addToDayContainer"></div>

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
  const addToDayBtn = createAddToDayButton(
    {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image
    },
    (recipe, selectedDay) => {
      saveToPlan(selectedDay, recipe);
      showToast(`Added "${recipe.title}" to ${selectedDay}`, "success");
    }
  );
  addToDayContainer.appendChild(addToDayBtn);
}

function addToFavorites(recipe) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (!favorites.some(r => r.id === recipe.id)) {
    favorites.push({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image
    });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showToast("Recipe added to favorites!", "success");
  } else {
    showToast("Recipe already in favorites.", "error");
  }
}


function saveToPlan(day, recipe) {
  let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
  if (!mealPlan[day]) mealPlan[day] = [];

  if (!mealPlan[day].some(r => r.id === recipe.id)) {
    mealPlan[day].push(recipe);
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }
}
