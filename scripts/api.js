const API_KEY = "ffe5303e839d4e03834efa15bb49de01";
const BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";

export async function fetchRecipesByIngredients(ingredients) {
  try {
    const response = await fetch(
      `${BASE_URL}?ingredients=${encodeURIComponent(ingredients)}&number=6&apiKey=${API_KEY}`
    );

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();
    return data;
    console.log("Fetched data: ", data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}


