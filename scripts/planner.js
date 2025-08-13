import { fetchUnsplashImage } from "./unsplash.js";
import { loadHeaderFooter } from "./loadHeaderFooter.js";
import { createAddToDayButton } from "./addToDayButton.js";
import { showToast } from "./toast.js"; 

loadHeaderFooter();

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const calendar = document.getElementById("calendar");
const favoritesList = document.getElementById("favoritesList");

// Create columns for each day of the week
days.forEach(day => {
  const column = document.createElement("div");
  column.classList.add("day-column");
  column.setAttribute("data-day", day);
  column.innerHTML = `<h3>${day}</h3>`;
  calendar.appendChild(column);

  if (mealPlan[day]) {
    mealPlan[day].forEach(async recipe => {
      const card = await createRecipeCard(recipe, false, 0, day);
      column.appendChild(card);
    });
  }
});

// Show the favorites section
favorites.forEach(async (recipe, index) => {
  const card = await createRecipeCard(recipe, true, index);
  favoritesList.appendChild(card);
});

async function createRecipeCard(recipe, isFavorite = false, index = 0, assignedDay = null) {
  const card = document.createElement("div");
  card.classList.add("recipe-card");

  const imageUrl = await fetchUnsplashImage(recipe.title) || recipe.image;

  if (isFavorite) {
    card.style.animationDelay = `${index * 100}ms`;
  }

  // Card Content
  card.innerHTML = `
    <img src="${imageUrl}" alt="${recipe.title}" />
    <h3>${recipe.title}</h3>
    <a href="recipe.html?id=${recipe.id}" class="details-btn">View Details</a>
    <button class="remove-btn" title="Remove">🗑️</button>
  `;

  const removeBtn = card.querySelector(".remove-btn");

  if (isFavorite) {
    // Import the addToDayButton.js function
    const addToDayBtn = createAddToDayButton(recipe, (recipe, selectedDay) => {
      const column = document.querySelector(`.day-column[data-day="${selectedDay}"]`);
      if (column) {
        createRecipeCard(recipe, false, 0, selectedDay).then(card => {
          column.appendChild(card);
          saveToPlan(selectedDay, recipe);
          showToast(`Added "${recipe.title}" to ${selectedDay}`, "success"); // ✅ Toast al agregar
        });
      }
    });

    card.appendChild(addToDayBtn);

    removeBtn.addEventListener("click", () => {
      removeFromPlan(recipe);
      card.remove();
      showToast(`Removed "${recipe.title}" from all days`, "error"); // ✅ Toast al eliminar
    });

  } else {
    removeBtn.addEventListener("click", () => {
      const day = assignedDay || card.closest(".day-column")?.getAttribute("data-day");
      if (day) {
        removeFromDayPlan(day, recipe.id);
        card.remove();
        showToast(`Removed "${recipe.title}" from ${day}`, "error"); // ✅ Toast al eliminar de un día
      }
    });
  }

  return card;
}

// Save recipe to the meal plan for a specific day
function saveToPlan(day, recipe) {
  let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
  if (!mealPlan[day]) mealPlan[day] = [];

  if (!mealPlan[day].some(r => r.id === recipe.id)) {
    mealPlan[day].push(recipe);
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }
}

// Delete recipe from the meal plan
function removeFromPlan(recipeToRemove) {
  let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
  for (const day in mealPlan) {
    mealPlan[day] = mealPlan[day].filter(r => r.id !== recipeToRemove.id);
  }
  localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
}

// Delete recipe from a specific day's plan
function removeFromDayPlan(day, recipeId) {
  let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
  if (!mealPlan[day]) return;

  mealPlan[day] = mealPlan[day].filter(r => r.id !== recipeId);
  localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
}

// Delete all planned meals
const clearBtn = document.getElementById("clearPlannerBtn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all planned meals?")) {
      localStorage.removeItem("mealPlan");
      document.querySelectorAll(".day-column").forEach(column => {
        column.querySelectorAll(".recipe-card").forEach(card => card.remove());
      });
      showToast("All planned meals cleared", "error"); 
    }
  });
}
