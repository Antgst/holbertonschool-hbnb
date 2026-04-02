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
    displayPlaces(Array.isArray(places) ? places : []);
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
    await fetchPlaceReviews(token, placeId);
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
    displayPlaceReviews(Array.isArray(reviews) ? reviews : []);
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

function displayPlaces(places) {
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

    placeCard.innerHTML = `
      <div class="place-card-media">
        ${firstImage}
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

function displayPlaceDetails(place) {
  const placeDetailsSection = document.getElementById("place-details");

  if (!placeDetailsSection) {
    return;
  }

  const title = escapeHtml(place.title || place.name || "Selected stay");
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
      <p class="section-kicker">Selected stay</p>
      <h1>${title}</h1>
      <p class="place-lead">${description}</p>
    </div>

    <div class="place-gallery">
      ${galleryMarkup}
    </div>

    <div class="place-info-grid"></div>
  `;

  const infoGrid = placeDetailsSection.querySelector(".place-info-grid");

  infoGrid.appendChild(createPlaceInfoBlock("Description", description));
  infoGrid.appendChild(createAmenitiesBlock(place.amenities));

  renderHostCard(place);
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

function createAmenitiesBlock(amenities) {
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
}

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
  const price = Number(place.price) || 0;

  const amenitiesCount =
    place.amenities && place.amenities.length > 0
      ? `${place.amenities.length} amenit${place.amenities.length > 1 ? "ies" : "y"}`
      : "Well-prepared stay";

  const locationLabel = escapeHtml(
    place.title || place.name || "Selected stay",
  );

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

      <div class="host-card-tags">
        <span>€${price} / night</span>
        <span>${amenitiesCount}</span>
        <span>${locationLabel}</span>
      </div>
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

    const authorName = escapeHtml(getReviewAuthorName(review));
    const rating = Number(review.rating) || 0;

    reviewCard.innerHTML = `
      <div class="review-card-header">
        <h3>${authorName}</h3>
        <span class="review-rating">${rating}/5</span>
      </div>
      <p class="review-comment">${escapeHtml(review.text || "No comment provided.")}</p>
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
