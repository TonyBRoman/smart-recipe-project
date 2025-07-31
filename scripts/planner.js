import { fetchUnsplashImage } from "./unsplash.js";
import { loadHeaderFooter } from "./loadHeaderFooter.js";

loadHeaderFooter();

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const calendar = document.getElementById("calendar");
const favoritesList = document.getElementById("favoritesList");

days.forEach(day => {
  const column = document.createElement("div");
  column.classList.add("day-column");
  column.setAttribute("data-day", day);
  column.innerHTML = `<h3>${day}</h3>`;
  column.addEventListener("dragover", e => e.preventDefault());
  column.addEventListener("drop", handleDrop);
  calendar.appendChild(column);

  if (mealPlan[day]) {
    mealPlan[day].forEach(async recipe => {
      const card = await createRecipeCard(recipe);
      column.appendChild(card);
    });
  }
});

favorites.forEach(async recipe => {
  const card = await createRecipeCard(recipe, true);
  favoritesList.appendChild(card);
});

async function createRecipeCard(recipe, draggable = false) {
  const card = document.createElement("div");
  card.classList.add("recipe-card");

  const imageUrl = await fetchUnsplashImage(recipe.title) || recipe.image;

  card.innerHTML = `
    <img src="${imageUrl}" alt="${recipe.title}" />
    <h3>${recipe.title}</h3>
    <a href="recipe.html?id=${recipe.id}" class="details-btn">View Details</a>
    <button class="remove-btn" title="Remove">🗑️</button>
  `;

  if (draggable) {
    card.setAttribute("draggable", "true");
    card.setAttribute("data-id", recipe.id);
    card.setAttribute("data-title", recipe.title);
    card.setAttribute("data-img", recipe.image);

    card.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", JSON.stringify(recipe));
    });

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromPlan(recipe);
      card.remove();
    });
  }

  return card;
}

async function handleDrop(e) {
  const data = e.dataTransfer.getData("text/plain");
  const recipe = JSON.parse(data);
  const day = this.getAttribute("data-day");

  const existingTitles = Array.from(this.querySelectorAll("h3")).map(h => h.textContent);
  if (existingTitles.includes(recipe.title)) return;

  const card = await createRecipeCard(recipe);
  this.appendChild(card);
  saveToPlan(day, recipe);
}

function saveToPlan(day, recipe) {
  let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
  if (!mealPlan[day]) mealPlan[day] = [];

  if (!mealPlan[day].some(r => r.id === recipe.id)) {
    mealPlan[day].push(recipe);
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }
}

function removeFromPlan(recipeToRemove) {
  let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};

  for (const day in mealPlan) {
    mealPlan[day] = mealPlan[day].filter(r => r.id !== recipeToRemove.id);
  }

  localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
}

const clearBtn = document.getElementById("clearPlannerBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all planned meals?")) {
      localStorage.removeItem("mealPlan");

      document.querySelectorAll(".day-column").forEach(column => {
        column.querySelectorAll(".recipe-card").forEach(card => card.remove());
      });
    }
  });
}

