const UNSPLASH_ACCESS_KEY = "ZB6JJ9fJEYFkDK0mMVxdox4iMDtbL_Pcvty3q1p06e8";
const BASE_URL = "https://api.unsplash.com/search/photos";

export async function fetchUnsplashImage(query) {
  try {
    const res = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`);
    if (!res.ok) throw new Error("Unsplash API Error");

    const data = await res.json();
    if (data.results.length > 0) {
      return data.results[0].urls.regular;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Unsplash error:", error);
    return null;
  }
}
