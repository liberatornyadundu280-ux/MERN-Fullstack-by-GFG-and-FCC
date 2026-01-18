# 🥁 Drum Machine

An interactive drum machine built with vanilla JavaScript that allows users to play drum sounds using both keyboard keys and on-screen pads. The project focuses on **event handling**, **audio playback**, **state control**, and **UI feedback**, rather than visual complexity.

This project was built as part of my JavaScript learning journey and helped solidify how browser events, audio APIs, and application state work together.

---

## 🚀 Features

- Play drum sounds using keyboard keys:
  - **Q W E**
  - **A S D**
  - **Z X C**
- Clickable drum pads with visual feedback
- Power toggle to enable/disable the drum machine
- Bank switching between different sound sets (e.g. Heater Kit, Soft Piano)
- Volume control via slider and keyboard arrow keys
- Display panel showing the currently played sound
- Recording and playback of user-created drum sequences
- Prevents user interaction while recorded audio is playing
- Clean separation between logic, state, and UI updates

---

## 🛠️ Technologies Used

- **HTML5** – Structure
- **CSS3** – Styling and layout
- **JavaScript (ES6+)**
  - Event listeners
  - Audio API
  - State management
  - DOM manipulation
  - Keyboard interaction
  - Timing control with `setTimeout`

---

## 📂 Project Structure

```cmd
├── index.html
├── style.css
├── script.js
├── sounds/
│ ├── heater-1.wav
│ ├── clap.wav
│ ├── kick.wav
│ └── ...
└── README.md
```

---

## ⚙️ How It Works

1. Each drum pad is mapped to a specific keyboard key.
2. Pressing a key or clicking a pad triggers:
   - Audio playback
   - Visual pad activation
   - Display update
3. The **power system** acts as a gate:
   - When power is off, no events are processed.
4. The **bank switch** changes the active sound mapping dynamically.
5. The **recording system** stores:
   - Key pressed
   - Timestamp
   - Active sound bank
6. During playback:
   - Pads are disabled
   - User interaction is blocked
   - Toast-style warnings notify the user

---

## 🧠 What I Learned

- How to manage **keyboard and mouse events** together
- Why a **single core function** simplifies event-driven systems
- How to design an application using **state-first logic**
- Handling audio playback timing accurately
- Preventing conflicting user actions using control flags
- Structuring JavaScript code for readability and debugging
- Why UI feedback must be explicitly programmed

---

## ⚠️ Challenges Faced

- Debugging event listeners that silently failed
- Understanding that `async` behavior does not automatically create loading effects
- Managing shared state across multiple features (power, bank, recording, playback)
- Avoiding user interaction during critical playback phases

These challenges significantly improved my debugging and architectural thinking.

---

## 🔮 Future Improvements

- Add visual waveform or beat timeline
- Save recordings to local storage
- Export recordings as audio files
- Improve accessibility and keyboard focus styles
- Add more sound banks

---

## 📌 Author

Built by **Liberator Nyadundu**  
As part of a hands-on journey to master JavaScript, event-driven programming, and real-world project architecture.

---

## 📄 License

This project is open-source and intended for learning and experimentation.
