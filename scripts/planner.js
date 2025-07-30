const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const calendar = document.getElementById("calendar");
const favoritesList = document.getElementById("favoritesList");

// Render days
days.forEach(day => {
  const column = document.createElement("div");
  column.classList.add("day-column");
  column.setAttribute("data-day", day);
  column.innerHTML = `<h3>${day}</h3>`;
  column.addEventListener("dragover", e => e.preventDefault());
  column.addEventListener("drop", handleDrop);
  calendar.appendChild(column);
});

// Render favorites
favorites.forEach(recipe => {
  const card = document.createElement("div");
  card.classList.add("recipe-card");
  card.setAttribute("draggable", "true");
  card.setAttribute("data-id", recipe.id);
  card.setAttribute("data-title", recipe.title);
  card.setAttribute("data-img", recipe.image);

  card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}" />
    <h3>${recipe.title}</h3>
  `;

  card.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", JSON.stringify(recipe));
  });

  favoritesList.appendChild(card);
});

// Handle drop on calendar
function handleDrop(e) {
  const data = e.dataTransfer.getData("text/plain");
  const recipe = JSON.parse(data);
  const day = this.getAttribute("data-day");

  const card = document.createElement("div");
  card.classList.add("recipe-card");
  card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}" />
    <h3>${recipe.title}</h3>
  `;

  this.appendChild(card);
  saveToPlan(day, recipe);
}

// Save plan in localStorage
function saveToPlan(day, recipe) {
  let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};
  if (!mealPlan[day]) mealPlan[day] = [];

  // Avoid duplicates in a day
  if (!mealPlan[day].some(r => r.id === recipe.id)) {
    mealPlan[day].push(recipe);
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }
}
