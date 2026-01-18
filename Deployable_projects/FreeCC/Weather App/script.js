const DOM = {
  citySelect: document.getElementById("city-select"),
  button: document.getElementById("get-weather-btn"),
  displaySection: document.getElementById("weather-display"),
  message: document.getElementById("message"),
  location: document.getElementById("location"),
  icon: document.getElementById("weather-icon"),
  temp: document.getElementById("main-temperature"),
  unit: document.querySelector(".temperature-unit"),
  condition: document.getElementById("weather-main"),
  wind: document.getElementById("wind"),
  windGust: document.getElementById("wind-gust"),
  humidity: document.getElementById("humidity"),
  feelsLike: document.getElementById("feels-like"),
  tempToggle: document.getElementById("temp-toggle"),
};

const state = {
  isCelsius: true,
  weatherData: null,
  isLoading: false,
  searchHistory: [],
};

/* ========================================
   LOCALSTORAGE FUNCTIONS
   ======================================== */

function saveLastCity(city) {
  localStorage.setItem("lastCity", city);
}

function getLastCity() {
  return localStorage.getItem("lastCity");
}

function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Remove city if it already exists (to avoid duplicates)
  history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());

  // Add city to the beginning
  history.unshift(city);

  // Keep only last 10 searches
  history = history.slice(0, 10);

  localStorage.setItem("searchHistory", JSON.stringify(history));
  state.searchHistory = history;
}

function getSearchHistory() {
  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  state.searchHistory = history;
  return history;
}

function clearSearchHistory() {
  localStorage.removeItem("searchHistory");
  state.searchHistory = [];
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

function showMessage(text, type = "info") {
  DOM.message.textContent = text;
  DOM.message.classList.remove("hidden", "error", "success");
  if (type !== "info") {
    DOM.message.classList.add(type);
  }
  DOM.message.classList.add("visible");
}

function hideMessage() {
  DOM.message.classList.add("hidden");
}

function convertTemp(celsius, toFahrenheit = false) {
  if (toFahrenheit) {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

function updateTemperatureDisplay() {
  if (!state.weatherData) return;

  const tempValue = state.isCelsius
    ? state.weatherData.main?.temp
    : convertTemp(state.weatherData.main?.temp, true);

  const feelsValue = state.isCelsius
    ? state.weatherData.main?.feels_like
    : convertTemp(state.weatherData.main?.feels_like, true);

  DOM.temp.textContent = tempValue ?? "N/A";
  DOM.feelsLike.textContent = feelsValue ?? "N/A";
  DOM.unit.textContent = state.isCelsius ? "°C" : "°F";
}

function clearWeatherDisplay() {
  DOM.location.textContent = "—";
  DOM.icon.src = "";
  DOM.condition.textContent = "—";
  DOM.temp.textContent = "—";
  DOM.feelsLike.textContent = "—";
  DOM.humidity.textContent = "—";
  DOM.wind.textContent = "—";
  DOM.windGust.textContent = "—";
}

/* ========================================
   REQUIRED ASYNC FUNCTION
   ======================================== */

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://weather-proxy.freecodecamp.rocks/api/city/${city}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    return await response.json();
  } catch (error) {
    alert(error);
    return null;
  }
}

/* ========================================
   RENDER FUNCTIONS
   ======================================== */

function renderLoading() {
  state.isLoading = true;
  DOM.button.disabled = true;
  showMessage("Fetching weather...", "info");
  clearWeatherDisplay();
}

function renderError(errorMsg) {
  state.isLoading = false;
  DOM.button.disabled = false;
  showMessage(errorMsg, "error");
  DOM.displaySection.classList.add("hidden");
  clearWeatherDisplay();
}

function renderSuccess(data) {
  state.isLoading = false;
  DOM.button.disabled = false;
  state.weatherData = data;

  hideMessage();
  DOM.displaySection.classList.remove("hidden");

  DOM.location.textContent = data.name || "Unknown";
  DOM.icon.src = data.weather?.[0]?.icon || "";
  DOM.condition.textContent = data.weather?.[0]?.main || "N/A";
  DOM.humidity.textContent = `${data.main?.humidity ?? "N/A"}%`;
  DOM.wind.textContent = `${data.wind?.speed ?? "N/A"} m/s`;
  DOM.windGust.textContent = `${data.wind?.gust ?? "N/A"} m/s`;

  updateTemperatureDisplay();
}

/* ========================================
   REQUIRED ASYNC FUNCTION
   ======================================== */

async function showWeather(city) {
  renderLoading();
  const data = await getWeather(city);

  if (!data) {
    renderError("Something went wrong, please try again later");
    return;
  }

  renderSuccess(data);
  saveLastCity(city);
  saveSearchHistory(city);
}

/* ========================================
   EVENT LISTENERS
   ======================================== */

DOM.button.addEventListener("click", () => {
  const city = DOM.citySelect.value;

  if (!city) {
    showMessage("Please select a city", "error");
    return;
  }

  showWeather(city);
});

DOM.tempToggle.addEventListener("change", () => {
  state.isCelsius = !state.isCelsius;
  localStorage.setItem("tempUnit", state.isCelsius ? "C" : "F");
  updateTemperatureDisplay();
});

/* ========================================
   INITIALIZATION
   ======================================== */

function initApp() {
  // Restore temperature unit preference
  const savedUnit = localStorage.getItem("tempUnit");
  if (savedUnit === "F") {
    state.isCelsius = false;
    DOM.tempToggle.checked = true;
  }

  // Load search history
  getSearchHistory();

  // Restore last city and auto-load weather
  const lastCity = getLastCity();
  if (lastCity) {
    DOM.citySelect.value = lastCity;
    showWeather(lastCity);
  } else {
    hideMessage();
  }
}
initApp();
