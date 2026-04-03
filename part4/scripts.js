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
  const candidates = HERO_IMAGE_LIBRARY.filter(
    (image) => image && image.src !== excludedSrc,
  );
  const source = candidates.length ? candidates : HERO_IMAGE_LIBRARY;

  return source[Math.floor(Math.random() * source.length)] || null;
}

function preloadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(source);
    image.onerror = () => reject(new Error(`Unable to preload ${source}`));
    image.src = source;
  });
}

function applyHeroImageToLayer(layer, image) {
  if (!layer || !image?.src) {
    return;
  }

  layer.style.backgroundImage = `url("${image.src}")`;
  layer.style.backgroundPosition = image.position || "center center";
}

function crossfadeHeroLayers(state, nextImage) {
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
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function getPreferredTheme() {
  const storedTheme = getStoredTheme();

  if (storedTheme === LIGHT_THEME || storedTheme === DARK_THEME) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK_THEME
    : LIGHT_THEME;
}

function syncThemeToggleState(theme) {
  const isDark = theme === DARK_THEME;

  for (const toggle of document.querySelectorAll(".theme-toggle-input")) {
    toggle.checked = isDark;
    toggle.setAttribute("aria-checked", String(isDark));
  }
}

function applyTheme(theme, persist = true) {
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
  return getCookie(TOKEN_COOKIE_NAME);
}

function clearCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function buildAuthHeaders(token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
}

function resetFormMessage(messageElement) {
  if (!messageElement) {
    return;
  }

  messageElement.textContent = "";
  messageElement.className = "form-message";
}

function setFormMessage(messageElement, text, type) {
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

function renderStateCard(title, text, compact = false) {
  return `
    <div class="ui-state${compact ? " ui-state--compact" : ""}">
      <h3 class="ui-state-title">${title}</h3>
      <p class="ui-state-text">${text}</p>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setupRevealAnimations() {
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

function checkAuthentication() {
  const token = getAuthToken();
  const loginLink = document.getElementById("login-link");

  if (loginLink) {
    loginLink.style.display = "";

    if (token) {
      loginLink.textContent = "Logout";
      loginLink.href = "#";
      loginLink.removeAttribute("aria-current");

      loginLink.onclick = (event) => {
        event.preventDefault();
        clearCookie(TOKEN_COOKIE_NAME);
        window.location.href = "index.html";
      };
    } else {
      loginLink.textContent = "Login";
      loginLink.href = "login.html";
      loginLink.onclick = null;
    }
  }

  return token;
}

function requireAuthentication() {
  const token = getAuthToken();

  if (!token) {
    window.location.href = "login.html";
    return null;
  }

  return token;
}

async function fetchPlaces(token) {
  const placesList = document.getElementById("places-list");

  try {
    const response = await fetch(`${API_BASE_URL}/places/`, {
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch places");
    }

    const places = await response.json();
    let reviewSummaryMap = new Map();

    try {
      reviewSummaryMap = await fetchPlaceReviewSummaries(token);
    } catch (error) {
      console.error("Error fetching place review summaries:", error);
    }

    displayPlaces(Array.isArray(places) ? places : [], reviewSummaryMap);
  } catch (error) {
    if (placesList) {
      placesList.innerHTML = renderStateCard(
        "Unable to load places",
        "Please try again later or refresh the page.",
      );
    }

    throw error;
  }
}

async function fetchPlaceReviewSummaries(token) {
  const response = await fetch(`${API_BASE_URL}/reviews/`, {
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch review summaries");
  }

  const reviews = await response.json();
  return buildPlaceReviewSummaryMap(Array.isArray(reviews) ? reviews : []);
}

function buildPlaceReviewSummaryMap(reviews) {
  const reviewsByPlace = new Map();

  for (const review of reviews) {
    if (!review || !review.place_id) {
      continue;
    }

    if (!reviewsByPlace.has(review.place_id)) {
      reviewsByPlace.set(review.place_id, []);
    }

    reviewsByPlace.get(review.place_id).push(review);
  }

  const reviewSummaryMap = new Map();

  for (const [placeId, placeReviews] of reviewsByPlace.entries()) {
    const reviewSummary = getReviewSummary(placeReviews);

    if (reviewSummary) {
      reviewSummaryMap.set(placeId, reviewSummary);
    }
  }

  return reviewSummaryMap;
}

async function fetchPlaceDetails(token, placeId) {
  const placeDetailsSection = document.getElementById("place-details");
  const placeSummarySection = document.querySelector(".place-summary");
  const reviewsSection = document.getElementById("reviews");

  if (!placeId) {
    throw new Error("Place ID not found in URL");
  }

  let place;

  try {
    const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch place details");
    }

    place = await response.json();
  } catch (error) {
    if (placeDetailsSection) {
      placeDetailsSection.innerHTML = renderStateCard(
        "Unable to load this stay",
        "The place details could not be loaded right now.",
      );
    }

    if (placeSummarySection) {
      placeSummarySection.innerHTML = renderStateCard(
        "Summary unavailable",
        "The place summary could not be loaded.",
        true,
      );
    }

    throw error;
  }

  displayPlaceDetails(place);
  displayPlaceSummary(place);

  if (!reviewsSection) {
    return;
  }

  try {
    const reviews = await fetchPlaceReviews(token, placeId);
    const reviewSummary = getReviewSummary(reviews);

    renderReviewSummaryCard(reviewSummary);
  } catch (error) {
    console.error("Error fetching place reviews:", error);
  }
}

async function fetchPlaceReviews(token, placeId) {
  const reviewsSection = document.getElementById("reviews");

  try {
    const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
      headers: buildAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch place reviews");
    }

    const reviews = await response.json();
    const safeReviews = Array.isArray(reviews) ? reviews : [];

    displayPlaceReviews(safeReviews);
    return safeReviews;
  } catch (error) {
    if (reviewsSection) {
      reviewsSection.innerHTML = `
        <div class="reviews-section-header">
          <p class="section-kicker">Guest feedback</p>
          <h2>Reviews</h2>
        </div>
        ${renderStateCard(
          "Reviews unavailable",
          "Guest feedback could not be loaded at the moment.",
          true,
        )}
      `;
    }

    throw error;
  }
}

function displayPlaces(places, reviewSummaryMap = new Map()) {
  const placesList = document.getElementById("places-list");

  if (!placesList) {
    return;
  }

  placesList.innerHTML = "";

  if (!places || places.length === 0) {
    placesList.innerHTML = renderStateCard(
      "No stays available",
      "No places match the current selection yet.",
    );
    setupRevealAnimations();
    return;
  }

  for (const [index, place] of places.entries()) {
    const placeCard = document.createElement("article");
    placeCard.classList.add("place-card");
    placeCard.style.setProperty("--card-index", index);

    const title = escapeHtml(place.title || place.name || "Selected stay");
    const price = Number(place.price) || 0;
    placeCard.dataset.price = String(price);

    const placeUrl = `place.html?id=${place.id}`;

    const firstImage =
      place.images && place.images.length > 0
        ? `<img src="${place.images[0]}" alt="${title}" class="place-card-image" loading="lazy">`
        : `<div class="place-card-placeholder">Image coming soon</div>`;

    const shortDescription = place.description
      ? escapeHtml(place.description.slice(0, 105)) +
        (place.description.length > 105 ? "..." : "")
      : "Elegant stay, premium comfort, and carefully selected amenities.";

    const reviewSummary = reviewSummaryMap.get(place.id) || null;
    const ratingBadge = renderPlaceCardRatingBadge(reviewSummary);

    placeCard.innerHTML = `
      <a
        href="${placeUrl}"
        class="place-card-media-link"
        aria-label="View details for ${title}"
      >
        <div class="place-card-media">
          ${firstImage}
          ${ratingBadge}
          <span class="place-card-price">€${price} / night</span>
        </div>
      </a>

      <div class="place-card-body">
        <h2 class="place-card-title">${title}</h2>
        <p class="place-card-text">${shortDescription}</p>
      </div>

      <div class="place-card-footer">
        <a href="${placeUrl}" class="details-button">View details</a>
      </div>
    `;

    placesList.appendChild(placeCard);
  }

  setupRevealAnimations();
}

function renderPlaceCardRatingBadge(reviewSummary) {
  if (!reviewSummary) {
    return "";
  }

  return `
    <span
      class="place-card-rating"
      aria-label="Rated ${reviewSummary.averageLabel} out of 5 from ${reviewSummary.countLabel}"
      title="${reviewSummary.countLabel}"
    >
      <span class="place-card-rating-star" aria-hidden="true">★</span>
      <span class="place-card-rating-value">${reviewSummary.averageLabel}</span>
    </span>
  `;
}

function displayPlaceDetails(place) {
  const placeDetailsSection = document.getElementById("place-details");

  if (!placeDetailsSection) {
    return;
  }

  const title = escapeHtml(place.title || place.name || "Selected stay");
  const price = Number(place.price) || 0;
  const description = escapeHtml(
    place.description ||
      "A refined stay with comfort, character, and carefully selected amenities.",
  );

  const images =
    place.images && place.images.length > 0 ? place.images : [null];

  const galleryMarkup = images
    .slice(0, 3)
    .map((imageUrl, index) => {
      if (!imageUrl) {
        return `<div class="place-gallery-placeholder">${
          index === 0 ? "Image gallery coming soon" : "More visuals coming soon"
        }</div>`;
      }

      return `
      <button
        type="button"
        class="place-gallery-trigger"
        data-image-src="${escapeHtml(imageUrl)}"
        data-image-alt="${title}"
        aria-label="Open image ${index + 1} of ${title}"
      >
        <img
          src="${imageUrl}"
          alt="${title}"
          class="place-gallery-image"
          loading="lazy"
        >
      </button>
    `;
    })
    .join("");

  placeDetailsSection.innerHTML = `
    <div class="place-heading">
      <div class="place-heading-top">
        <div class="place-heading-copy">
          <p class="section-kicker">Selected stay</p>
          <h1>${title}</h1>
          <p class="place-lead">${description}</p>
        </div>

        <div class="place-heading-side">
          <span class="place-price-badge">€${price} / night</span>
        </div>
      </div>
    </div>

    <div class="place-gallery">
      ${galleryMarkup}
    </div>

    <div class="place-info-grid"></div>
    <div class="place-amenities-mount"></div>
  `;

  const infoGrid = placeDetailsSection.querySelector(".place-info-grid");
  const amenitiesMount = placeDetailsSection.querySelector(
    ".place-amenities-mount",
  );

  infoGrid.appendChild(createPlaceInfoBlock("Description", description));
  amenitiesMount.appendChild(createAmenitiesPanel(place.amenities));

  renderHostCard(place);
  renderReviewSummaryCard(null);
  setupRevealAnimations();
  updateHeaderPlaceContext(place);
}

function createPlaceInfoBlock(titleText, contentText) {
  const container = document.createElement("article");
  container.classList.add("place-info");

  const title = document.createElement("h2");
  title.textContent = titleText;

  const content = document.createElement("p");
  content.textContent = contentText;

  container.appendChild(title);
  container.appendChild(content);

  return container;
}

function getAmenityIconMarkup(amenityName) {
  const name = String(amenityName || "").toLowerCase();

  if (name.includes("wifi")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 9.5a11 11 0 0 1 15 0" />
        <path d="M7.5 12.5a7 7 0 0 1 9 0" />
        <path d="M10.5 15.5a3 3 0 0 1 3 0" />
        <circle cx="12" cy="18.2" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    `;
  }

  if (name.includes("parking")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4.5" width="14" height="15" rx="3" />
        <path d="M10 16V8h3.2a2.5 2.5 0 1 1 0 5H10" />
      </svg>
    `;
  }

  if (
    name.includes("workspace") ||
    name.includes("desk") ||
    name.includes("office")
  ) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="6.5" width="14" height="9" rx="1.8" />
        <path d="M8.5 19h7" />
        <path d="M12 15.5V19" />
      </svg>
    `;
  }

  if (name.includes("sea view") || name.includes("ocean view")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 16c1.4 1 2.8 1 4.2 0s2.8-1 4.2 0 2.8 1 4.2 0 2.8-1 4.2 0" />
        <path d="M5 12.5c1-.8 2-.8 3 0s2 .8 3 0 2-.8 3 0 2 .8 3 0" />
        <path d="M15.5 6.5a2 2 0 1 0 0.01 0" />
      </svg>
    `;
  }

  if (name.includes("city view")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 19.5h15" />
        <rect x="6" y="10" width="4" height="9" rx="1" />
        <rect x="11" y="6" width="4" height="13" rx="1" />
        <rect x="16" y="12" width="2" height="7" rx="0.8" />
      </svg>
    `;
  }

  if (name.includes("mountain view")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 18.5l5.2-7 3.1 4 3.5-5 5.2 8Z" />
        <path d="M14.3 10.5l1.2-1.7 1.6 2.2" />
      </svg>
    `;
  }

  if (name.includes("garden") || name.includes("outdoor")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V11" />
        <path d="M12 11c0-3.2 2.2-5 5.2-5-.2 3.1-2 5.2-5.2 5Z" />
        <path d="M12 13c0-2.6-1.8-4.1-4.3-4.1.1 2.6 1.6 4.1 4.3 4.1Z" />
      </svg>
    `;
  }

  if (name.includes("fireplace") || name.includes("fire")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20c3 0 5-2 5-5 0-3.6-2.2-5-3.4-7.4-.3 1.4-1.1 2.4-2.4 3.2.1-2.4-1.1-4.2-3.2-5.8C7.7 7.7 6 9.8 6 13c0 4 2.3 7 6 7Z" />
      </svg>
    `;
  }

  if (name.includes("spa")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 15c1.1 0 1.7-.8 1.7-1.7S8.1 11.6 7 11.6s-1.7.8-1.7 1.7S5.9 15 7 15Z" />
        <path d="M12 17c1.2 0 2-.9 2-2s-.8-2-2-2-2 .9-2 2 .8 2 2 2Z" />
        <path d="M17 15c1.1 0 1.7-.8 1.7-1.7s-.6-1.7-1.7-1.7-1.7.8-1.7 1.7.6 1.7 1.7 1.7Z" />
        <path d="M8 7.5c0-1 .7-1.8 1.6-2.3" />
        <path d="M12 7.2c0-1.4.9-2.4 2.1-3" />
        <path d="M15.8 8.2c0-1 .6-1.8 1.5-2.4" />
      </svg>
    `;
  }

  if (name.includes("hot tub") || name.includes("jacuzzi")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 13.5h14" />
        <path d="M6.5 13.5v3.2A2.3 2.3 0 0 0 8.8 19h6.4a2.3 2.3 0 0 0 2.3-2.3v-3.2" />
        <path d="M8.5 10.2c0-.9.6-1.5 1.3-2" />
        <path d="M12 9.8c0-1 .7-1.7 1.5-2.4" />
        <path d="M15.3 10.6c0-.8.5-1.4 1.2-1.9" />
      </svg>
    `;
  }

  if (name.includes("breakfast")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.5 9.5h9a3 3 0 0 1 0 6h-9Z" />
        <path d="M14.5 11h1.2a2.3 2.3 0 0 1 0 4.6h-1.2" />
        <path d="M7 18.5h10" />
      </svg>
    `;
  }

  if (name.includes("air conditioning") || name === "ac") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 9h15" />
        <path d="M7.5 12.5c.8.5 1.2 1.2 1.2 2.1 0 1-.5 1.8-1.3 2.4" />
        <path d="M12 12.5c.8.5 1.2 1.2 1.2 2.1 0 1-.5 1.8-1.3 2.4" />
        <path d="M16.5 12.5c.8.5 1.2 1.2 1.2 2.1 0 1-.5 1.8-1.3 2.4" />
      </svg>
    `;
  }

  if (name.includes("heating")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="6.5" width="12" height="11" rx="2" />
        <path d="M9 9.5v5" />
        <path d="M12 9.5v5" />
        <path d="M15 9.5v5" />
      </svg>
    `;
  }

  if (name.includes("kitchen")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 5.5v6" />
        <path d="M8.5 5.5v6" />
        <path d="M10.5 5.5v6" />
        <path d="M8.5 11.5v7" />
        <path d="M15 5.5v13" />
        <path d="M15 11h2.2a1.8 1.8 0 0 0 1.8-1.8V5.5" />
      </svg>
    `;
  }

  if (name.includes("washer") || name.includes("laundry")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="5.5" width="12" height="13" rx="2" />
        <circle cx="12" cy="12.5" r="3.2" />
        <path d="M9 8h.01" />
        <path d="M12 8h.01" />
      </svg>
    `;
  }

  if (name.includes("tv") || name.includes("television")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.5" y="6.5" width="15" height="10" rx="1.8" />
        <path d="M9.5 19h5" />
        <path d="M12 16.5V19" />
      </svg>
    `;
  }

  if (
    name.includes("balcony") ||
    name.includes("terrace") ||
    name.includes("patio")
  ) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18.5h14" />
        <path d="M7 18.5v-6h10v6" />
        <path d="M9.5 12.5V8.5h5v4" />
        <path d="M9 18.5v-3" />
        <path d="M12 18.5v-3" />
        <path d="M15 18.5v-3" />
      </svg>
    `;
  }

  if (name.includes("pool")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 10.5V7.8a2.3 2.3 0 1 1 4.6 0v7.7" />
        <path d="M3 16c1.4 1 2.8 1 4.2 0s2.8-1 4.2 0 2.8 1 4.2 0 2.8-1 4.2 0" />
        <path d="M11.1 10.8h3.1" />
      </svg>
    `;
  }

  if (name.includes("pet friendly") || name.includes("pet")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="8" cy="9" r="1.4" />
        <circle cx="12" cy="7.6" r="1.4" />
        <circle cx="16" cy="9" r="1.4" />
        <path d="M9 15.5c0-1.8 1.2-3 3-3s3 1.2 3 3c0 1.4-1 2.5-3 2.5s-3-1.1-3-2.5Z" />
      </svg>
    `;
  }

  if (
    name.includes("self check-in") ||
    name.includes("self checkin") ||
    name.includes("check-in")
  ) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11.5V8.8A3.8 3.8 0 0 1 11.8 5h.4A3.8 3.8 0 0 1 16 8.8v2.7" />
        <rect x="6.5" y="11.5" width="11" height="8" rx="2" />
        <path d="M12 14.5v2.5" />
      </svg>
    `;
  }

  if (name.includes("beach access") || name.includes("beach")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18.5h12" />
        <path d="M7 15.5c1.3-2.2 3-3.4 5-3.4s3.7 1.2 5 3.4" />
        <path d="M12 6v9.5" />
        <path d="M12 6c-1.6 0-3 .8-4 2.1 1 .8 2.4 1.3 4 1.3" />
      </svg>
    `;
  }

  if (name.includes("bbq") || name.includes("grill")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 11.5h10" />
        <path d="M8 11.5a4 4 0 1 0 8 0" />
        <path d="M10 15.5l-1.5 3" />
        <path d="M14 15.5l1.5 3" />
      </svg>
    `;
  }

  if (name.includes("elevator") || name.includes("lift")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="5.5" width="10" height="13" rx="1.8" />
        <path d="M10 9l2-2 2 2" />
        <path d="M10 15l2 2 2-2" />
      </svg>
    `;
  }

  if (name.includes("accessible")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="6.8" r="1.2" />
        <path d="M12 8.5v4.2" />
        <path d="M12 10.5h3" />
        <path d="M12 12.7l-2 2" />
        <path d="M10.8 19a3.8 3.8 0 1 1 4.9-5.7" />
      </svg>
    `;
  }

  if (
    name.includes("ev charger") ||
    name.includes("charger") ||
    name.includes("electric vehicle")
  ) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="5.5" width="7" height="13" rx="2" />
        <path d="M10.5 9.2l-1.2 2h1.6l-1 2" />
        <path d="M16 9.5h1.5v5H16" />
        <path d="M17.5 14.5l1.5 2" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 9.7l5-.7Z" />
    </svg>
  `;
}

function createAmenitiesPanel(amenities) {
  const panel = document.createElement("section");
  panel.classList.add("place-amenities-panel");

  const title = document.createElement("h2");
  title.textContent = "Amenities";

  const grid = document.createElement("div");
  grid.classList.add("amenities-grid");

  if (amenities && amenities.length > 0) {
    for (const amenity of amenities) {
      const amenityLabel = amenity.name || amenity;

      const card = document.createElement("article");
      card.classList.add("amenity-card");

      const icon = document.createElement("div");
      icon.classList.add("amenity-icon");
      icon.innerHTML = getAmenityIconMarkup(amenityLabel);

      const label = document.createElement("p");
      label.classList.add("amenity-label");
      label.textContent = amenityLabel;

      card.appendChild(icon);
      card.appendChild(label);
      grid.appendChild(card);
    }
  } else {
    const emptyState = document.createElement("p");
    emptyState.classList.add("amenities-empty");
    emptyState.textContent = "No amenities listed yet.";
    grid.appendChild(emptyState);
  }

  panel.appendChild(title);
  panel.appendChild(grid);

  return panel;
}

/*function createAmenitiesBlock(amenities) {
  const container = document.createElement("article");
  container.classList.add("place-info");

  const title = document.createElement("h2");
  title.textContent = "Amenities";

  const list = document.createElement("ul");
  list.classList.add("amenity-list");

  if (amenities && amenities.length > 0) {
    for (const amenity of amenities) {
      const item = document.createElement("li");
      item.textContent = amenity.name || amenity;
      list.appendChild(item);
    }
  } else {
    const item = document.createElement("li");
    item.textContent = "No amenities listed yet";
    list.appendChild(item);
  }

  container.appendChild(title);
  container.appendChild(list);

  return container;
}*/

function getHostName(place) {
  if (place.owner && place.owner.first_name && place.owner.last_name) {
    return `${place.owner.first_name} ${place.owner.last_name}`;
  }

  if (place.owner && place.owner.first_name) {
    return place.owner.first_name;
  }

  return "Unknown host";
}

function getHostInitials(place) {
  const hostName = getHostName(place);

  if (!hostName || hostName === "Unknown host") {
    return "HG";
  }

  const parts = hostName
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function getHostImage(place) {
  const hostName = getHostName(place).toLowerCase();

  const hostImages = {
    "antoine gousset": "hbnb/images/hosts/antoine-gousset.jpg",
    "léa gousset": "hbnb/images/hosts/lea-gousset.jpg",
    "lea gousset": "hbnb/images/hosts/lea-gousset.jpg",
    "sebastien vallier": "hbnb/images/hosts/sebastien-vallier.jpg",
    "patricia le brun": "hbnb/images/hosts/patricia-le-brun.jpg",
    "benjy guerin": "hbnb/images/hosts/benjy-guerin.jpg",
    "micael magalhaes pinho": "hbnb/images/hosts/micael-magalhaes-pinho.jpg",
    "melissandre moreau": "hbnb/images/hosts/melissandre-moreau.jpg",
    "brice travers": "hbnb/images/hosts/brice-travers.jpg",
  };

  return hostImages[hostName] || null;
}

function getPlaceDisplayTitle(place) {
  return place?.title || place?.name || "Selected stay";
}

function buildReviewsByPlaceMap(reviews) {
  const reviewsByPlace = new Map();

  if (!Array.isArray(reviews)) {
    return reviewsByPlace;
  }

  for (const review of reviews) {
    if (!review || !review.place_id) {
      continue;
    }

    if (!reviewsByPlace.has(review.place_id)) {
      reviewsByPlace.set(review.place_id, []);
    }

    reviewsByPlace.get(review.place_id).push(review);
  }

  return reviewsByPlace;
}

function buildHostsDirectory(places, reviews) {
  if (!Array.isArray(places) || places.length === 0) {
    return [];
  }

  const reviewsByPlace = buildReviewsByPlaceMap(reviews);
  const hostsById = new Map();

  for (const place of places) {
    if (!place || !place.owner || !place.owner.id) {
      continue;
    }

    const ownerId = place.owner.id;

    if (!hostsById.has(ownerId)) {
      hostsById.set(ownerId, {
        id: ownerId,
        name: getHostName(place),
        image: getHostImage(place),
        initials: getHostInitials(place),
        places: [],
        reviews: [],
      });
    }

    const host = hostsById.get(ownerId);
    host.places.push(place);

    const placeReviews = reviewsByPlace.get(place.id) || [];

    if (placeReviews.length > 0) {
      host.reviews.push(...placeReviews);
    }
  }

  return Array.from(hostsById.values())
    .map((host) => {
      const leadPlace =
        host.places.slice().sort((firstPlace, secondPlace) => {
          const firstCount = (reviewsByPlace.get(firstPlace.id) || []).length;
          const secondCount = (reviewsByPlace.get(secondPlace.id) || []).length;
          return secondCount - firstCount;
        })[0] || host.places[0];

      const reviewSummary = getReviewSummary(host.reviews);

      return {
        id: host.id,
        name: host.name,
        image: host.image,
        initials: host.initials,
        places: host.places,
        leadPlaceTitle: getPlaceDisplayTitle(leadPlace),
        listingCount: host.places.length,
        reviewCount: reviewSummary ? reviewSummary.count : 0,
        reviewSummary,
      };
    })
    .sort((firstHost, secondHost) =>
      firstHost.name.localeCompare(secondHost.name, "fr", {
        sensitivity: "base",
      }),
    );
}

function renderHostPreviewMedia(host) {
  const hostName = escapeHtml(host.name);
  const initials = escapeHtml(host.initials);

  if (host.image) {
    return `
      <img
        src="${host.image}"
        alt="Portrait of ${hostName}"
        class="host-preview-photo-inner"
        loading="lazy"
      >
    `;
  }

  return `
    <div class="host-preview-photo-inner" aria-hidden="true">
      <span>${initials}</span>
    </div>
  `;
}

function renderHostPreviewCard(host) {
  const hostName = escapeHtml(host.name);
  const leadPlaceTitle = escapeHtml(host.leadPlaceTitle);
  const listingLabel = `${host.listingCount} stay${host.listingCount > 1 ? "s" : ""}`;
  const reviewLabel = `${host.reviewCount} review${host.reviewCount > 1 ? "s" : ""}`;
  const ratingLabel = host.reviewSummary
    ? `★ ${host.reviewSummary.averageLabel}`
    : "New";

  return `
    <article class="host-preview-card">
      <div class="host-preview-photo">
        ${renderHostPreviewMedia(host)}
      </div>

      <div class="host-preview-body">
        <div class="host-preview-top">
          <h3>${hostName}</h3>
          <span class="host-preview-rating">${ratingLabel}</span>
        </div>

        <p class="host-preview-location">${leadPlaceTitle}</p>

        <div class="host-preview-stats">
          <span>${listingLabel}</span>
          <span>${reviewLabel}</span>
        </div>
      </div>
    </article>
  `;
}

function displayHostsDirectory(hosts) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  if (!Array.isArray(hosts) || hosts.length === 0) {
    hostsList.innerHTML = renderStateCard(
      "No hosts available",
      "No hosts could be generated from the current platform data.",
    );
    setupRevealAnimations();
    return;
  }

  hostsList.innerHTML = hosts
    .map((host) => renderHostPreviewCard(host))
    .join("");
  setupRevealAnimations();
}

async function fetchHostsDirectory(token) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  try {
    const [placesResponse, reviewsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/places/`, {
        headers: buildAuthHeaders(token),
      }),
      fetch(`${API_BASE_URL}/reviews/`, {
        headers: buildAuthHeaders(token),
      }),
    ]);

    if (!placesResponse.ok || !reviewsResponse.ok) {
      throw new Error("Failed to fetch hosts directory data");
    }

    const [places, reviews] = await Promise.all([
      parseJsonSafely(placesResponse),
      parseJsonSafely(reviewsResponse),
    ]);

    const hosts = buildHostsDirectory(
      Array.isArray(places) ? places : [],
      Array.isArray(reviews) ? reviews : [],
    );

    displayHostsDirectory(hosts);
  } catch (error) {
    hostsList.innerHTML = renderStateCard(
      "Unable to load hosts",
      "The hosts directory could not be loaded right now.",
    );

    throw error;
  }
}

function renderHostPreviewMedia(host) {
  const hostName = escapeHtml(host.name);
  const initials = escapeHtml(host.initials);

  if (host.image) {
    return `
      <img
        src="${host.image}"
        alt="Portrait of ${hostName}"
        class="host-preview-photo-inner"
        loading="lazy"
      >
    `;
  }

  return `
    <div class="host-preview-photo-inner" aria-hidden="true">
      <span>${initials}</span>
    </div>
  `;
}

function renderHostPreviewCard(host) {
  const hostName = escapeHtml(host.name);
  const leadPlaceTitle = escapeHtml(host.leadPlaceTitle);
  const listingLabel = `${host.listingCount} stay${host.listingCount > 1 ? "s" : ""}`;
  const reviewLabel = `${host.reviewCount} review${host.reviewCount > 1 ? "s" : ""}`;
  const ratingLabel = host.reviewSummary
    ? `★ ${host.reviewSummary.averageLabel}`
    : "New";

  return `
    <article class="host-preview-card">
      <div class="host-preview-photo">
        ${renderHostPreviewMedia(host)}
      </div>

      <div class="host-preview-body">
        <div class="host-preview-top">
          <h3>${hostName}</h3>
          <span class="host-preview-rating">${ratingLabel}</span>
        </div>

        <p class="host-preview-location">${leadPlaceTitle}</p>

        <div class="host-preview-stats">
          <span>${listingLabel}</span>
          <span>${reviewLabel}</span>
        </div>
      </div>
    </article>
  `;
}

function displayHostsDirectory(hosts) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  if (!Array.isArray(hosts) || hosts.length === 0) {
    hostsList.innerHTML = renderStateCard(
      "No hosts available",
      "No hosts could be generated from the current platform data.",
    );
    setupRevealAnimations();
    return;
  }

  hostsList.innerHTML = hosts
    .map((host) => renderHostPreviewCard(host))
    .join("");
  setupRevealAnimations();
}

async function fetchHostsDirectory(token) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  try {
    const [placesResponse, reviewsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/places/`, {
        headers: buildAuthHeaders(token),
      }),
      fetch(`${API_BASE_URL}/reviews/`, {
        headers: buildAuthHeaders(token),
      }),
    ]);

    if (!placesResponse.ok || !reviewsResponse.ok) {
      throw new Error("Failed to fetch hosts directory data");
    }

    const [places, reviews] = await Promise.all([
      parseJsonSafely(placesResponse),
      parseJsonSafely(reviewsResponse),
    ]);

    const hosts = buildHostsDirectory(
      Array.isArray(places) ? places : [],
      Array.isArray(reviews) ? reviews : [],
    );

    displayHostsDirectory(hosts);
  } catch (error) {
    hostsList.innerHTML = renderStateCard(
      "Unable to load hosts",
      "The hosts directory could not be loaded right now.",
    );

    throw error;
  }
}

function renderHostCard(place) {
  const hostCard = document.getElementById("host-card");

  if (!hostCard) {
    return;
  }

  const hostName = escapeHtml(getHostName(place));
  const initials = escapeHtml(getHostInitials(place));
  const hostImage = getHostImage(place);

  const hostMedia = hostImage
    ? `<img src="${hostImage}" alt="${hostName}" class="host-card-image" loading="lazy">`
    : `<div class="host-card-avatar" aria-hidden="true">${initials}</div>`;

  hostCard.innerHTML = `
    <p class="section-kicker">Host spotlight</p>

    <div class="host-card-media">
      ${hostMedia}
    </div>

    <div class="host-card-body">
      <h2>Meet your host</h2>
      <p class="host-card-name">${hostName}</p>
      <p class="host-card-role">Local host</p>
      <p class="host-card-text">
        Thoughtful hosting and carefully prepared stays designed for a smoother guest experience.
      </p>
    </div>
  `;
}

function renderReviewSummaryCard(reviewSummary = null) {
  const reviewSummaryCard = document.getElementById("review-summary-card");

  if (!reviewSummaryCard) {
    return;
  }

  if (!reviewSummary) {
    reviewSummaryCard.innerHTML = `
      <p class="section-kicker">Guest rating</p>
      <div class="review-summary-empty">
        Reviews will appear here once guests start sharing feedback.
      </div>
    `;
    return;
  }

  reviewSummaryCard.innerHTML = `
    <p class="section-kicker">Guest rating</p>

    <div
      class="review-summary-box"
      aria-label="${reviewSummary.averageLabel} out of 5 from ${reviewSummary.count} reviews"
    >
      <div class="review-summary-top">
        <span class="review-summary-value">${reviewSummary.averageLabel}</span>
        <span class="review-summary-scale">/ 5</span>
      </div>

      <div class="review-summary-stars">
        ${renderStarRating(reviewSummary.average)}
      </div>

      <p class="review-summary-count">${reviewSummary.countLabel}</p>
    </div>
  `;
}

function getReviewAuthorName(review) {
  if (review.user && typeof review.user === "object") {
    const firstName = review.user.first_name || "";
    const lastName = review.user.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    }
  }

  if (typeof review.user === "string" && review.user.trim()) {
    return review.user;
  }

  return "Anonymous guest";
}

function renderStarRating(rating) {
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < safeRating;
    return `<span class="review-star${isFilled ? " is-filled" : ""}" aria-hidden="true">★</span>`;
  }).join("");
}

function getReviewSummary(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return null;
  }

  const ratings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

  if (ratings.length === 0) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  const average = total / ratings.length;
  const count = ratings.length;

  return {
    average,
    averageLabel: average.toFixed(1),
    count,
    countLabel: `${count} review${count > 1 ? "s" : ""}`,
  };
}

function displayPlaceReviews(reviews) {
  const reviewsSection = document.getElementById("reviews");

  if (!reviewsSection) {
    return;
  }

  reviewsSection.innerHTML = `
    <div class="reviews-section-header">
      <p class="section-kicker">Guest feedback</p>
      <h2>Reviews</h2>
    </div>
  `;

  if (!reviews || reviews.length === 0) {
    const noReviews = document.createElement("p");
    noReviews.classList.add("review-empty");
    noReviews.textContent =
      "No reviews yet. Be the first guest to share feedback about this stay.";
    reviewsSection.appendChild(noReviews);
    return;
  }

  const reviewsList = document.createElement("div");
  reviewsList.classList.add("reviews-list");

  for (const review of reviews) {
    const reviewCard = document.createElement("article");
    reviewCard.classList.add("review-card");

    const authorName = getReviewAuthorName(review);
    const rating = Number(review.rating) || 0;
    const starsMarkup = renderStarRating(rating);

    reviewCard.innerHTML = `
  <div class="review-card-header">
    <h3>${authorName}</h3>
    <div class="review-rating" aria-label="${rating} out of 5">
      <div class="review-rating-stars">
        ${starsMarkup}
      </div>
      <span class="review-rating-value">${rating}/5</span>
    </div>
  </div>
  <p class="review-comment">${review.text || "No comment provided."}</p>
`;

    reviewsList.appendChild(reviewCard);
  }

  reviewsSection.appendChild(reviewsList);
  setupRevealAnimations();
}

function displayPlaceSummary(place) {
  const placeSummarySection = document.querySelector(".place-summary");

  if (!placeSummarySection) {
    return;
  }

  const title = escapeHtml(place.title || place.name || "Selected stay");
  const price = Number(place.price) || 0;

  placeSummarySection.innerHTML = `
    <p class="section-kicker">Selected stay</p>
    <h2>Place Summary</h2>
    <p><strong>Name:</strong> ${title}</p>
    <p><strong>Host:</strong> ${escapeHtml(getHostName(place))}</p>
    <p><strong>Price:</strong> €${price} per night</p>
  `;
}

function renderHostPreviewMedia(host) {
  const hostName = escapeHtml(host.name);
  const initials = escapeHtml(host.initials);

  if (host.image) {
    return `
      <img
        src="${host.image}"
        alt="Portrait of ${hostName}"
        class="host-preview-photo-inner"
        loading="lazy"
      >
    `;
  }

  return `
    <div class="host-preview-photo-inner" aria-hidden="true">
      <span>${initials}</span>
    </div>
  `;
}

function renderHostPreviewCard(host) {
  const hostName = escapeHtml(host.name);
  const leadPlaceTitle = escapeHtml(host.leadPlaceTitle);
  const listingLabel = `${host.listingCount} stay${host.listingCount > 1 ? "s" : ""}`;
  const reviewLabel = `${host.reviewCount} review${host.reviewCount > 1 ? "s" : ""}`;
  const ratingLabel = host.reviewSummary
    ? `★ ${host.reviewSummary.averageLabel}`
    : "New";

  return `
    <article class="host-preview-card">
      <div class="host-preview-photo">
        ${renderHostPreviewMedia(host)}
      </div>

      <div class="host-preview-body">
        <div class="host-preview-top">
          <h3>${hostName}</h3>
          <span class="host-preview-rating">${ratingLabel}</span>
        </div>

        <p class="host-preview-location">${leadPlaceTitle}</p>

        <div class="host-preview-stats">
          <span>${listingLabel}</span>
          <span>${reviewLabel}</span>
        </div>
      </div>
    </article>
  `;
}

function displayHostsDirectory(hosts) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  if (!Array.isArray(hosts) || hosts.length === 0) {
    hostsList.innerHTML = renderStateCard(
      "No hosts available",
      "No hosts could be generated from the current platform data.",
    );
    setupRevealAnimations();
    return;
  }

  hostsList.innerHTML = hosts
    .map((host) => renderHostPreviewCard(host))
    .join("");
  setupRevealAnimations();
}

async function fetchHostsDirectory(token) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  try {
    const [placesResponse, reviewsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/places/`, {
        headers: buildAuthHeaders(token),
      }),
      fetch(`${API_BASE_URL}/reviews/`, {
        headers: buildAuthHeaders(token),
      }),
    ]);

    if (!placesResponse.ok || !reviewsResponse.ok) {
      throw new Error("Failed to fetch hosts directory data");
    }

    const [places, reviews] = await Promise.all([
      parseJsonSafely(placesResponse),
      parseJsonSafely(reviewsResponse),
    ]);

    const hosts = buildHostsDirectory(
      Array.isArray(places) ? places : [],
      Array.isArray(reviews) ? reviews : [],
    );

    displayHostsDirectory(hosts);
  } catch (error) {
    hostsList.innerHTML = renderStateCard(
      "Unable to load hosts",
      "The hosts directory could not be loaded right now.",
    );

    throw error;
  }
}

function populatePriceFilter() {
  const priceFilter = document.getElementById("price-filter");

  if (!priceFilter) {
    return;
  }

  priceFilter.innerHTML = "";

  const prices = [
    { label: "All prices", value: "All" },
    { label: "Up to €50", value: "50" },
    { label: "Up to €100", value: "100" },
    { label: "Up to €200", value: "200" },
  ];

  for (const price of prices) {
    const option = document.createElement("option");
    option.textContent = price.label;
    option.value = price.value;
    priceFilter.appendChild(option);
  }
}

function setupPriceFilter() {
  const priceFilter = document.getElementById("price-filter");

  if (!priceFilter) {
    return;
  }

  priceFilter.addEventListener("change", (event) => {
    const selectedPrice = event.target.value;
    const placeCards = document.querySelectorAll(".place-card");

    for (const placeCard of placeCards) {
      const placePrice = Number(placeCard.dataset.price);
      const shouldDisplay =
        selectedPrice === "All" || placePrice <= Number(selectedPrice);

      placeCard.style.display = shouldDisplay ? "" : "none";
    }
  });
}

function renderAddReviewAccess(token, placeId) {
  const addReviewSection = document.getElementById("add-review");

  if (!addReviewSection) {
    return;
  }

  if (!token) {
    addReviewSection.innerHTML = `
      <p class="section-kicker">Guest contribution</p>
      <h2>Share your experience</h2>
      <p class="add-review-text">
        Log in to leave a review and help future guests choose with confidence.
      </p>
      <a href="login.html" class="details-button">Log in to review</a>
      <p class="add-review-note">
        Reviews are available to authenticated guests only.
      </p>
    `;
    return;
  }

  addReviewSection.innerHTML = `
    <p class="section-kicker">Guest contribution</p>
    <h2>Share your experience</h2>
    <p class="add-review-text">
      Leave a short, useful review about the comfort, amenities, and overall stay.
    </p>
    <a href="add_review.html?id=${placeId}" class="details-button">Add Review</a>
    <p class="add-review-note">
      Clear and honest feedback helps future guests compare more easily.
    </p>
  `;
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const loginForm = event.currentTarget;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");
  const submitButton = loginForm.querySelector('button[type="submit"]');

  resetFormMessage(loginMessage);

  if (!email || !password) {
    setFormMessage(
      loginMessage,
      "Please enter both your email and password.",
      "error",
    );
    return;
  }

  setButtonLoading(submitButton, true, "Signing in...");
  setFormMessage(loginMessage, "Checking your credentials...", "loading");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonSafely(response);

    if (response.ok && data.access_token) {
      document.cookie = `${TOKEN_COOKIE_NAME}=${data.access_token}; path=/`;
      setButtonLoading(submitButton, false);
      setFormMessage(
        loginMessage,
        "Login successful. Redirecting...",
        "success",
      );

      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 450);

      return;
    }

    setButtonLoading(submitButton, false);
    setFormMessage(
      loginMessage,
      data.error || "Invalid email or password.",
      "error",
    );
  } catch (error) {
    setButtonLoading(submitButton, false);
    setFormMessage(
      loginMessage,
      "An error occurred while trying to log in.",
      "error",
    );
  }
}

async function handleReviewSubmit(event, token, placeId, reviewForm) {
  event.preventDefault();

  const reviewText = document.getElementById("review").value.trim();
  const rating = document.getElementById("rating").value;
  const numericRating = Number(rating);
  const reviewMessage = document.getElementById("review-message");
  const submitButton = reviewForm.querySelector('button[type="submit"]');

  resetFormMessage(reviewMessage);

  if (!reviewText) {
    setFormMessage(reviewMessage, "Review cannot be empty.", "error");
    return;
  }

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    setFormMessage(
      reviewMessage,
      "Please choose a valid rating between 1 and 5.",
      "error",
    );
    return;
  }

  if (!placeId) {
    setFormMessage(reviewMessage, "Place ID not found.", "error");
    return;
  }

  const reviewData = {
    text: reviewText,
    rating: numericRating,
    place_id: placeId,
  };

  setButtonLoading(submitButton, true, "Submitting...");
  setFormMessage(reviewMessage, "Submitting your review...", "loading");

  try {
    const response = await fetch(`${API_BASE_URL}/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await parseJsonSafely(response);

    setButtonLoading(submitButton, false);

    if (response.ok) {
      reviewForm.reset();
      setFormMessage(
        reviewMessage,
        "Review submitted successfully.",
        "success",
      );
      return;
    }

    setFormMessage(
      reviewMessage,
      data.error || "Failed to submit review.",
      "error",
    );
  } catch (error) {
    setButtonLoading(submitButton, false);
    setFormMessage(
      reviewMessage,
      "An error occurred while submitting the review.",
      "error",
    );
  }
}

let placeGalleryLightboxState = {
  images: [],
  currentIndex: 0,
};

function ensurePlaceImageLightbox() {
  let lightbox = document.getElementById("place-image-lightbox");

  if (lightbox) {
    return lightbox;
  }

  lightbox = document.createElement("div");
  lightbox.id = "place-image-lightbox";
  lightbox.className = "place-image-lightbox";
  lightbox.setAttribute("aria-hidden", "true");

  lightbox.innerHTML = `
    <div class="place-image-lightbox-backdrop" data-lightbox-close="true"></div>

    <div
      class="place-image-lightbox-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded place gallery"
    >
      <button
  type="button"
  class="place-image-lightbox-nav place-image-lightbox-nav--prev"
  aria-label="Previous image"
  data-lightbox-prev="true"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 18L9 12L15 6" />
  </svg>
</button>

      <div class="place-image-lightbox-figure">
        <button
  type="button"
  class="place-image-lightbox-close"
  aria-label="Close image preview"
  data-lightbox-close="true"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6L18 18" />
    <path d="M18 6L6 18" />
  </svg>
</button>

        <img
          src=""
          alt=""
          class="place-image-lightbox-image"
        >

        <p class="place-image-lightbox-counter" aria-live="polite"></p>
      </div>

      <button
  type="button"
  class="place-image-lightbox-nav place-image-lightbox-nav--next"
  aria-label="Next image"
  data-lightbox-next="true"
>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 18L15 12L9 6" />
  </svg>
</button>
    </div>
  `;

  document.body.appendChild(lightbox);
  return lightbox;
}

function updateHeaderPlaceContext(place) {
  const target = document.getElementById("header-place-context");

  if (!target || !place) {
    return;
  }

  const title = place.title || place.name || "";
  const match = title.match(/\bin\s+(.+)$/i);
  const location =
    place.city || place.location || (match ? match[1] : "Brittany");

  target.textContent = `${location} · refined coastal stay`;
}

function updatePlaceImageLightbox() {
  const lightbox = ensurePlaceImageLightbox();
  const image = lightbox.querySelector(".place-image-lightbox-image");
  const counter = lightbox.querySelector(".place-image-lightbox-counter");

  const { images, currentIndex } = placeGalleryLightboxState;

  if (!images.length || !images[currentIndex]) {
    return;
  }

  const currentImage = images[currentIndex];

  image.src = currentImage.src;
  image.alt = currentImage.alt || "Expanded place image";
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function openPlaceImageLightbox(images, startIndex = 0) {
  if (!images || !images.length) {
    return;
  }

  placeGalleryLightboxState.images = images;
  placeGalleryLightboxState.currentIndex = startIndex;

  updatePlaceImageLightbox();

  const lightbox = ensurePlaceImageLightbox();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
}

function closePlaceImageLightbox() {
  const lightbox = document.getElementById("place-image-lightbox");

  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
}

function showPreviousPlaceImage() {
  const { images, currentIndex } = placeGalleryLightboxState;

  if (!images.length) {
    return;
  }

  placeGalleryLightboxState.currentIndex =
    (currentIndex - 1 + images.length) % images.length;

  updatePlaceImageLightbox();
}

function showNextPlaceImage() {
  const { images, currentIndex } = placeGalleryLightboxState;

  if (!images.length) {
    return;
  }

  placeGalleryLightboxState.currentIndex = (currentIndex + 1) % images.length;

  updatePlaceImageLightbox();
}

function getPlaceGalleryImages(trigger) {
  const gallery = trigger.closest(".place-gallery");

  if (!gallery) {
    return [];
  }

  const triggers = [...gallery.querySelectorAll(".place-gallery-trigger")];

  return triggers.map((item) => ({
    src: item.dataset.imageSrc,
    alt: item.dataset.imageAlt || "Expanded place image",
  }));
}

function initializePlaceGalleryLightbox() {
  ensurePlaceImageLightbox();

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".place-gallery-trigger");

    if (trigger) {
      const gallery = trigger.closest(".place-gallery");
      const triggers = gallery
        ? [...gallery.querySelectorAll(".place-gallery-trigger")]
        : [];
      const images = getPlaceGalleryImages(trigger);
      const startIndex = triggers.indexOf(trigger);

      openPlaceImageLightbox(images, startIndex >= 0 ? startIndex : 0);
      return;
    }

    if (event.target.closest("[data-lightbox-close='true']")) {
      closePlaceImageLightbox();
      return;
    }

    if (event.target.closest("[data-lightbox-prev='true']")) {
      showPreviousPlaceImage();
      return;
    }

    if (event.target.closest("[data-lightbox-next='true']")) {
      showNextPlaceImage();
    }
  });

  document.addEventListener("keydown", (event) => {
    const lightbox = document.getElementById("place-image-lightbox");

    if (!lightbox || !lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closePlaceImageLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      showPreviousPlaceImage();
      return;
    }

    if (event.key === "ArrowRight") {
      showNextPlaceImage();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeThemeToggle();
  populatePriceFilter();
  setupPriceFilter();
  initializePlaceGalleryLightbox();

  const token = checkAuthentication();
  initializeHeroBackgrounds();
  setupRevealAnimations();
  const placeId = getPlaceIdFromURL();

  const placesList = document.getElementById("places-list");
  const hostsList = document.getElementById("hosts-list");
  const placeDetailsSection = document.getElementById("place-details");
  const placeSummarySection = document.querySelector(".place-summary");
  const loginForm = document.getElementById("login-form");
  const reviewForm = document.getElementById("review-form");

  if (loginForm && token) {
    window.location.href = "index.html";
    return;
  }

  if (placesList) {
    fetchPlaces(token).catch((error) => {
      console.error("Error fetching places:", error);
    });
  }

  if (hostsList) {
    fetchHostsDirectory(token).catch((error) => {
      console.error("Error fetching hosts directory:", error);
    });
  }

  if (placeId && (placeDetailsSection || placeSummarySection)) {
    fetchPlaceDetails(token, placeId).catch((error) => {
      console.error("Error fetching place details:", error);
    });
  }

  if (placeId && placeDetailsSection) {
    renderAddReviewAccess(token, placeId);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  if (reviewForm && placeSummarySection) {
    const reviewToken = requireAuthentication();

    if (!reviewToken) {
      return;
    }

    reviewForm.addEventListener("submit", async (event) => {
      await handleReviewSubmit(event, reviewToken, placeId, reviewForm);
    });
  }
});

const LANGUAGE_STORAGE_KEY = "hbnb-language";
const DEFAULT_LANGUAGE = "en";
const APP_STATE = {
  places: null,
  reviewSummaryMap: new Map(),
  currentPlace: null,
  currentReviews: null,
  currentReviewSummary: null,
  hosts: null,
};

const TRANSLATIONS = {
  en: {
    "titles.index": "List of Places",
    "titles.place": "Place Details",
    "titles.login": "Login",
    "titles.hosts": "Hosts",
    "titles.addReview": "Add Review",
    "common.brand.homeAria": "HBNB home",
    "common.brand.logoAlt": "Application logo",
    "common.brand.tagline": "Where comfort meets elegance",
    "common.nav.aria": "Primary navigation",
    "common.nav.home": "Home",
    "common.nav.hosts": "Hosts",
    "common.nav.login": "Login",
    "common.nav.logout": "Logout",
    "common.theme.toggle": "Toggle color theme",
    "common.theme.mode": "Toggle dark mode",
    "common.language.toggle": "Toggle language",
    "common.footer.brandText":
      "Curated premium stays designed for elegant and memorable experiences.",
    "common.footer.navTitle": "Navigation",
    "common.footer.explore": "Explore stays",
    "common.footer.experienceTitle": "Experience",
    "common.footer.experience1": "Elegant destinations",
    "common.footer.experience2": "Premium comfort",
    "common.footer.experience3": "Clear and trusted reviews",
    "common.footer.rights": "© 2026 HBNB — All rights reserved.",
    "index.header.kicker": "Collection",
    "index.header.text": "Curated stays across Brittany",
    "index.hero.kicker": "Curated premium stays",
    "index.hero.title": "Experience refined stays in exceptional places",
    "index.hero.text":
      "Discover elegant properties, premium comfort, and carefully selected destinations designed for memorable stays.",
    "index.hero.cta": "Explore stays",
    "index.panel.aria": "Premium selection highlights",
    "index.panel.label": "Designed for quality stays",
    "index.panel.item1": "Handpicked destinations",
    "index.panel.item2": "Elegant interiors and refined comfort",
    "index.panel.item3": "Clear pricing and smooth browsing",
    "index.intro.kicker": "Browse the collection",
    "index.intro.title": "Find the stay that fits your pace",
    "index.intro.text":
      "Use the price filter to narrow the selection and compare properties more easily.",
    "index.filter.aria": "Filter places by maximum price",
    "index.filter.label": "Max price",
    "place.header.kicker": "Stay details",
    "place.header.defaultContext": "Coastal stay, Brittany",
    "place.host.aria": "Host information",
    "place.host.kicker": "Host spotlight",
    "place.host.title": "Meet your host",
    "place.host.loading": "Loading host...",
    "place.host.role": "Local host",
    "place.host.text": "Thoughtful hosting and carefully prepared stays.",
    "place.host.tag1": "Guest-focused",
    "place.host.tag2": "Carefully prepared",
    "place.addreview.kicker": "Guest contribution",
    "place.addreview.title": "Share your experience",
    "place.addreview.text":
      "Log in to leave a review and help future guests choose with confidence.",
    "place.reviewSummary.aria": "Guest rating summary",
    "place.reviews.kicker": "Guest feedback",
    "place.reviews.title": "Reviews",
    "login.header.kicker": "Guest access",
    "login.header.text": "Reviews, hosts and stays in one place",
    "login.intro.kicker": "Member access",
    "login.intro.title": "Sign in to continue your experience",
    "login.intro.text":
      "Access your account to browse stays, leave reviews, and continue exploring carefully selected places with a smoother experience.",
    "login.card.title": "Why sign in?",
    "login.card.benefit1": "Leave reviews and share feedback",
    "login.card.benefit2": "Access a smoother guest experience",
    "login.card.benefit3": "Keep browsing with a cleaner flow",
    "login.form.title": "Login",
    "login.form.email": "Email",
    "login.form.emailPlaceholder": "Enter your email",
    "login.form.password": "Password",
    "login.form.passwordPlaceholder": "Enter your password",
    "login.form.submit": "Login",
    "hosts.header.kicker": "Hosts directory",
    "hosts.header.text": "Trusted hosts, reviewed stays",
    "hosts.hero.kicker": "Meet our hosts",
    "hosts.hero.title": "Discover the people behind each exceptional stay",
    "hosts.hero.text":
      "Browse our hosts, their signature properties, and the average ratings guests have given them across the platform.",
    "hosts.empty.badge": "Hosts directory",
    "hosts.empty.title": "Trusted hosts, curated stays",
    "hosts.empty.text":
      "Each host below is generated dynamically from the current platform data, including places, reviews and average ratings.",
    "hosts.preview.aria": "Hosts directory",
    "hosts.preview.kicker": "Directory",
    "hosts.preview.title": "Our hosts at a glance",
    "hosts.preview.text":
      "Explore the current host roster with their profile images, properties, review volume and average ratings.",
    "hosts.loading.title": "Loading hosts",
    "hosts.loading.text":
      "Please wait while the hosts directory is being prepared.",
    "add.header.kicker": "Guest review",
    "add.header.text": "Share concise and useful feedback",
    "add.intro.kicker": "Guest contribution",
    "add.intro.title": "Add a Review",
    "add.intro.text":
      "Share clear, useful feedback about the stay, comfort, amenities, and overall experience.",
    "add.summary.kicker": "Selected stay",
    "add.summary.title": "Place Summary",
    "add.summary.loading": "Loading place summary...",
    "add.form.reviewLabel": "Your review",
    "add.form.reviewPlaceholder":
      "Describe the stay, comfort, amenities, and overall impression.",
    "add.form.ratingLabel": "Rating",
    "add.form.optionPlaceholder": "Choose a rating",
    "add.form.option1": "1 — Very poor",
    "add.form.option2": "2 — Fair",
    "add.form.option3": "3 — Good",
    "add.form.option4": "4 — Very good",
    "add.form.option5": "5 — Excellent",
    "add.form.submit": "Submit Review",
    "dynamic.noStaysTitle": "No stays available",
    "dynamic.noStaysText": "No places match the current selection yet.",
    "dynamic.imageComingSoon": "Image coming soon",
    "dynamic.moreVisualsComingSoon": "More visuals coming soon",
    "dynamic.selectedStay": "Selected stay",
    "dynamic.defaultDescription":
      "Elegant stay, premium comfort, and carefully selected amenities.",
    "dynamic.viewDetails": "View details",
    "dynamic.descriptionTitle": "Description",
    "dynamic.refinedStayDescription":
      "A refined stay with comfort, character, and carefully selected amenities.",
    "dynamic.amenitiesTitle": "Amenities",
    "dynamic.noAmenities": "No amenities listed yet.",
    "dynamic.unknownHost": "Unknown host",
    "dynamic.hostSpotlight": "Host spotlight",
    "dynamic.meetHost": "Meet your host",
    "dynamic.localHost": "Local host",
    "dynamic.hostText":
      "Thoughtful hosting and carefully prepared stays designed for a smoother guest experience.",
    "dynamic.guestFocused": "Guest-focused",
    "dynamic.carefullyPrepared": "Carefully prepared",
    "dynamic.guestRating": "Guest rating",
    "dynamic.reviewsAppearSoon":
      "Reviews will appear here once guests start sharing feedback.",
    "dynamic.anonymousGuest": "Anonymous guest",
    "dynamic.guestFeedback": "Guest feedback",
    "dynamic.reviewsTitle": "Reviews",
    "dynamic.noReviews":
      "No reviews yet. Be the first guest to share feedback about this stay.",
    "dynamic.noComment": "No comment provided.",
    "dynamic.placeSummaryTitle": "Place Summary",
    "dynamic.labelName": "Name:",
    "dynamic.labelHost": "Host:",
    "dynamic.labelPrice": "Price:",
    "dynamic.new": "New",
    "dynamic.noHostsAvailableTitle": "No hosts available",
    "dynamic.noHostsAvailableText":
      "No hosts could be generated from the current platform data.",
    "dynamic.unableToLoadHostsTitle": "Unable to load hosts",
    "dynamic.unableToLoadHostsText":
      "The hosts directory could not be loaded right now.",
    "dynamic.allPrices": "All prices",
    "dynamic.addReviewLoginText":
      "Log in to leave a review and help future guests choose with confidence.",
    "dynamic.addReviewLoginCta": "Log in to review",
    "dynamic.addReviewLoginNote":
      "Reviews are available to authenticated guests only.",
    "dynamic.addReviewAuthText":
      "Leave a short, useful review about the comfort, amenities, and overall stay.",
    "dynamic.addReviewAuthCta": "Add Review",
    "dynamic.addReviewAuthNote":
      "Clear and honest feedback helps future guests compare more easily.",
    "dynamic.loginMissingFields": "Please enter both your email and password.",
    "dynamic.signingIn": "Signing in...",
    "dynamic.checkingCredentials": "Checking your credentials...",
    "dynamic.loginSuccess": "Login successful. Redirecting...",
    "dynamic.invalidCredentials": "Invalid email or password.",
    "dynamic.loginError": "An error occurred while trying to log in.",
    "dynamic.reviewEmpty": "Review cannot be empty.",
    "dynamic.reviewInvalidRating":
      "Please choose a valid rating between 1 and 5.",
    "dynamic.placeIdMissing": "Place ID not found.",
    "dynamic.submitting": "Submitting...",
    "dynamic.submittingReview": "Submitting your review...",
    "dynamic.reviewSuccess": "Review submitted successfully.",
    "dynamic.reviewFailed": "Failed to submit review.",
    "dynamic.reviewError": "An error occurred while submitting the review.",
    "dynamic.lightboxDialog": "Expanded place gallery",
    "dynamic.lightboxPrev": "Previous image",
    "dynamic.lightboxNext": "Next image",
    "dynamic.lightboxClose": "Close image preview",
    "dynamic.expandedImageAlt": "Expanded place image",
    "dynamic.refinedStayContext": "refined stay",
  },
  fr: {
    "titles.index": "Liste des logements",
    "titles.place": "Détails du logement",
    "titles.login": "Connexion",
    "titles.hosts": "Hôtes",
    "titles.addReview": "Ajouter un avis",
    "common.brand.homeAria": "Accueil HBNB",
    "common.brand.logoAlt": "Logo de l'application",
    "common.brand.tagline": "Quand le confort rencontre l'élégance",
    "common.nav.aria": "Navigation principale",
    "common.nav.home": "Accueil",
    "common.nav.hosts": "Hôtes",
    "common.nav.login": "Connexion",
    "common.nav.logout": "Déconnexion",
    "common.theme.toggle": "Changer le thème",
    "common.theme.mode": "Activer le mode sombre",
    "common.language.toggle": "Changer de langue",
    "common.footer.brandText":
      "Des séjours premium pensés pour des expériences élégantes et mémorables.",
    "common.footer.navTitle": "Navigation",
    "common.footer.explore": "Explorer les logements",
    "common.footer.experienceTitle": "Expérience",
    "common.footer.experience1": "Destinations élégantes",
    "common.footer.experience2": "Confort premium",
    "common.footer.experience3": "Avis clairs et fiables",
    "common.footer.rights": "© 2026 HBNB — Tous droits réservés.",
    "index.header.kicker": "Collection",
    "index.header.text": "Séjours sélectionnés à travers la Bretagne",
    "index.hero.kicker": "Séjours premium sélectionnés",
    "index.hero.title": "Vivez des séjours raffinés dans des lieux d'exception",
    "index.hero.text":
      "Découvrez des propriétés élégantes, un confort premium et des destinations soigneusement choisies pour des séjours mémorables.",
    "index.hero.cta": "Explorer les logements",
    "index.panel.aria": "Points forts de la sélection premium",
    "index.panel.label": "Pensé pour des séjours de qualité",
    "index.panel.item1": "Destinations soigneusement choisies",
    "index.panel.item2": "Intérieurs élégants et confort raffiné",
    "index.panel.item3": "Tarifs clairs et navigation fluide",
    "index.intro.kicker": "Parcourir la collection",
    "index.intro.title": "Trouvez le séjour qui correspond à votre rythme",
    "index.intro.text":
      "Utilisez le filtre de prix pour affiner la sélection et comparer les logements plus facilement.",
    "index.filter.aria": "Filtrer les logements par prix maximum",
    "index.filter.label": "Prix max",
    "place.header.kicker": "Détails du séjour",
    "place.header.defaultContext": "Séjour côtier, Bretagne",
    "place.host.aria": "Informations sur l'hôte",
    "place.host.kicker": "Hôte à l'honneur",
    "place.host.title": "Rencontrez votre hôte",
    "place.host.loading": "Chargement de l'hôte...",
    "place.host.role": "Hôte local",
    "place.host.text":
      "Un accueil attentionné et des séjours préparés avec soin.",
    "place.host.tag1": "Orienté voyageurs",
    "place.host.tag2": "Préparé avec soin",
    "place.addreview.kicker": "Contribution voyageur",
    "place.addreview.title": "Partagez votre expérience",
    "place.addreview.text":
      "Connectez-vous pour laisser un avis et aider les futurs voyageurs à choisir en toute confiance.",
    "place.reviewSummary.aria": "Résumé de la note des voyageurs",
    "place.reviews.kicker": "Retours des voyageurs",
    "place.reviews.title": "Avis",
    "login.header.kicker": "Accès voyageur",
    "login.header.text": "Avis, hôtes et séjours au même endroit",
    "login.intro.kicker": "Accès membre",
    "login.intro.title": "Connectez-vous pour poursuivre votre expérience",
    "login.intro.text":
      "Accédez à votre compte pour parcourir les logements, laisser des avis et continuer à explorer des lieux soigneusement sélectionnés avec une expérience plus fluide.",
    "login.card.title": "Pourquoi se connecter ?",
    "login.card.benefit1": "Laisser des avis et partager vos retours",
    "login.card.benefit2": "Profiter d'une expérience voyageur plus fluide",
    "login.card.benefit3": "Continuer votre navigation plus sereinement",
    "login.form.title": "Connexion",
    "login.form.email": "Email",
    "login.form.emailPlaceholder": "Saisissez votre email",
    "login.form.password": "Mot de passe",
    "login.form.passwordPlaceholder": "Saisissez votre mot de passe",
    "login.form.submit": "Connexion",
    "hosts.header.kicker": "Annuaire des hôtes",
    "hosts.header.text": "Hôtes fiables, séjours évalués",
    "hosts.hero.kicker": "Rencontrez nos hôtes",
    "hosts.hero.title":
      "Découvrez les personnes derrière chaque séjour d'exception",
    "hosts.hero.text":
      "Parcourez nos hôtes, leurs propriétés phares et les notes moyennes que les voyageurs leur attribuent sur la plateforme.",
    "hosts.empty.badge": "Annuaire des hôtes",
    "hosts.empty.title": "Hôtes de confiance, séjours sélectionnés",
    "hosts.empty.text":
      "Chaque hôte ci-dessous est généré dynamiquement à partir des données actuelles de la plateforme, y compris les logements, les avis et les notes moyennes.",
    "hosts.preview.aria": "Annuaire des hôtes",
    "hosts.preview.kicker": "Annuaire",
    "hosts.preview.title": "Nos hôtes en un coup d'œil",
    "hosts.preview.text":
      "Découvrez la liste actuelle des hôtes avec leurs photos de profil, leurs logements, le volume d'avis et les notes moyennes.",
    "hosts.loading.title": "Chargement des hôtes",
    "hosts.loading.text":
      "Veuillez patienter pendant la préparation de l'annuaire des hôtes.",
    "add.header.kicker": "Avis voyageur",
    "add.header.text": "Partagez un retour concis et utile",
    "add.intro.kicker": "Contribution voyageur",
    "add.intro.title": "Ajouter un avis",
    "add.intro.text":
      "Partagez un retour clair et utile sur le séjour, le confort, les équipements et l'expérience globale.",
    "add.summary.kicker": "Séjour sélectionné",
    "add.summary.title": "Résumé du logement",
    "add.summary.loading": "Chargement du résumé du logement...",
    "add.form.reviewLabel": "Votre avis",
    "add.form.reviewPlaceholder":
      "Décrivez le séjour, le confort, les équipements et votre impression générale.",
    "add.form.ratingLabel": "Note",
    "add.form.optionPlaceholder": "Choisissez une note",
    "add.form.option1": "1 — Très insuffisant",
    "add.form.option2": "2 — Moyen",
    "add.form.option3": "3 — Bien",
    "add.form.option4": "4 — Très bien",
    "add.form.option5": "5 — Excellent",
    "add.form.submit": "Envoyer l'avis",
    "dynamic.noStaysTitle": "Aucun logement disponible",
    "dynamic.noStaysText":
      "Aucun logement ne correspond encore à la sélection actuelle.",
    "dynamic.imageComingSoon": "Image bientôt disponible",
    "dynamic.moreVisualsComingSoon": "D'autres visuels arrivent bientôt",
    "dynamic.selectedStay": "Séjour sélectionné",
    "dynamic.defaultDescription":
      "Séjour élégant, confort premium et équipements soigneusement sélectionnés.",
    "dynamic.viewDetails": "Voir les détails",
    "dynamic.descriptionTitle": "Description",
    "dynamic.refinedStayDescription":
      "Un séjour raffiné avec du confort, du caractère et des équipements soigneusement sélectionnés.",
    "dynamic.amenitiesTitle": "Équipements",
    "dynamic.noAmenities": "Aucun équipement renseigné pour le moment.",
    "dynamic.unknownHost": "Hôte inconnu",
    "dynamic.hostSpotlight": "Hôte à l'honneur",
    "dynamic.meetHost": "Rencontrez votre hôte",
    "dynamic.localHost": "Hôte local",
    "dynamic.hostText":
      "Un accueil attentionné et des séjours préparés avec soin pour une expérience voyageur plus fluide.",
    "dynamic.guestFocused": "Axé voyageurs",
    "dynamic.carefullyPrepared": "Préparé avec soin",
    "dynamic.guestRating": "Note voyageurs",
    "dynamic.reviewsAppearSoon":
      "Les avis apparaîtront ici dès que les voyageurs commenceront à partager leurs retours.",
    "dynamic.anonymousGuest": "Voyageur anonyme",
    "dynamic.guestFeedback": "Retours des voyageurs",
    "dynamic.reviewsTitle": "Avis",
    "dynamic.noReviews":
      "Aucun avis pour le moment. Soyez le premier voyageur à partager votre retour sur ce séjour.",
    "dynamic.noComment": "Aucun commentaire fourni.",
    "dynamic.placeSummaryTitle": "Résumé du logement",
    "dynamic.labelName": "Nom :",
    "dynamic.labelHost": "Hôte :",
    "dynamic.labelPrice": "Prix :",
    "dynamic.new": "Nouveau",
    "dynamic.noHostsAvailableTitle": "Aucun hôte disponible",
    "dynamic.noHostsAvailableText":
      "Aucun hôte n'a pu être généré à partir des données actuelles de la plateforme.",
    "dynamic.unableToLoadHostsTitle": "Impossible de charger les hôtes",
    "dynamic.unableToLoadHostsText":
      "L'annuaire des hôtes ne peut pas être chargé pour le moment.",
    "dynamic.allPrices": "Tous les prix",
    "dynamic.addReviewLoginText":
      "Connectez-vous pour laisser un avis et aider les futurs voyageurs à choisir en toute confiance.",
    "dynamic.addReviewLoginCta": "Se connecter pour laisser un avis",
    "dynamic.addReviewLoginNote":
      "Les avis sont réservés aux voyageurs authentifiés.",
    "dynamic.addReviewAuthText":
      "Laissez un avis court et utile sur le confort, les équipements et le séjour global.",
    "dynamic.addReviewAuthCta": "Ajouter un avis",
    "dynamic.addReviewAuthNote":
      "Des retours clairs et honnêtes aident les futurs voyageurs à comparer plus facilement.",
    "dynamic.loginMissingFields":
      "Veuillez saisir votre email et votre mot de passe.",
    "dynamic.signingIn": "Connexion en cours...",
    "dynamic.checkingCredentials": "Vérification de vos identifiants...",
    "dynamic.loginSuccess": "Connexion réussie. Redirection...",
    "dynamic.invalidCredentials": "Email ou mot de passe invalide.",
    "dynamic.loginError":
      "Une erreur est survenue lors de la tentative de connexion.",
    "dynamic.reviewEmpty": "L'avis ne peut pas être vide.",
    "dynamic.reviewInvalidRating":
      "Veuillez choisir une note valide entre 1 et 5.",
    "dynamic.placeIdMissing": "ID du logement introuvable.",
    "dynamic.submitting": "Envoi en cours...",
    "dynamic.submittingReview": "Envoi de votre avis...",
    "dynamic.reviewSuccess": "Avis envoyé avec succès.",
    "dynamic.reviewFailed": "Échec de l'envoi de l'avis.",
    "dynamic.reviewError": "Une erreur est survenue lors de l'envoi de l'avis.",
    "dynamic.lightboxDialog": "Galerie du logement agrandie",
    "dynamic.lightboxPrev": "Image précédente",
    "dynamic.lightboxNext": "Image suivante",
    "dynamic.lightboxClose": "Fermer l'aperçu de l'image",
    "dynamic.expandedImageAlt": "Image agrandie du logement",
    "dynamic.refinedStayContext": "séjour raffiné",
  },
};

function getStoredLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function getPreferredLanguage() {
  const storedLanguage = getStoredLanguage();

  if (storedLanguage === "fr" || storedLanguage === "en") {
    return storedLanguage;
  }

  return DEFAULT_LANGUAGE;
}

function getCurrentLanguage() {
  return document.documentElement.dataset.language || DEFAULT_LANGUAGE;
}

function t(key, replacements = {}) {
  const language = getCurrentLanguage();
  const entry = TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;

  return String(entry).replace(/\{(\w+)\}/g, (match, token) => {
    return token in replacements ? String(replacements[token]) : match;
  });
}

function formatCountLabel(type, count) {
  const language = getCurrentLanguage();
  const plural = count > 1;

  if (type === "review") {
    if (language === "fr") {
      return `${count} avis`;
    }
    return `${count} review${plural ? "s" : ""}`;
  }

  if (type === "stay") {
    if (language === "fr") {
      return `${count} séjour${plural ? "s" : ""}`;
    }
    return `${count} stay${plural ? "s" : ""}`;
  }

  if (type === "image") {
    if (language === "fr") {
      return `${count} image${plural ? "s" : ""}`;
    }
    return `${count} image${plural ? "s" : ""}`;
  }

  return `${count}`;
}

function formatPriceLabel(price) {
  return `${Number(price) || 0} € ${getCurrentLanguage() === "fr" ? "/ nuit" : "/ night"}`;
}

function formatPriceInline(price) {
  return `€${Number(price) || 0} ${getCurrentLanguage() === "fr" ? "/ nuit" : "/ night"}`;
}

function formatUpToPrice(price) {
  return getCurrentLanguage() === "fr"
    ? `Jusqu'à ${price} €`
    : `Up to €${price}`;
}

function syncLanguageToggleState(language) {
  const isFrench = language === "fr";

  for (const toggle of document.querySelectorAll(".language-toggle-input")) {
    toggle.checked = isFrench;
    toggle.setAttribute("aria-checked", String(isFrench));
  }
}

function applyStaticTranslations() {
  const pageTitleKey = document.body?.dataset.pageTitle;

  if (pageTitleKey) {
    document.title = t(pageTitleKey);
  }

  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = t(element.dataset.i18n);
  }

  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  }

  for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  }

  for (const element of document.querySelectorAll("[data-i18n-alt]")) {
    element.setAttribute("alt", t(element.dataset.i18nAlt));
  }
}

function refreshLocalizedContent() {
  applyStaticTranslations();
  checkAuthentication();
  populatePriceFilter();

  const placeId = getPlaceIdFromURL();
  const token = getAuthToken();

  if (
    document.getElementById("places-list") &&
    Array.isArray(APP_STATE.places)
  ) {
    displayPlaces(APP_STATE.places, APP_STATE.reviewSummaryMap);
  }

  if (document.getElementById("hosts-list") && Array.isArray(APP_STATE.hosts)) {
    displayHostsDirectory(APP_STATE.hosts);
  }

  if (document.getElementById("place-details") && APP_STATE.currentPlace) {
    displayPlaceDetails(APP_STATE.currentPlace);
  }

  if (document.querySelector(".place-summary") && APP_STATE.currentPlace) {
    displayPlaceSummary(APP_STATE.currentPlace);
  }

  if (document.getElementById("review-summary-card")) {
    renderReviewSummaryCard(APP_STATE.currentReviewSummary || null);
  }

  if (document.getElementById("reviews") && APP_STATE.currentReviews) {
    displayPlaceReviews(APP_STATE.currentReviews);
  }

  if (document.getElementById("add-review") && placeId) {
    renderAddReviewAccess(token, placeId);
  }

  updatePlaceImageLightbox();
}

function applyLanguage(language, persist = true) {
  const resolvedLanguage = language === "fr" ? "fr" : "en";

  document.documentElement.lang = resolvedLanguage;
  document.documentElement.dataset.language = resolvedLanguage;
  syncLanguageToggleState(resolvedLanguage);

  if (persist) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
    } catch (error) {
      console.error("Unable to save language preference:", error);
    }
  }

  refreshLocalizedContent();
}

function initializeLanguageToggle() {
  applyLanguage(getPreferredLanguage(), false);

  for (const toggle of document.querySelectorAll(".language-toggle-input")) {
    toggle.addEventListener("change", (event) => {
      const nextLanguage = event.currentTarget.checked ? "fr" : "en";
      applyLanguage(nextLanguage);
    });
  }
}

function renderStateCard(title, text, compact = false) {
  return `
    <div class="ui-state${compact ? " ui-state--compact" : ""}">
      <h3 class="ui-state-title">${title}</h3>
      <p class="ui-state-text">${text}</p>
    </div>
  `;
}

function checkAuthentication() {
  const token = getAuthToken();
  const loginLink = document.getElementById("login-link");

  if (loginLink) {
    loginLink.style.display = "";

    if (token) {
      loginLink.textContent = t("common.nav.logout");
      loginLink.href = "#";
      loginLink.removeAttribute("aria-current");
      loginLink.onclick = (event) => {
        event.preventDefault();
        clearCookie(TOKEN_COOKIE_NAME);
        window.location.href = "index.html";
      };
    } else {
      loginLink.textContent = t("common.nav.login");
      loginLink.href = "login.html";
      loginLink.onclick = null;
    }
  }

  return token;
}

async function fetchPlaces(token) {
  const placesList = document.getElementById("places-list");

  if (!placesList) {
    return;
  }

  try {
    const placesResponse = await fetch(`${API_BASE_URL}/places/`, {
      headers: buildAuthHeaders(token),
    });

    if (!placesResponse.ok) {
      throw new Error("Failed to fetch places");
    }

    const places = await parseJsonSafely(placesResponse);
    const safePlaces = Array.isArray(places) ? places : [];
    let reviewSummaryMap = new Map();

    try {
      reviewSummaryMap = await fetchPlaceReviewSummaries(token);
    } catch (error) {
      console.error("Error fetching place review summaries:", error);
    }

    APP_STATE.places = safePlaces;
    APP_STATE.reviewSummaryMap = reviewSummaryMap;
    displayPlaces(safePlaces, reviewSummaryMap);
  } catch (error) {
    placesList.innerHTML = renderStateCard(
      t("dynamic.noStaysTitle"),
      t("dynamic.noStaysText"),
    );
    throw error;
  }
}

async function fetchPlaceDetails(token, placeId) {
  if (!placeId) {
    throw new Error("Place ID not found in URL");
  }

  const placeDetailsResponse = await fetch(
    `${API_BASE_URL}/places/${placeId}`,
    {
      headers: buildAuthHeaders(token),
    },
  );

  if (!placeDetailsResponse.ok) {
    throw new Error("Failed to fetch place details");
  }

  const place = await parseJsonSafely(placeDetailsResponse);
  APP_STATE.currentPlace = place;
  displayPlaceDetails(place);
  displayPlaceSummary(place);

  try {
    const reviews = await fetchPlaceReviews(token, placeId);
    const reviewSummary = getReviewSummary(reviews);
    APP_STATE.currentReviewSummary = reviewSummary;
    renderReviewSummaryCard(reviewSummary);
  } catch (error) {
    console.error("Error fetching place reviews:", error);
  }
}

async function fetchPlaceReviews(token, placeId) {
  const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch place reviews");
  }

  const reviews = await parseJsonSafely(response);
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  APP_STATE.currentReviews = safeReviews;
  displayPlaceReviews(safeReviews);
  return safeReviews;
}

function displayPlaces(places, reviewSummaryMap = new Map()) {
  const placesList = document.getElementById("places-list");

  if (!placesList) {
    return;
  }

  placesList.innerHTML = "";

  if (!places || places.length === 0) {
    placesList.innerHTML = renderStateCard(
      t("dynamic.noStaysTitle"),
      t("dynamic.noStaysText"),
    );
    setupRevealAnimations();
    return;
  }

  for (const [index, place] of places.entries()) {
    const placeCard = document.createElement("article");
    placeCard.classList.add("place-card");
    placeCard.style.setProperty("--card-index", index);

    const title = escapeHtml(
      place.title || place.name || t("dynamic.selectedStay"),
    );
    const price = Number(place.price) || 0;
    placeCard.dataset.price = String(price);

    const placeUrl = `place.html?id=${place.id}`;

    const firstImage =
      place.images && place.images.length > 0
        ? `<img src="${place.images[0]}" alt="${title}" class="place-card-image" loading="lazy">`
        : `<div class="place-card-placeholder">${t("dynamic.imageComingSoon")}</div>`;

    const shortDescription = place.description
      ? escapeHtml(place.description.slice(0, 105)) +
        (place.description.length > 105 ? "..." : "")
      : t("dynamic.defaultDescription");

    const reviewSummary = reviewSummaryMap.get(place.id) || null;
    const ratingBadge = renderPlaceCardRatingBadge(reviewSummary);

    placeCard.innerHTML = `
      <a
        href="${placeUrl}"
        class="place-card-media-link"
        aria-label="${t("dynamic.viewDetails")} ${title}"
      >
        <div class="place-card-media">
          ${firstImage}
          ${ratingBadge}
          <span class="place-card-price">${formatPriceInline(price)}</span>
        </div>
      </a>

      <div class="place-card-body">
        <h2 class="place-card-title">${title}</h2>
        <p class="place-card-text">${shortDescription}</p>
      </div>

      <div class="place-card-footer">
        <a href="${placeUrl}" class="details-button">${t("dynamic.viewDetails")}</a>
      </div>
    `;

    placesList.appendChild(placeCard);
  }

  setupRevealAnimations();
}

function renderPlaceCardRatingBadge(reviewSummary) {
  if (!reviewSummary) {
    return "";
  }

  const countLabel =
    reviewSummary.countLabel || formatCountLabel("review", reviewSummary.count);
  const ariaLabel =
    getCurrentLanguage() === "fr"
      ? `Noté ${reviewSummary.averageLabel} sur 5 à partir de ${countLabel}`
      : `Rated ${reviewSummary.averageLabel} out of 5 from ${countLabel}`;

  return `
    <span
      class="place-card-rating"
      aria-label="${ariaLabel}"
      title="${countLabel}"
    >
      <span class="place-card-rating-star" aria-hidden="true">★</span>
      <span class="place-card-rating-value">${reviewSummary.averageLabel}</span>
    </span>
  `;
}

function displayPlaceDetails(place) {
  const placeDetailsSection = document.getElementById("place-details");

  if (!placeDetailsSection) {
    return;
  }

  const title = escapeHtml(
    place.title || place.name || t("dynamic.selectedStay"),
  );
  const price = Number(place.price) || 0;
  const description = escapeHtml(
    place.description || t("dynamic.refinedStayDescription"),
  );

  const images =
    place.images && place.images.length > 0 ? place.images : [null];

  const galleryMarkup = images
    .slice(0, 3)
    .map((imageUrl, index) => {
      if (!imageUrl) {
        return `<div class="place-gallery-placeholder">${
          index === 0
            ? t("dynamic.imageComingSoon")
            : t("dynamic.moreVisualsComingSoon")
        }</div>`;
      }

      return `
      <button
        type="button"
        class="place-gallery-trigger"
        data-image-src="${escapeHtml(imageUrl)}"
        data-image-alt="${title}"
        aria-label="${
          getCurrentLanguage() === "fr"
            ? `Ouvrir l'image ${index + 1} de ${title}`
            : `Open image ${index + 1} of ${title}`
        }"
      >
        <img
          src="${imageUrl}"
          alt="${title}"
          class="place-gallery-image"
          loading="lazy"
        >
      </button>
    `;
    })
    .join("");

  placeDetailsSection.innerHTML = `
    <div class="place-heading">
      <div class="place-heading-top">
        <div class="place-heading-copy">
          <p class="section-kicker">${t("dynamic.selectedStay")}</p>
          <h1>${title}</h1>
          <p class="place-lead">${description}</p>
        </div>

        <div class="place-heading-side">
          <span class="place-price-badge">${formatPriceInline(price)}</span>
        </div>
      </div>
    </div>

    <div class="place-gallery">
      ${galleryMarkup}
    </div>

    <div class="place-info-grid"></div>
    <div class="place-amenities-mount"></div>
  `;

  const infoGrid = placeDetailsSection.querySelector(".place-info-grid");
  const amenitiesMount = placeDetailsSection.querySelector(
    ".place-amenities-mount",
  );

  infoGrid.appendChild(
    createPlaceInfoBlock(t("dynamic.descriptionTitle"), description),
  );
  amenitiesMount.appendChild(createAmenitiesPanel(place.amenities));

  renderHostCard(place);
  renderReviewSummaryCard(APP_STATE.currentReviewSummary || null);
  setupRevealAnimations();
  updateHeaderPlaceContext(place);
}

function createPlaceInfoBlock(titleText, contentText) {
  const container = document.createElement("article");
  container.classList.add("place-info");

  const title = document.createElement("h2");
  title.textContent = titleText;

  const content = document.createElement("p");
  content.textContent = contentText;

  container.appendChild(title);
  container.appendChild(content);

  return container;
}

function createAmenitiesPanel(amenities) {
  const panel = document.createElement("section");
  panel.classList.add("place-amenities-panel");

  const title = document.createElement("h2");
  title.textContent = t("dynamic.amenitiesTitle");

  const grid = document.createElement("div");
  grid.classList.add("amenities-grid");

  if (amenities && amenities.length > 0) {
    for (const amenity of amenities) {
      const amenityLabel = amenity.name || amenity;

      const card = document.createElement("article");
      card.classList.add("amenity-card");

      const icon = document.createElement("div");
      icon.classList.add("amenity-icon");
      icon.innerHTML = getAmenityIconMarkup(amenityLabel);

      const label = document.createElement("p");
      label.classList.add("amenity-label");
      label.textContent = amenityLabel;

      card.appendChild(icon);
      card.appendChild(label);
      grid.appendChild(card);
    }
  } else {
    const emptyState = document.createElement("p");
    emptyState.classList.add("amenities-empty");
    emptyState.textContent = t("dynamic.noAmenities");
    grid.appendChild(emptyState);
  }

  panel.appendChild(title);
  panel.appendChild(grid);

  return panel;
}

function getHostName(place) {
  if (place.owner && place.owner.first_name && place.owner.last_name) {
    return `${place.owner.first_name} ${place.owner.last_name}`;
  }

  if (place.owner && place.owner.first_name) {
    return place.owner.first_name;
  }

  return t("dynamic.unknownHost");
}

function getHostInitials(place) {
  const hostName = getHostName(place);

  if (!hostName || hostName === t("dynamic.unknownHost")) {
    return "HG";
  }

  const parts = hostName
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function renderHostCard(place) {
  const hostCard = document.getElementById("host-card");

  if (!hostCard) {
    return;
  }

  const hostName = escapeHtml(getHostName(place));
  const initials = escapeHtml(getHostInitials(place));
  const hostImage = getHostImage(place);

  const hostMedia = hostImage
    ? `<img src="${hostImage}" alt="${hostName}" class="host-card-image" loading="lazy">`
    : `<div class="host-card-avatar" aria-hidden="true">${initials}</div>`;

  hostCard.innerHTML = `
    <p class="section-kicker">${t("dynamic.hostSpotlight")}</p>

    <div class="host-card-media">
      ${hostMedia}
    </div>

    <div class="host-card-body">
      <h2>${t("dynamic.meetHost")}</h2>
      <p class="host-card-name">${hostName}</p>
      <p class="host-card-role">${t("dynamic.localHost")}</p>
      <p class="host-card-text">
        ${t("dynamic.hostText")}
      </p>
      <div class="host-card-tags">
        <span>${t("dynamic.guestFocused")}</span>
        <span>${t("dynamic.carefullyPrepared")}</span>
      </div>
    </div>
  `;
}

function renderReviewSummaryCard(reviewSummary = null) {
  const reviewSummaryCard = document.getElementById("review-summary-card");

  if (!reviewSummaryCard) {
    return;
  }

  if (!reviewSummary) {
    reviewSummaryCard.innerHTML = `
      <p class="section-kicker">${t("dynamic.guestRating")}</p>
      <div class="review-summary-empty">
        ${t("dynamic.reviewsAppearSoon")}
      </div>
    `;
    return;
  }

  const ariaLabel =
    getCurrentLanguage() === "fr"
      ? `${reviewSummary.averageLabel} sur 5 à partir de ${reviewSummary.countLabel}`
      : `${reviewSummary.averageLabel} out of 5 from ${reviewSummary.countLabel}`;

  reviewSummaryCard.innerHTML = `
    <p class="section-kicker">${t("dynamic.guestRating")}</p>

    <div
      class="review-summary-box"
      aria-label="${ariaLabel}"
    >
      <div class="review-summary-top">
        <span class="review-summary-value">${reviewSummary.averageLabel}</span>
        <span class="review-summary-scale">/ 5</span>
      </div>

      <div class="review-summary-stars">
        ${renderStarRating(reviewSummary.average)}
      </div>

      <p class="review-summary-count">${reviewSummary.countLabel}</p>
    </div>
  `;
}

function getReviewAuthorName(review) {
  if (review.user && typeof review.user === "object") {
    const firstName = review.user.first_name || "";
    const lastName = review.user.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return fullName;
    }
  }

  if (typeof review.user === "string" && review.user.trim()) {
    return review.user;
  }

  return t("dynamic.anonymousGuest");
}

function getReviewSummary(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return null;
  }

  const ratings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

  if (ratings.length === 0) {
    return null;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  const average = total / ratings.length;
  const count = ratings.length;

  return {
    average,
    averageLabel: average.toFixed(1),
    count,
    countLabel: formatCountLabel("review", count),
  };
}

function displayPlaceReviews(reviews) {
  const reviewsSection = document.getElementById("reviews");

  if (!reviewsSection) {
    return;
  }

  reviewsSection.innerHTML = `
    <div class="reviews-section-header">
      <p class="section-kicker">${t("dynamic.guestFeedback")}</p>
      <h2>${t("dynamic.reviewsTitle")}</h2>
    </div>
  `;

  if (!reviews || reviews.length === 0) {
    const noReviews = document.createElement("p");
    noReviews.classList.add("review-empty");
    noReviews.textContent = t("dynamic.noReviews");
    reviewsSection.appendChild(noReviews);
    return;
  }

  const reviewsList = document.createElement("div");
  reviewsList.classList.add("reviews-list");

  for (const review of reviews) {
    const reviewCard = document.createElement("article");
    reviewCard.classList.add("review-card");

    const authorName = getReviewAuthorName(review);
    const rating = Number(review.rating) || 0;
    const starsMarkup = renderStarRating(rating);
    const ariaLabel =
      getCurrentLanguage() === "fr" ? `${rating} sur 5` : `${rating} out of 5`;

    reviewCard.innerHTML = `
      <div class="review-card-header">
        <h3>${authorName}</h3>
        <div class="review-rating" aria-label="${ariaLabel}">
          <div class="review-rating-stars">
            ${starsMarkup}
          </div>
          <span class="review-rating-value">${rating}/5</span>
        </div>
      </div>
      <p class="review-comment">${review.text || t("dynamic.noComment")}</p>
    `;

    reviewsList.appendChild(reviewCard);
  }

  reviewsSection.appendChild(reviewsList);
  setupRevealAnimations();
}

function displayPlaceSummary(place) {
  const placeSummarySection = document.querySelector(".place-summary");

  if (!placeSummarySection) {
    return;
  }

  const title = escapeHtml(
    place.title || place.name || t("dynamic.selectedStay"),
  );
  const price = Number(place.price) || 0;

  placeSummarySection.innerHTML = `
    <p class="section-kicker">${t("dynamic.selectedStay")}</p>
    <h2>${t("dynamic.placeSummaryTitle")}</h2>
    <p><strong>${t("dynamic.labelName")}</strong> ${title}</p>
    <p><strong>${t("dynamic.labelHost")}</strong> ${escapeHtml(getHostName(place))}</p>
    <p><strong>${t("dynamic.labelPrice")}</strong> ${formatPriceInline(price)}</p>
  `;
}

function renderHostPreviewCard(host) {
  const hostName = escapeHtml(host.name);
  const leadPlaceTitle = escapeHtml(host.leadPlaceTitle);
  const listingLabel = formatCountLabel("stay", host.listingCount);
  const reviewLabel = formatCountLabel("review", host.reviewCount);
  const ratingLabel = host.reviewSummary
    ? `★ ${host.reviewSummary.averageLabel}`
    : t("dynamic.new");

  return `
    <article class="host-preview-card">
      <div class="host-preview-photo">
        ${renderHostPreviewMedia(host)}
      </div>

      <div class="host-preview-body">
        <div class="host-preview-top">
          <h3>${hostName}</h3>
          <span class="host-preview-rating">${ratingLabel}</span>
        </div>

        <p class="host-preview-location">${leadPlaceTitle}</p>

        <div class="host-preview-stats">
          <span>${listingLabel}</span>
          <span>${reviewLabel}</span>
        </div>
      </div>
    </article>
  `;
}

function displayHostsDirectory(hosts) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  if (!Array.isArray(hosts) || hosts.length === 0) {
    hostsList.innerHTML = renderStateCard(
      t("dynamic.noHostsAvailableTitle"),
      t("dynamic.noHostsAvailableText"),
    );
    setupRevealAnimations();
    return;
  }

  hostsList.innerHTML = hosts
    .map((host) => renderHostPreviewCard(host))
    .join("");
  setupRevealAnimations();
}

async function fetchHostsDirectory(token) {
  const hostsList = document.getElementById("hosts-list");

  if (!hostsList) {
    return;
  }

  try {
    const [placesResponse, reviewsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/places/`, {
        headers: buildAuthHeaders(token),
      }),
      fetch(`${API_BASE_URL}/reviews/`, {
        headers: buildAuthHeaders(token),
      }),
    ]);

    if (!placesResponse.ok || !reviewsResponse.ok) {
      throw new Error("Failed to fetch hosts directory data");
    }

    const [places, reviews] = await Promise.all([
      parseJsonSafely(placesResponse),
      parseJsonSafely(reviewsResponse),
    ]);

    const hosts = buildHostsDirectory(
      Array.isArray(places) ? places : [],
      Array.isArray(reviews) ? reviews : [],
    );

    APP_STATE.hosts = hosts;
    displayHostsDirectory(hosts);
  } catch (error) {
    hostsList.innerHTML = renderStateCard(
      t("dynamic.unableToLoadHostsTitle"),
      t("dynamic.unableToLoadHostsText"),
    );

    throw error;
  }
}

function populatePriceFilter() {
  const priceFilter = document.getElementById("price-filter");

  if (!priceFilter) {
    return;
  }

  const selectedValue = priceFilter.value || "All";
  priceFilter.innerHTML = "";

  const prices = [
    { label: t("dynamic.allPrices"), value: "All" },
    { label: formatUpToPrice(50), value: "50" },
    { label: formatUpToPrice(100), value: "100" },
    { label: formatUpToPrice(200), value: "200" },
  ];

  for (const price of prices) {
    const option = document.createElement("option");
    option.textContent = price.label;
    option.value = price.value;
    option.selected = selectedValue === price.value;
    priceFilter.appendChild(option);
  }
}

function renderAddReviewAccess(token, placeId) {
  const addReviewSection = document.getElementById("add-review");

  if (!addReviewSection) {
    return;
  }

  if (!token) {
    addReviewSection.innerHTML = `
      <p class="section-kicker">${t("place.addreview.kicker")}</p>
      <h2>${t("place.addreview.title")}</h2>
      <p class="add-review-text">
        ${t("dynamic.addReviewLoginText")}
      </p>
      <a href="login.html" class="details-button">${t("dynamic.addReviewLoginCta")}</a>
      <p class="add-review-note">
        ${t("dynamic.addReviewLoginNote")}
      </p>
    `;
    return;
  }

  addReviewSection.innerHTML = `
    <p class="section-kicker">${t("place.addreview.kicker")}</p>
    <h2>${t("place.addreview.title")}</h2>
    <p class="add-review-text">
      ${t("dynamic.addReviewAuthText")}
    </p>
    <a href="add_review.html?id=${placeId}" class="details-button">${t("dynamic.addReviewAuthCta")}</a>
    <p class="add-review-note">
      ${t("dynamic.addReviewAuthNote")}
    </p>
  `;
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const loginForm = event.currentTarget;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("login-message");
  const submitButton = loginForm.querySelector('button[type="submit"]');

  resetFormMessage(loginMessage);

  if (!email || !password) {
    setFormMessage(loginMessage, t("dynamic.loginMissingFields"), "error");
    return;
  }

  setButtonLoading(submitButton, true, t("dynamic.signingIn"));
  setFormMessage(loginMessage, t("dynamic.checkingCredentials"), "loading");

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonSafely(response);

    if (response.ok && data.access_token) {
      document.cookie = `${TOKEN_COOKIE_NAME}=${data.access_token}; path=/`;
      setButtonLoading(submitButton, false);
      setFormMessage(loginMessage, t("dynamic.loginSuccess"), "success");

      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 450);

      return;
    }

    setButtonLoading(submitButton, false);
    setFormMessage(
      loginMessage,
      data.error || t("dynamic.invalidCredentials"),
      "error",
    );
  } catch (error) {
    setButtonLoading(submitButton, false);
    setFormMessage(loginMessage, t("dynamic.loginError"), "error");
  }
}

async function handleReviewSubmit(event, token, placeId, reviewForm) {
  event.preventDefault();

  const reviewText = document.getElementById("review").value.trim();
  const rating = document.getElementById("rating").value;
  const numericRating = Number(rating);
  const reviewMessage = document.getElementById("review-message");
  const submitButton = reviewForm.querySelector('button[type="submit"]');

  resetFormMessage(reviewMessage);

  if (!reviewText) {
    setFormMessage(reviewMessage, t("dynamic.reviewEmpty"), "error");
    return;
  }

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    setFormMessage(reviewMessage, t("dynamic.reviewInvalidRating"), "error");
    return;
  }

  if (!placeId) {
    setFormMessage(reviewMessage, t("dynamic.placeIdMissing"), "error");
    return;
  }

  const reviewData = {
    text: reviewText,
    rating: numericRating,
    place_id: placeId,
  };

  setButtonLoading(submitButton, true, t("dynamic.submitting"));
  setFormMessage(reviewMessage, t("dynamic.submittingReview"), "loading");

  try {
    const response = await fetch(`${API_BASE_URL}/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await parseJsonSafely(response);

    setButtonLoading(submitButton, false);

    if (response.ok) {
      reviewForm.reset();
      setFormMessage(reviewMessage, t("dynamic.reviewSuccess"), "success");
      return;
    }

    setFormMessage(
      reviewMessage,
      data.error || t("dynamic.reviewFailed"),
      "error",
    );
  } catch (error) {
    setButtonLoading(submitButton, false);
    setFormMessage(reviewMessage, t("dynamic.reviewError"), "error");
  }
}

function ensurePlaceImageLightbox() {
  let lightbox = document.getElementById("place-image-lightbox");

  if (lightbox) {
    return lightbox;
  }

  lightbox = document.createElement("div");
  lightbox.id = "place-image-lightbox";
  lightbox.className = "place-image-lightbox";
  lightbox.setAttribute("aria-hidden", "true");

  lightbox.innerHTML = `
    <div class="place-image-lightbox-backdrop" data-lightbox-close="true"></div>

    <div
      class="place-image-lightbox-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="${t("dynamic.lightboxDialog")}"
    >
      <button
        type="button"
        class="place-image-lightbox-nav place-image-lightbox-nav--prev"
        aria-label="${t("dynamic.lightboxPrev")}"
        data-lightbox-prev="true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18L9 12L15 6" />
        </svg>
      </button>

      <div class="place-image-lightbox-figure">
        <button
          type="button"
          class="place-image-lightbox-close"
          aria-label="${t("dynamic.lightboxClose")}"
          data-lightbox-close="true"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6L18 18" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        <img
          src=""
          alt=""
          class="place-image-lightbox-image"
        >

        <p class="place-image-lightbox-counter" aria-live="polite"></p>
      </div>

      <button
        type="button"
        class="place-image-lightbox-nav place-image-lightbox-nav--next"
        aria-label="${t("dynamic.lightboxNext")}"
        data-lightbox-next="true"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18L15 12L9 6" />
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(lightbox);
  return lightbox;
}

function updateHeaderPlaceContext(place) {
  const target = document.getElementById("header-place-context");

  if (!target || !place) {
    return;
  }

  const title = place.title || place.name || "";
  const match = title.match(/\bin\s+(.+)$/i);
  const location =
    place.city || place.location || (match ? match[1] : "Brittany");

  target.textContent = `${location} · ${t("dynamic.refinedStayContext")}`;
}

function updatePlaceImageLightbox() {
  const lightbox = ensurePlaceImageLightbox();
  const image = lightbox.querySelector(".place-image-lightbox-image");
  const counter = lightbox.querySelector(".place-image-lightbox-counter");
  const dialog = lightbox.querySelector(".place-image-lightbox-dialog");
  const previousButton = lightbox.querySelector("[data-lightbox-prev='true']");
  const nextButton = lightbox.querySelector("[data-lightbox-next='true']");
  const closeButton = lightbox.querySelector("[data-lightbox-close='true']");

  const { images, currentIndex } = placeGalleryLightboxState;

  if (!images.length || !images[currentIndex]) {
    return;
  }

  const currentImage = images[currentIndex];

  if (dialog) {
    dialog.setAttribute("aria-label", t("dynamic.lightboxDialog"));
  }

  if (previousButton) {
    previousButton.setAttribute("aria-label", t("dynamic.lightboxPrev"));
  }

  if (nextButton) {
    nextButton.setAttribute("aria-label", t("dynamic.lightboxNext"));
  }

  if (closeButton) {
    closeButton.setAttribute("aria-label", t("dynamic.lightboxClose"));
  }

  image.src = currentImage.src;
  image.alt = currentImage.alt || t("dynamic.expandedImageAlt");
  counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

initializeLanguageToggle();
