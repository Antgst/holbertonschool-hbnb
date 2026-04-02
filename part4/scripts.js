const API_BASE_URL = "http://127.0.0.1:5000/api/v1";
const TOKEN_COOKIE_NAME = "token";

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
    loginLink.style.display = token ? "none" : "";
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
      <div class="place-card-media">
        ${firstImage}
        ${ratingBadge}
        <span class="place-card-price">€${price} / night</span>
      </div>

      <div class="place-card-body">
        <h2 class="place-card-title">${title}</h2>
        <p class="place-card-text">${shortDescription}</p>
      </div>

      <div class="place-card-footer">
        <a href="place.html?id=${place.id}" class="details-button">View details</a>
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

      return `<img src="${imageUrl}" alt="${title}" class="place-gallery-image" loading="lazy">`;
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

document.addEventListener("DOMContentLoaded", () => {
  populatePriceFilter();
  setupPriceFilter();

  const token = checkAuthentication();
  setupRevealAnimations();
  const placeId = getPlaceIdFromURL();

  const placesList = document.getElementById("places-list");
  const placeDetailsSection = document.getElementById("place-details");
  const placeSummarySection = document.querySelector(".place-summary");
  const loginForm = document.getElementById("login-form");
  const reviewForm = document.getElementById("review-form");

  if (placesList) {
    fetchPlaces(token).catch((error) => {
      console.error("Error fetching places:", error);
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
