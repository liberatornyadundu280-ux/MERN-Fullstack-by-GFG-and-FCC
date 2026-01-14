/* =========================
   SYSTEM STATE
========================= */
const state = {
  power: true,
  volume: 0.7,
  currentBank: "HEATER",
  isRecording: false,
  recordStartTime: null,
  recordedEvents: [],
  isPlaying: false,
};

/* =========================
   DOM CACHE
========================= */
const DOM = {
  padBank: document.getElementById("pad-bank"),
  display: document.getElementById("display"),
  bankSelect: document.getElementById("bank"),
  powerToggle: document.getElementById("power-toggle"),
  volumeSlider: document.getElementById("volume"),
  powerStateText: document.getElementById("state"),
  recordBtn: document.getElementById("record-btn"),
  stopBtn: document.getElementById("stop-btn"),
  playBtn: document.getElementById("play-btn"),
};

/* =========================
   DRUM MAP (DATA ONLY)
========================= */
const DRUM_MAP = {
  HEATER: {
    Q: {
      name: "Heater 1",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Heater-1.mp3"
      ),
    },
    W: {
      name: "Heater 2",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Heater-2.mp3"
      ),
    },
    E: {
      name: "Heater 3",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Heater-3.mp3"
      ),
    },
    A: {
      name: "Heater 4",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Heater-4_1.mp3"
      ),
    },
    S: {
      name: "Clap",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Heater-6.mp3"
      ),
    },
    D: {
      name: "Open-HH",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Dsc_Oh.mp3"
      ),
    },
    Z: {
      name: "Kick-n-Hat",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Kick_n_Hat.mp3"
      ),
    },
    X: {
      name: "Kick",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/RP4_KICK_1.mp3"
      ),
    },
    C: {
      name: "Closed-HH",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Cev_H2.mp3"
      ),
    },
  },

  SOFT_PIANO: {
    Q: {
      name: "Piano C4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/c4.mp3"
      ),
    },
    W: {
      name: "Piano E4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/e4.mp3"
      ),
    },
    E: {
      name: "Piano G4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/g4.mp3"
      ),
    },

    // reuse them musically
    A: {
      name: "Piano C4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/c4.mp3"
      ),
    },
    S: {
      name: "Piano E4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/e4.mp3"
      ),
    },
    D: {
      name: "Piano G4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/g4.mp3"
      ),
    },

    Z: {
      name: "Piano C4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/c4.mp3"
      ),
    },
    X: {
      name: "Piano E4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/e4.mp3"
      ),
    },
    C: {
      name: "Piano G4",
      audio: new Audio(
        "https://cdn.jsdelivr.net/gh/terkelg/awesome-creative-coding-assets/audio/piano/g4.mp3"
      ),
    },
  },
  FX: {
    Q: {
      name: "Chord 1",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Chord_1.mp3"
      ),
    },
    W: {
      name: "Chord 2",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Chord_2.mp3"
      ),
    },
    E: {
      name: "Chord 3",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Chord_3.mp3"
      ),
    },
    A: {
      name: "Shaker",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Give_us_a_light.mp3"
      ),
    },
    S: {
      name: "Open-HH",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Dry_Ohh.mp3"
      ),
    },
    D: {
      name: "Closed-HH",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Bld_H1.mp3"
      ),
    },
    Z: {
      name: "Punchy Kick",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/punchy_kick_1.mp3"
      ),
    },
    X: {
      name: "Side Stick",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/side_stick_1.mp3"
      ),
    },
    C: {
      name: "Snare",
      audio: new Audio(
        "https://cdn.freecodecamp.org/curriculum/drum/Brk_Snr.mp3"
      ),
    },
  },
};

/* preload audio */
Object.values(DRUM_MAP).forEach((bank) =>
  Object.values(bank).forEach((drum) => drum.audio.load())
);

/* =========================
   UTILITY FUNCTIONS
========================= */
let displayTimeoutId = null;
function updateDisplayText(text) {
  DOM.display.textContent = text;

  // clear previous timer if it exists
  if (displayTimeoutId) {
    clearTimeout(displayTimeoutId);
  }

  // auto-clear after 10 seconds
  displayTimeoutId = setTimeout(() => {
    DOM.display.textContent = "";
    displayTimeoutId = null;
  }, 2500);
}

function clampVolume(value) {
  return Math.min(1, Math.max(0, value));
}

function setVolume(value) {
  if (!state.power) return;
  state.volume = clampVolume(value);
  DOM.volumeSlider.value = state.volume;
  updateDisplayText(`Volume: ${Math.round(state.volume * 100)}`);
}

function updateBankDisplay() {
  updateDisplayText(
    state.currentBank === "HEATER" ? "Heater Kit" : "Soft Piano"
  );
}

function updatePadLabels() {
  const pads = DOM.padBank.querySelectorAll(".drum-pad");
  pads.forEach((pad) => {
    const key = pad.dataset.key;
    const drum = DRUM_MAP[state.currentBank][key];
    if (!drum) return;
    pad.querySelector(".label").textContent = drum.name;
  });
}

function activatePad(key) {
  const pad = document.querySelector(`.drum-pad[data-key="${key}"]`);
  if (!pad) return;
  pad.classList.add("active");
  setTimeout(() => pad.classList.remove("active"), 100);
}

/* =========================
   RECORDING
========================= */
function startRecording() {
  if (!state.power) return;
  state.isRecording = true;
  state.recordedEvents = [];
  state.recordStartTime = Date.now();
  updateDisplayText("Recording...");
}

function stopRecording() {
  if (!state.power) return;
  if (!state.isRecording) {
    showToast("No recording to stop");
    return;
  }
  state.isRecording = false;
  updateDisplayText("Recording Stopped");
}

function resetRecordingState() {
  state.isRecording = false;
  state.recordStartTime = null;
  state.recordedEvents = [];
}

function playRecording() {
  if (!state.power) return;
  if (state.recordedEvents.length === 0) {
    showToast("Nothing recorded to play");
    return;
  }
  state.isPlaying = true;
  updateDisplayText("Playing Recording");

  state.recordedEvents.forEach((event) => {
    setTimeout(() => {
      const previousBank = state.currentBank;
      state.currentBank = event.bank;
      main(event.key, false);
      state.currentBank = previousBank;
    }, event.time);
  });
  const lastTime = state.recordedEvents[state.recordedEvents.length - 1].time;
  setTimeout(() => {
    state.isPlaying = true;
    updateBankDisplay();
  }, lastTime + 200);
}

function playRecordedKey(key) {
  const drum = DRUM_MAP[state.currentBank][key];
  if (!drum) return;

  const audio = drum.audio;
  audio.currentTime = 0;
  audio.volume = state.volume;
  audio.play();

  activatePad(key);
}

/* =========================
   CORE FUNCTION
========================= */
function main(input, isEvent = true) {
  if (!state.power) return;

  const key = input.toUpperCase();
  const drum = DRUM_MAP[state.currentBank][key];
  if (!drum) return;
  if (isEvent) {
    showToast("Cannot play while recording is playing");
    return;
  }
  if (state.isRecording) {
    state.recordedEvents.push({
      key,
      bank: state.currentBank,
      time: Date.now() - state.recordStartTime,
    });
  }

  const audio = drum.audio;
  audio.currentTime = 0;
  audio.volume = state.volume;
  audio.play();

  activatePad(key);
  updateDisplayText(drum.name);
}

/* =========================
   EVENT LISTENERS
========================= */

/* keyboard */
document.addEventListener("keydown", (e) => {
  if (!state.power) return;

  if (e.key === "ArrowUp") {
    e.preventDefault();
    setVolume(state.volume + 0.05);
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setVolume(state.volume - 0.05);
    return;
  }

  if (e.repeat) return;
  main(e.key);
});

/* mouse pads (delegation) */
DOM.padBank.addEventListener("mousedown", (e) => {
  if (e.target.closest(".drum-pad")) e.preventDefault();
});

DOM.padBank.addEventListener("click", (e) => {
  const pad = e.target.closest(".drum-pad");
  if (!pad) return;
  main(pad.dataset.key);
});

/* controls */
DOM.volumeSlider.addEventListener("input", (e) =>
  setVolume(parseFloat(e.target.value))
);

DOM.bankSelect.addEventListener("change", (e) => {
  state.currentBank = e.target.value;
  updateBankDisplay();
  updatePadLabels();
});

DOM.powerToggle.addEventListener("change", (e) => {
  state.power = e.target.checked;

  if (!state.power) {
    resetRecordingState();
    updateDisplayText("Power Off");
    DOM.powerStateText.textContent = "OFF";
  } else {
    DOM.powerStateText.textContent = "ON";
    updateBankDisplay();
  }
});

/* recording buttons */
DOM.recordBtn.addEventListener("click", startRecording);
DOM.stopBtn.addEventListener("click", stopRecording);
DOM.playBtn.addEventListener("click", playRecording);

/* =========================
   INITIAL UI SYNC
========================= */
updateBankDisplay();
updatePadLabels();
DOM.powerStateText.textContent = "ON";
DOM.volumeSlider.value = state.volume;

function showToast(message, type = "warn") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // auto-remove after 1 second
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 200);
  }, 1000);
}
