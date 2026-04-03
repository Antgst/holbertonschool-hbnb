/* Shared client utilities, UI helpers, and generic browser helpers. */

const API_BASE_URL = "http://127.0.0.1:5000/api/v1";
const TOKEN_COOKIE_NAME = "token";
const THEME_STORAGE_KEY = "hbnb-theme";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";

const HERO_ROTATION_DELAY_MS = 5000;
const HERO_IMAGE_LIBRARY = [
  { src: "hbnb/images/places/chambord-suite-1.jpg", position: "center center" },
  { src: "hbnb/images/places/chambord-suite-2.jpg", position: "center center" },
  { src: "hbnb/images/places/cancale-house-1.jpg", position: "center center" },
  { src: "hbnb/images/places/cancale-house-2.jpg", position: "center center" },
  { src: "hbnb/images/places/dinard-villa-1.jpg", position: "center center" },
  { src: "hbnb/images/places/dinard-villa-2.jpg", position: "center center" },
  { src: "hbnb/images/places/rennes-loft-1.jpg", position: "center center" },
  { src: "hbnb/images/places/rennes-loft-2.jpg", position: "center center" },
  {
    src: "hbnb/images/places/saint-malo-studio-1.jpg",
    position: "center center",
  },
  { src: "hbnb/images/places/betton-room-2.jpg", position: "center center" },
  {
    src: "hbnb/images/places/broceliande-cabin-1.jpg",
    position: "center center",
  },
  {
    src: "hbnb/images/places/vannes-apartment-2.jpg",
    position: "center center",
  },
];

function getRandomHeroImage(excludedSrc = "") {
  // Picks a new hero image while avoiding the one already displayed.
  const candidates = HERO_IMAGE_LIBRARY.filter(
    (image) => image && image.src !== excludedSrc,
  );
  const source = candidates.length ? candidates : HERO_IMAGE_LIBRARY;

  return source[Math.floor(Math.random() * source.length)] || null;
}

function preloadImage(source) {
  // Loads an image in advance to keep the background transition smooth.
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(source);
    image.onerror = () => reject(new Error(`Unable to preload ${source}`));
    image.src = source;
  });
}

function applyHeroImageToLayer(layer, image) {
  // Updates one visual layer with the requested hero background.
  if (!layer || !image?.src) {
    return;
  }

  layer.style.backgroundImage = `url("${image.src}")`;
  layer.style.backgroundPosition = image.position || "center center";
}

function crossfadeHeroLayers(state, nextImage) {
  // Swaps the active and inactive layers to animate the hero background.
  if (!state || !nextImage) {
    return;
  }

  const previousActiveLayer = state.activeLayer;

  applyHeroImageToLayer(state.inactiveLayer, nextImage);
  state.inactiveLayer.classList.add("is-active");
  previousActiveLayer.classList.remove("is-active");

  state.activeLayer = state.inactiveLayer;
  state.inactiveLayer = previousActiveLayer;
  state.currentImage = nextImage;
}

async function rotateHeroBackground(state) {
  // Preloads and applies the next background image when rotation runs.
  if (!state) {
    return;
  }

  const nextImage = getRandomHeroImage(state.currentImage?.src);

  if (!nextImage) {
    return;
  }

  try {
    await preloadImage(nextImage.src);
    crossfadeHeroLayers(state, nextImage);
  } catch (error) {
    console.error("Unable to update hero background:", error);
  }
}

function initializeHeroBackgrounds() {
  // Wires the rotating hero background on pages that contain a hero block.
  const heroes = document.querySelectorAll(".hero");

  if (!heroes.length || !HERO_IMAGE_LIBRARY.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  for (const hero of heroes) {
    const primaryLayer = hero.querySelector(".hero-media-layer--primary");
    const secondaryLayer = hero.querySelector(".hero-media-layer--secondary");

    if (!primaryLayer || !secondaryLayer) {
      continue;
    }

    const state = {
      activeLayer: primaryLayer,
      inactiveLayer: secondaryLayer,
      currentImage: HERO_IMAGE_LIBRARY[0],
    };

    applyHeroImageToLayer(state.activeLayer, state.currentImage);
    state.activeLayer.classList.add("is-active");

    rotateHeroBackground(state);

    if (prefersReducedMotion || HERO_IMAGE_LIBRARY.length < 2) {
      continue;
    }

    window.setInterval(() => {
      rotateHeroBackground(state);
    }, HERO_ROTATION_DELAY_MS);
  }
}

function getStoredTheme() {
  // Reads the theme choice from local storage when available.
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function getPreferredTheme() {
  // Chooses the stored theme first, then falls back to system preference.
  const storedTheme = getStoredTheme();

  if (storedTheme === LIGHT_THEME || storedTheme === DARK_THEME) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK_THEME
    : LIGHT_THEME;
}

function syncThemeToggleState(theme) {
  // Keeps every theme toggle input aligned with the active theme.
  const isDark = theme === DARK_THEME;

  for (const toggle of document.querySelectorAll(".theme-toggle-input")) {
    toggle.checked = isDark;
    toggle.setAttribute("aria-checked", String(isDark));
  }
}

function applyTheme(theme, persist = true) {
  // Applies the chosen theme to the page and optionally stores it.
  const resolvedTheme = theme === DARK_THEME ? DARK_THEME : LIGHT_THEME;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
  syncThemeToggleState(resolvedTheme);

  if (!persist) {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
  } catch (error) {
    console.error("Unable to save theme preference:", error);
  }
}

function initializeThemeToggle() {
  // Connects the theme toggle and keeps it in sync with system changes.
  const preferredTheme = getPreferredTheme();
  applyTheme(preferredTheme, false);

  for (const toggle of document.querySelectorAll(".theme-toggle-input")) {
    toggle.addEventListener("change", (event) => {
      const nextTheme = event.currentTarget.checked ? DARK_THEME : LIGHT_THEME;
      applyTheme(nextTheme);
    });
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = (event) => {
    if (getStoredTheme()) {
      return;
    }

    applyTheme(event.matches ? DARK_THEME : LIGHT_THEME, false);
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handleSystemThemeChange);
  }
}

function getCookie(name) {
  // Retrieves a single cookie value by name.
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();

    if (trimmedCookie.startsWith(`${name}=`)) {
      return trimmedCookie.substring(name.length + 1);
    }
  }

  return null;
}

function getAuthToken() {
  // Returns the current authentication token stored in cookies.
  return getCookie(TOKEN_COOKIE_NAME);
}

function decodeJwtPayload(token) {
  // Decodes the JWT payload so review actions can be scoped to the owner.
  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(window.atob(padded));
  } catch (error) {
    return null;
  }
}

function getAuthContext(token = getAuthToken()) {
  // Returns the current authenticated user context extracted from the JWT.
  const payload = decodeJwtPayload(token);

  return {
    token: token || null,
    userId: payload?.sub ? String(payload.sub) : null,
    isAdmin: Boolean(payload?.is_admin),
  };
}

function clearCookie(name) {
  // Deletes one cookie by forcing an expired date.
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

function getPlaceIdFromURL() {
  // Extracts the place identifier from the current query string.
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function buildAuthHeaders(token) {
  // Adds the JWT only when the user is authenticated.
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseJsonSafely(response) {
  // Prevents UI code from crashing when an API response has no JSON body.
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

function resetFormMessage(messageElement) {
  // Clears any previous feedback message shown under a form.
  if (!messageElement) {
    return;
  }

  messageElement.textContent = "";
  messageElement.className = "form-message";
}

function setFormMessage(messageElement, text, type) {
  // Displays a typed feedback message for a form interaction.
  if (!messageElement) {
    return;
  }

  messageElement.textContent = text;
  messageElement.className = "form-message is-visible";

  if (type) {
    messageElement.classList.add(`is-${type}`);
  }
}

function setButtonLoading(button, isLoading, loadingText) {
  // Switches a submit button between idle and loading states.
  if (!button) {
    return;
  }

  if (!button.dataset.defaultLabel) {
    button.dataset.defaultLabel = button.textContent.trim();
  }

  if (isLoading) {
    button.disabled = true;
    button.classList.add("is-loading");
    button.textContent = loadingText;
    return;
  }

  button.disabled = false;
  button.classList.remove("is-loading");
  button.textContent = button.dataset.defaultLabel;
}

function escapeHtml(value) {
  // Escapes dynamic text before injecting it into HTML strings.
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setupRevealAnimations() {
  // Applies intersection-based reveal animations to visible page sections.
  const elements = [
    ...document.querySelectorAll(".hero"),
    ...document.querySelectorAll(".catalog-intro"),
    ...document.querySelectorAll(".place-card"),
    ...document.querySelectorAll(".place-details"),
    ...document.querySelectorAll(".place-summary"),
    ...document.querySelectorAll(".add-review"),
    ...document.querySelectorAll(".host-card"),
    ...document.querySelectorAll(".host-preview-card"),
    ...document.querySelectorAll(".reviews-section"),
    ...document.querySelectorAll(".review-form"),
    ...document.querySelectorAll(".review-page-intro"),
    ...document.querySelectorAll(".review-container"),
    ...document.querySelectorAll("#login-form"),
    ...document.querySelectorAll(".auth-page-intro"),
    ...document.querySelectorAll(".auth-page-card"),
  ];

  if (!elements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    for (const element of elements) {
      element.classList.add("is-visible");
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  for (const element of elements) {
    if (
      element.classList.contains("reveal") ||
      element.classList.contains("is-visible")
    ) {
      continue;
    }

    if (element.classList.contains("hero")) {
      element.classList.add("reveal", "is-visible");
      continue;
    }

    if (element.classList.contains("add-review")) {
      element.classList.add("reveal", "reveal--right");
    } else if (
      element.classList.contains("auth-page-intro") ||
      element.classList.contains("place-details")
    ) {
      element.classList.add("reveal", "reveal--left");
    } else {
      element.classList.add("reveal", "reveal--soft");
    }

    observer.observe(element);
  }
}

function renderStateCard(title, text, compact = false) {
  // Returns a reusable state card for loading, empty, or error feedback.
  return `
    <div class="ui-state${compact ? " ui-state--compact" : ""}">
      <h3 class="ui-state-title">${title}</h3>
      <p class="ui-state-text">${text}</p>
    </div>
  `;
}
