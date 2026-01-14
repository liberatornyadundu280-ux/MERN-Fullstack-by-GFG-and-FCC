document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle-button");
  const themeMenu = document.getElementById("theme-menu");
  const body = document.body;
  const announcer = document.getElementById("aria-live-announcer");

  /**
   * Announces a message using the aria-live region.
   * @param {string} message - The message to be announced.
   */
  const announceThemeChange = (message) => {
    // 1. Clear the region (important for some screen readers to announce repeat messages)
    announcer.textContent = "";

    // 2. Wait a fraction of a second, then set the new content
    // This is a common pattern to force an announcement
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);

    // 3. Optional: Create a temporary visual popup for all users
    showTemporaryPopup(message);
  };

  /**
   * Visually displays a temporary, non-disruptive popup message.
   * @param {string} message - The message to display.
   */
  const showTemporaryPopup = (message) => {
    let popup = document.getElementById("theme-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "theme-popup";
      popup.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 20px;
                background-color: #333;
                color: white;
                border-radius: 5px;
                opacity: 0;
                transition: opacity 0.5s ease-in-out, transform 0.5s;
                transform: translateY(20px);
                z-index: 2000;
            `;
      document.body.appendChild(popup);
    }

    popup.textContent = message;

    // Show the popup
    popup.style.opacity = "1";
    popup.style.transform = "translateY(0)";

    // Hide the popup after 3 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      popup.style.transform = "translateY(20px)";
    }, 5000);
  };

  /**
   * Toggles the visibility of the theme menu and updates aria-expanded.
   */
  const toggleMenu = () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

    // Update the ARIA attribute
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));

    // Update the visual visibility
    if (isExpanded) {
      themeMenu.setAttribute("hidden", ""); // Hide the menu
    } else {
      themeMenu.removeAttribute("hidden"); // Show the menu
    }
  };

  /**
   * Applies the selected theme and announces the change.
   * @param {string} themeName - The name of the theme ('light', 'dark', or 'rainbow').
   */
  const applyTheme = (themeName) => {
    body.setAttribute("data-theme", themeName);
    toggleMenu(); // Close the menu after selection

    // Announce the change using the ARIA live region
    const announcementMessage = `Theme switched to ${themeName}.`;
    announceThemeChange(announcementMessage);
  };

  // --- EVENT LISTENERS ---

  // 1. Listener to toggle the menu (for the main button)
  toggleButton.addEventListener("click", toggleMenu);

  // 2. Listener for theme selection (event delegation on the menu)
  themeMenu.addEventListener("click", (event) => {
    const target = event.target;
    // Ensure the click was on one of the theme buttons
    if (target.matches("[data-theme]")) {
      const theme = target.getAttribute("data-theme");
      applyTheme(theme);
    }
  });

  // 3. Listener to close the menu when clicking outside (optional but helpful)
  document.addEventListener("click", (event) => {
    const isClickInside =
      toggleButton.contains(event.target) || themeMenu.contains(event.target);
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

    if (!isClickInside && isExpanded) {
      toggleMenu();
    }
  });
});
