import { loadHeaderFooter } from "./loadHeaderFooter.js";
import { fetchUnsplashImage } from "./unsplash.js";

loadHeaderFooter();

const API_KEY = "ffe5303e839d4e03834efa15bb49de01";
const recipesContainer = document.getElementById("recipesContainer");

async function getAllRecipes() {
  try {
    const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=25&addRecipeInformation=true`);
    if (!res.ok) throw new Error("Error fetching recipes");

    const data = await res.json();
    renderRecipes(data.results);
  } catch (error) {
    recipesContainer.innerHTML = "<p>Could not load recipes.</p>";
    console.error(error);
  }
}

async function renderRecipes(recipes) {
  recipesContainer.innerHTML = "";

  for (let recipe of recipes) {
    const imageUrl = await fetchUnsplashImage(recipe.title) || recipe.image;

    const card = document.createElement("div");
    card.classList.add("recipe-card");

    card.innerHTML = `
      <img src="${imageUrl}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <a href="recipe.html?id=${recipe.id}" class="details-btn">View Details</ahild(card);
  }
}

getAllRecipes();

