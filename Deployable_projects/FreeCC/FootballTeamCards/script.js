// --- 1. DATA DEFINITION ---
const footballTeam = {
  team: "FC London Lions",
  year: 2025,
  headCoach: "Elena Rostova",
  players: [
    { name: "Marcus Sterling", position: "Goalkeeper (GK)", isCaptain: false },
    { name: "Liam O'Connell", position: "Center Back (CB)", isCaptain: true },
    { name: "Sofia Rodriguez", position: "Left Back (LB)", isCaptain: false },
    { name: "Benny Kim", position: "Center Midfielder (CM)", isCaptain: false },
    {
      name: "Chidiebere Okoro",
      position: "Defensive Midfielder (CDM)",
      isCaptain: false,
    },
    {
      name: "Anya Sharma",
      position: "Attacking Midfielder (CAM)",
      isCaptain: false,
    },
    {
      name: "Rafael Da Silva",
      position: "Right Winger (RW)",
      isCaptain: false,
    },
    { name: "Chloe Dubois", position: "Striker (ST)", isCaptain: false },
  ],
};

// --- 2. DOM ELEMENT SELECTION ---
const headCoachEl = document.getElementById("head-coach"); // Renamed to avoid confusion
const teamEl = document.getElementById("team"); // Renamed to avoid confusion
const yearEl = document.getElementById("year"); // Renamed to avoid confusion
const playerCardsContainer = document.getElementById("player-cards"); // Renamed for clarity
const playersDropdown = document.getElementById("players");

// --- 3. INITIAL STAT POPULATION ---
headCoachEl.textContent = footballTeam.headCoach;
teamEl.textContent = footballTeam.team;
yearEl.textContent = footballTeam.year;

// --- 4. ELEMENT CREATION FUNCTION (ASSIGN ELEMENTS) ---
function assignElements(player) {
  const playerCard = document.createElement("div");
  playerCard.classList.add("player-card");

  // Use H2 for better semantic structure
  const h2 = document.createElement("h2");

  // Use ternary operator for concise text assignment
  h2.textContent = `${player.isCaptain ? "(Captain) " : ""}${player.name}`;

  const p = document.createElement("p");
  p.textContent = `Position: ${player.position}`;

  // **FIXED:** Attach H2 and P elements to the card
  playerCard.appendChild(h2);
  playerCard.appendChild(p);

  // **FIXED:** Attach the complete card to the main container
  playerCardsContainer.appendChild(playerCard);
}

// --- 5. TRAVERSAL AND FILTERING FUNCTION (YOUR MAIN LOGIC) ---
function traverseAndFilterPlayers(playerArray, filterString) {
  // Clear the container before rendering new cards
  playerCardsContainer.innerHTML = "";

  let playersToRender = [];

  if (filterString === "all") {
    playersToRender = playerArray;
  } else {
    // Perform the filtering logic based on the filterString
    playersToRender = playerArray.filter((player) => {
      const playerPosition = player.position.toLowerCase();
      const filterCategory = filterString.toLowerCase();

      switch (filterCategory) {
        case "goalkeeper":
          return (
            playerPosition.includes("goalkeeper") ||
            playerPosition.includes("gk")
          );
        case "defender":
          return (
            playerPosition.includes("back") ||
            playerPosition.includes("defender") ||
            playerPosition.includes("cb") ||
            playerPosition.includes("lb") ||
            playerPosition.includes("rb")
          ); // Added LB/RB for completeness
        case "midfielder":
          return (
            playerPosition.includes("midfielder") ||
            playerPosition.includes("mid")
          );
        case "forward":
          return (
            playerPosition.includes("forward") ||
            playerPosition.includes("striker") ||
            playerPosition.includes("winger") ||
            playerPosition.includes("st")
          );
        default:
          return false;
      }
    });
  }

  // Traversal: Loop through the final list and call the element creation function
  playersToRender.forEach((player) => {
    assignElements(player);
  });
}

// --- 6. EVENT LISTENER INTEGRATION & INITIAL CALL ---

// **FIXED:** Attach the correct function to the 'change' event
playersDropdown.addEventListener("change", (e) => {
  // Pass the full players array and the selected value
  traverseAndFilterPlayers(footballTeam.players, e.target.value);
});

// **FINAL STEP:** Call the function once to load all players when the page first loads
traverseAndFilterPlayers(footballTeam.players, "all");
