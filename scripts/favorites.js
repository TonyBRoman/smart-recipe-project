import { fetchUnsplashImage } from "./unsplash.js";
import { loadHeaderFooter } from "./loadHeaderFooter.js";

loadHeaderFooter();

const container = document.getElementById("favoritesSection");

document.addEventListener("DOMContentLoaded", () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    container.innerHTML = "<p>You have no favorite recipes yet.</p>";
    return;
  }

  container.innerHTML = "";

  favorites.forEach(async (recipe, index) => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");

    const imageUrl = await fetchUnsplashImage(recipe.title) || recipe.image;

    card.style.animationDelay = `${index * 100}ms`;

    card.innerHTML = `
      <img src="${imageUrl}" alt="${recipe.title}" />
      <h3>${recipe.title}</h3>
      <a href="recipe.html?id=${recipe.id}" class="details-btn">View Details</a>
      <button class="remove-btn" data-id="${recipe.id}">🗑️ Remove</button>
    `;

    container.appendChild(card);

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFavorite(recipe.id);
    });
  });
});

function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(r => r.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  location.reload();
}
