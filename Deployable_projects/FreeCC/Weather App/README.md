# 🌤️ Weather Forecast App

A simple weather application that allows users to select a city and view real-time weather information such as temperature, humidity, wind speed, and current conditions.

This project was built as part of a **freeCodeCamp lab** to practice working with **asynchronous JavaScript (async/await)**, external APIs, and DOM manipulation.

---

## 🚀 Features

- Select a city from a dropdown list
- Fetch real-time weather data using an external API
- Display:
  - Location name
  - Main weather condition
  - Temperature (°C)
  - Feels-like temperature
  - Humidity
  - Wind speed
  - Wind gust
  - Weather icon
- Graceful error handling with user alerts
- Local storage support for last selected city
- Clean, responsive UI

---

## 🛠️ Technologies Used

- **HTML5** – Structure
- **CSS3** – Styling and layout
- **JavaScript (ES6+)**
  - `async / await`
  - Fetch API
  - DOM manipulation
  - Optional chaining
- **freeCodeCamp Weather Proxy API**

---

## 🌐 API Used

Weather data is fetched from:
https://weather-proxy.freecodecamp.rocks/api/city/<CITY>

- Uses **metric units**
- No API key required
- Returns temperature, weather conditions, wind data, and icons

---

## 📂 Project Structure

```cmd
├── index.html
├── styles.css
├── script.js
└── README.md
```

---

## ⚙️ How It Works

1. User selects a city from the dropdown.
2. Clicking **Get Weather** triggers an asynchronous request.
3. While fetching, a loading message is shown.
4. Weather data is displayed once the request completes.
5. If an error occurs, the user sees an alert message.
6. If any API value is missing, `N/A` is shown instead.

---

## 🧠 What I Learned

- How `async` and `await` work **without blocking the browser**
- Why loading states must be **manually created in the UI**
- How to safely handle API errors and undefined data
- How to structure JavaScript code using:
  - Separation of concerns
  - DOM reference objects
  - Clear function responsibilities
- Debugging integration issues between HTML, CSS, and JavaScript

---

## ⚠️ Limitations & Future Improvements

- Only predefined cities are supported (per assignment requirements)
- No hourly or daily forecast yet
- UI animations can be improved
- Could be extended with:
  - User location detection
  - Dark/light theme toggle
  - Forecast charts
  - AI-based weather insights

---

## ✅ Assignment Requirements Fulfilled

This project satisfies all required **freeCodeCamp user stories**, including:

- Correct HTML structure and IDs
- Proper use of async functions
- Error handling with alerts
- Use of the provided weather API
- Displaying weather data dynamically
- Handling undefined values safely

---

## 📌 Author

Built by **Liberator Nyadundu**  
As part of a personal learning journey focused on mastering JavaScript, asynchronous programming, and real-world web development.

---

## 📄 License

This project is open-source and free to use for learning purposes.
