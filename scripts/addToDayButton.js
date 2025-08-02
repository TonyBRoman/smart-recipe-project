export function createAddToDayButton(recipe, onSelectDay) {
  const button = document.createElement("button");
  button.textContent = "➕ Add to Day";
  button.classList.add("add-to-day-btn");

  const daySelect = document.createElement("select");
  daySelect.style.display = "none";
  daySelect.innerHTML = `
    <option value="">Select a day</option>
    <option value="Monday">Monday</option>
    <option value="Tuesday">Tuesday</option>
    <option value="Wednesday">Wednesday</option>
    <option value="Thursday">Thursday</option>
    <option value="Friday">Friday</option>
    <option value="Saturday">Saturday</option>
    <option value="Sunday">Sunday</option>
  `;

  button.addEventListener("click", () => {
    button.style.display = "none";
    daySelect.style.display = "inline-block";
  });

  daySelect.addEventListener("change", () => {
    const selectedDay = daySelect.value;
    if (selectedDay && onSelectDay) {
      onSelectDay(recipe, selectedDay);
    }

    // Reset
    daySelect.style.display = "none";
    button.style.display = "inline-block";
    daySelect.value = "";
  });

  const container = document.createElement("div");
  container.appendChild(button);
  container.appendChild(daySelect);

  return container;
}
