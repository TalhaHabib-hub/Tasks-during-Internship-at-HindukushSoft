const nameInput = document.querySelector("#name");
const saveBtn = document.querySelector(".save");
const themeBtn = document.querySelector(".theme");
const screen = document.querySelector("#screen");
const status = document.querySelector(".status");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent =
    theme === "light" ? "Switch to dark theme" : "Switch to light theme";
}

function showSavedInfo() {
  const savedName = localStorage.getItem("name") || "No name saved yet";
  const savedTheme = localStorage.getItem("theme") || "dark";
  screen.value = `Stored name: ${savedName}\nActive theme: ${savedTheme}`;
}

function saveName() {
  const value = nameInput.value.trim();

  if (!value) {
    status.textContent = "Please enter a name before saving.";
    return;
  }

  localStorage.setItem("name", value);
  status.textContent = `Saved: ${value}`;
  showSavedInfo();
}

function toggleTheme() {
  const currentTheme =
    localStorage.getItem("theme") === "light" ? "light" : "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  localStorage.setItem("theme", nextTheme);
  applyTheme(nextTheme);
  showSavedInfo();
  status.textContent = `Theme changed to ${nextTheme}`;
}

function loadSavedData() {
  const savedName = localStorage.getItem("name");
  const savedTheme =
    localStorage.getItem("theme") === "light" ? "light" : "dark";

  if (savedName) {
    nameInput.value = savedName;
  }

  applyTheme(savedTheme);
  showSavedInfo();

  status.textContent = savedName
    ? `Welcome back, ${savedName}!`
    : "Save your name and theme locally.";
}

saveBtn.addEventListener("click", saveName);
themeBtn.addEventListener("click", toggleTheme);
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveName();
  }
});

window.addEventListener("DOMContentLoaded", loadSavedData);
