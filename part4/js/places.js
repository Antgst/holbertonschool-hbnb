/* Place listing, place details, gallery behavior, and price filtering. */

function getAmenityIconMarkup(amenityName) {
  // Picks an inline SVG icon matching the amenity name when possible.
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

function setupPriceFilter() {
  // Filters visible place cards whenever the selected max price changes.
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

let placeGalleryLightboxState = {
  images: [],
  currentIndex: 0,
};

function openPlaceImageLightbox(images, startIndex = 0) {
  // Opens the place gallery lightbox at the requested image index.
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
  // Closes the gallery lightbox and restores the page scroll state.
  const lightbox = document.getElementById("place-image-lightbox");

  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-lightbox-open");
}

function showPreviousPlaceImage() {
  // Moves the lightbox selection to the previous gallery image.
  const { images, currentIndex } = placeGalleryLightboxState;

  if (!images.length) {
    return;
  }

  placeGalleryLightboxState.currentIndex =
    (currentIndex - 1 + images.length) % images.length;

  updatePlaceImageLightbox();
}

function showNextPlaceImage() {
  // Moves the lightbox selection to the next gallery image.
  const { images, currentIndex } = placeGalleryLightboxState;

  if (!images.length) {
    return;
  }

  placeGalleryLightboxState.currentIndex = (currentIndex + 1) % images.length;

  updatePlaceImageLightbox();
}

function getPlaceGalleryImages(trigger) {
  // Collects every image referenced by the current place gallery.
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
  // Connects gallery clicks and keyboard shortcuts to the lightbox behavior.
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

async function fetchPlaces(token) {
  // Loads the place catalog and stores it in the shared client state.
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
  // Loads the selected place and then updates its review-related sections.
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
    await fetchPlaceReviews(token, placeId);
  } catch (error) {
    console.error("Error fetching place reviews:", error);
  }
}

function displayPlaces(places, reviewSummaryMap = new Map()) {
  // Renders every place card visible on the catalog page.
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
      translatePlaceTitle(
        place.title || place.name || t("dynamic.selectedStay"),
      ),
    );
    const price = Number(place.price) || 0;
    placeCard.dataset.price = String(price);

    const placeUrl = `place.html?id=${place.id}`;

    const firstImage =
      place.images && place.images.length > 0
        ? `<img src="${place.images[0]}" alt="${title}" class="place-card-image" loading="lazy">`
        : `<div class="place-card-placeholder">${t("dynamic.imageComingSoon")}</div>`;

    const shortDescription = place.description
      ? escapeHtml(translatePlaceDescription(place.description).slice(0, 105)) +
        (translatePlaceDescription(place.description).length > 105 ? "..." : "")
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
  // Creates the compact rating badge displayed on each place card.
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
  // Renders the detailed page layout for the currently selected place.
  const placeDetailsSection = document.getElementById("place-details");

  if (!placeDetailsSection) {
    return;
  }

  const title = escapeHtml(
    translatePlaceTitle(place.title || place.name || t("dynamic.selectedStay")),
  );
  const price = Number(place.price) || 0;
  const description = escapeHtml(
    translatePlaceDescription(
      place.description || t("dynamic.refinedStayDescription"),
    ),
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
  // Builds one informational block inside the place detail grid.
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
  // Renders the amenity cards shown in the place details page.
  const panel = document.createElement("section");
  panel.classList.add("place-amenities-panel");

  const title = document.createElement("h2");
  title.textContent = t("dynamic.amenitiesTitle");

  const grid = document.createElement("div");
  grid.classList.add("amenities-grid");

  if (amenities && amenities.length > 0) {
    for (const amenity of amenities) {
      const amenityLabel = translateAmenityName(amenity.name || amenity);

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

function populatePriceFilter() {
  // Rebuilds the price filter options with localized labels.
  const priceFilter = document.getElementById("price-filter");

  if (!priceFilter) {
    return;
  }

  const selectedValue = priceFilter.value || "All";
  priceFilter.innerHTML = "";

  const prices = [
    { label: formatUpToPrice(10), value: "10" },
    { label: formatUpToPrice(50), value: "50" },
    { label: formatUpToPrice(100), value: "100" },
    { label: t("dynamic.allPrices"), value: "All" },
  ];

  for (const price of prices) {
    const option = document.createElement("option");
    option.textContent = price.label;
    option.value = price.value;
    option.selected = selectedValue === price.value;
    priceFilter.appendChild(option);
  }
}

function ensurePlaceImageLightbox() {
  // Lazily creates the lightbox container used by the place gallery.
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
  // Refreshes the header context based on the selected place location.
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
  // Syncs the lightbox UI with the currently selected gallery image.
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
