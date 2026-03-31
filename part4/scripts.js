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

function checkAuthentication() {
  const token = getAuthToken();
  const loginLink = document.getElementById("login-link");

  if (loginLink) {
    loginLink.style.display = token ? "none" : "block";
  }

  return token;
}

function requireAuthentication() {
  const token = getAuthToken();

  if (!token) {
    window.location.href = "index.html";
    return null;
  }

  return token;
}

async function fetchPlaces(token) {
  const response = await fetch(`${API_BASE_URL}/places/`, {
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch places");
  }

  const places = await response.json();
  displayPlaces(places);
}

async function fetchPlaceDetails(token, placeId) {
  if (!placeId) {
    throw new Error("Place ID not found in URL");
  }

  const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch place details");
  }

  const place = await response.json();

  displayPlaceDetails(place);
  await fetchPlaceReviews(token, placeId);
  displayPlaceSummary(place);
}

async function fetchPlaceReviews(token, placeId) {
  const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch place reviews");
  }

  const reviews = await response.json();
  displayPlaceReviews(reviews);
}

function displayPlaces(places) {
  const placesList = document.getElementById("places-list");

  if (!placesList) {
    return;
  }

  placesList.innerHTML = "";

  for (const place of places) {
    const placeCard = document.createElement("div");
    placeCard.classList.add("place-card");
    placeCard.dataset.price = place.price;

    const firstImage =
      place.images && place.images.length > 0
        ? `<img src="${place.images[0]}" alt="${place.title}" class="place-card-image">`
        : `<div class="place-card-placeholder">No image available</div>`;

    const shortDescription = place.description
      ? place.description.slice(0, 90) +
        (place.description.length > 90 ? "..." : "")
      : "Elegant stay, premium comfort, and carefully selected amenities.";

    placeCard.innerHTML = `
  <div class="place-card-media">
    ${firstImage}
    <span class="place-card-price">€${place.price} / night</span>
  </div>

  <div class="place-card-body">
    <h2>${place.title}</h2>
    <p class="place-card-text">
      ${shortDescription}
    </p>
  </div>

  <div class="place-card-footer">
    <a href="place.html?id=${place.id}" class="details-button">View details</a>
  </div>
`;

    placesList.appendChild(placeCard);
  }
}

function displayPlaceDetails(place) {
  const placeDetailsSection = document.getElementById("place-details");
  const reviewsSection = document.getElementById("reviews");

  if (!placeDetailsSection || !reviewsSection) {
    return;
  }

  placeDetailsSection.innerHTML = "";
  reviewsSection.innerHTML = "<h2>Reviews</h2>";

  const title = document.createElement("h1");
  title.textContent = place.title;

  const gallery = document.createElement("div");
  gallery.classList.add("place-gallery");

  if (place.images && place.images.length > 0) {
    for (const imageUrl of place.images) {
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = place.title;
      image.classList.add("place-gallery-image");
      gallery.appendChild(image);
    }
  }

  const hostInfo = createPlaceInfoBlock("Host", getHostName(place));
  const priceInfo = createPlaceInfoBlock("Price", `$${place.price} per night`);
  const descriptionInfo = createPlaceInfoBlock(
    "Description",
    place.description || "No description available.",
  );
  const amenitiesInfo = createAmenitiesBlock(place.amenities);

  placeDetailsSection.appendChild(title);
  placeDetailsSection.appendChild(gallery);
  placeDetailsSection.appendChild(hostInfo);
  placeDetailsSection.appendChild(priceInfo);
  placeDetailsSection.appendChild(descriptionInfo);
  placeDetailsSection.appendChild(amenitiesInfo);
}

function createPlaceInfoBlock(titleText, contentText) {
  const container = document.createElement("div");
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
  const container = document.createElement("div");
  container.classList.add("place-info");

  const title = document.createElement("h2");
  title.textContent = "Amenities";

  const list = document.createElement("ul");

  if (amenities && amenities.length > 0) {
    for (const amenity of amenities) {
      const item = document.createElement("li");
      item.textContent = amenity.name || amenity;
      list.appendChild(item);
    }
  } else {
    const item = document.createElement("li");
    item.textContent = "No amenities available.";
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

function displayPlaceReviews(reviews) {
  const reviewsSection = document.getElementById("reviews");

  if (!reviewsSection) {
    return;
  }

  reviewsSection.innerHTML = "<h2>Reviews</h2>";

  if (reviews.length === 0) {
    const noReviews = document.createElement("p");
    noReviews.textContent = "No reviews yet.";
    reviewsSection.appendChild(noReviews);
    return;
  }

  for (const review of reviews) {
    const reviewCard = document.createElement("article");
    reviewCard.classList.add("review-card");

    reviewCard.innerHTML = `
      <div class="review-card-header">
        <h3>${review.user || "Anonymous"}</h3>
        <span class="review-rating">${review.rating}/5</span>
      </div>
      <p class="review-comment">${review.text || "No comment."}</p>
    `;

    reviewsSection.appendChild(reviewCard);
  }
}

function displayPlaceSummary(place) {
  const placeSummarySection = document.querySelector(".place-summary");

  if (!placeSummarySection) {
    return;
  }

  placeSummarySection.innerHTML = `
    <h2>Place Summary</h2>
    <p><strong>Name:</strong> ${place.title}</p>
    <p><strong>Host:</strong> ${getHostName(place)}</p>
    <p><strong>Price:</strong> $${place.price} per night</p>
  `;
}

function populatePriceFilter() {
  const priceFilter = document.getElementById("price-filter");

  if (!priceFilter) {
    return;
  }

  const prices = ["All", "10", "50", "100"];

  for (const price of prices) {
    const option = document.createElement("option");
    option.textContent = price;
    option.value = price;
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
    addReviewSection.style.display = "none";
    return;
  }

  addReviewSection.style.display = "block";
  addReviewSection.innerHTML = `
    <h2>Add a Review</h2>
    <a href="add_review.html?id=${placeId}" class="details-button">Add Review</a>
  `;
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      document.cookie = `${TOKEN_COOKIE_NAME}=${data.access_token}; path=/`;
      window.location.href = "index.html";
      return;
    }

    alert(`Login failed: ${data.error || response.statusText}`);
  } catch (error) {
    alert("An error occurred while trying to log in.");
  }
}

async function handleReviewSubmit(event, token, placeId, reviewForm) {
  event.preventDefault();

  const reviewText = document.getElementById("review").value.trim();
  const rating = document.getElementById("rating").value;

  if (!reviewText) {
    alert("Review cannot be empty.");
    return;
  }

  if (!placeId) {
    alert("Place ID not found.");
    return;
  }

  const reviewData = {
    text: reviewText,
    rating: Number(rating),
    place_id: placeId,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/reviews/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Review submitted successfully!");
      reviewForm.reset();
      return;
    }

    alert(data.error || "Failed to submit review.");
  } catch (error) {
    alert("An error occurred while submitting the review.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populatePriceFilter();
  setupPriceFilter();

  const token = checkAuthentication();
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

    const reviewPlaceId = getPlaceIdFromURL();

    reviewForm.addEventListener("submit", (event) => {
      handleReviewSubmit(event, reviewToken, reviewPlaceId, reviewForm);
    });
  }
});
