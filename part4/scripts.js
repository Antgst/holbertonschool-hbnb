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

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function checkAuthentication() {
  const token = getCookie("token");
  const loginLink = document.getElementById("login-link");

  if (loginLink) {
    if (token) {
      loginLink.style.display = "none";
    } else {
      loginLink.style.display = "block";
    }
  }

  return token;
}

function requireAuthentication() {
  const token = getCookie("token");

  if (!token) {
    window.location.href = "index.html";
    return null;
  }

  return token;
}

async function fetchPlaces(token) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch("http://127.0.0.1:5000/api/v1/places/", {
    headers: headers,
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

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `http://127.0.0.1:5000/api/v1/places/${placeId}`,
    {
      headers: headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch place details");
  }

  const place = await response.json();
  displayPlaceDetails(place);
  await fetchPlaceReviews(token, placeId);
  displayPlaceSummary(place);
}

function displayPlaces(places) {
  const placesList = document.getElementById("places-list");
  placesList.innerHTML = "";

  for (const place of places) {
    const placeElement = document.createElement("div");
    placeElement.classList.add("place-card");
    placeElement.dataset.price = place.price;
    placeElement.innerHTML = `
      <h2>${place.title}</h2>
      <p>Price per night: $${place.price}</p>
      <a href="place.html?id=${place.id}" class="details-button">View details</a>
      `;

    placesList.appendChild(placeElement);
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

  const hostInfo = document.createElement("div");
  hostInfo.classList.add("place-info");

  const hostTitle = document.createElement("h2");
  hostTitle.textContent = "Host";

  const hostText = document.createElement("p");

  if (place.owner && place.owner.first_name && place.owner.last_name) {
    hostText.textContent = `${place.owner.first_name} ${place.owner.last_name}`;
  } else if (place.owner && place.owner.first_name) {
    hostText.textContent = place.owner.first_name;
  } else {
    hostText.textContent = "Unknown host";
  }

  hostInfo.appendChild(hostTitle);
  hostInfo.appendChild(hostText);

  const priceInfo = document.createElement("div");
  priceInfo.classList.add("place-info");

  const priceTitle = document.createElement("h2");
  priceTitle.textContent = "Price";

  const priceText = document.createElement("p");
  priceText.textContent = `$${place.price} per night`;

  priceInfo.appendChild(priceTitle);
  priceInfo.appendChild(priceText);

  const descriptionInfo = document.createElement("div");
  descriptionInfo.classList.add("place-info");

  const descriptionTitle = document.createElement("h2");
  descriptionTitle.textContent = "Description";

  const descriptionText = document.createElement("p");
  descriptionText.textContent =
    place.description || "No description available.";

  descriptionInfo.appendChild(descriptionTitle);
  descriptionInfo.appendChild(descriptionText);

  const amenitiesInfo = document.createElement("div");
  amenitiesInfo.classList.add("place-info");

  const amenitiesTitle = document.createElement("h2");
  amenitiesTitle.textContent = "Amenities";

  const amenitiesList = document.createElement("ul");

  if (place.amenities && place.amenities.length > 0) {
    for (const amenity of place.amenities) {
      const amenityItem = document.createElement("li");
      amenityItem.textContent = amenity.name || amenity;
      amenitiesList.appendChild(amenityItem);
    }
  } else {
    const amenityItem = document.createElement("li");
    amenityItem.textContent = "No amenities available.";
    amenitiesList.appendChild(amenityItem);
  }

  amenitiesInfo.appendChild(amenitiesTitle);
  amenitiesInfo.appendChild(amenitiesList);

  placeDetailsSection.appendChild(title);
  placeDetailsSection.appendChild(hostInfo);
  placeDetailsSection.appendChild(priceInfo);
  placeDetailsSection.appendChild(descriptionInfo);
  placeDetailsSection.appendChild(amenitiesInfo);
}

function displayPlaceSummary(place) {
  const placeSummarySection = document.querySelector(".place-summary");

  if (!placeSummarySection) {
    return;
  }

  let hostName = "Unknown host";

  if (place.owner && place.owner.first_name && place.owner.last_name) {
    hostName = `${place.owner.first_name} ${place.owner.last_name}`;
  } else if (place.owner && place.owner.first_name) {
    hostName = place.owner.first_name;
  }

  placeSummarySection.innerHTML = `
    <h2>Place Summary</h2>
    <p><strong>Name:</strong> ${place.title}</p>
    <p><strong>Host:</strong> ${hostName}</p>
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

      if (selectedPrice === "All" || placePrice <= Number(selectedPrice)) {
        placeCard.style.display = "block";
      } else {
        placeCard.style.display = "none";
      }
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

async function fetchPlaceReviews(token, placeId) {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `http://127.0.0.1:5000/api/v1/places/${placeId}/reviews`,
    {
      headers: headers,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch place reviews");
  }

  const reviews = await response.json();
  displayPlaceReviews(reviews);
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

    const reviewer = document.createElement("h3");
    reviewer.textContent = review.user || "Anonymous";

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${review.rating}/5`;

    const comment = document.createElement("p");
    comment.textContent = review.text || "No comment.";

    reviewCard.appendChild(reviewer);
    reviewCard.appendChild(rating);
    reviewCard.appendChild(comment);

    reviewsSection.appendChild(reviewCard);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populatePriceFilter();
  setupPriceFilter();

  const token = checkAuthentication();
  const placeId = getPlaceIdFromURL();
  const placesList = document.getElementById("places-list");
  const placeDetailsSection = document.getElementById("place-details");

  if (placesList) {
    fetchPlaces(token).catch((error) => {
      console.error("Error fetching places:", error);
    });
  }

  const placeSummarySection = document.querySelector(".place-summary");

  if (placeId && (placeDetailsSection || placeSummarySection)) {
    fetchPlaceDetails(token, placeId).catch((error) => {
      console.error("Error fetching place details:", error);
    });
  }

  if (placeId && placeDetailsSection) {
    renderAddReviewAccess(token, placeId);
  }

  const loginForm = document.getElementById("login-form");
  const reviewForm = document.getElementById("review-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          document.cookie = `token=${data.access_token}; path=/`;
          window.location.href = "index.html";
        } else {
          alert(`Login failed: ${data.error || response.statusText}`);
        }
      } catch (error) {
        alert("An error occurred while trying to log in.");
      }
    });
  }

  if (reviewForm && placeSummarySection) {
    const reviewToken = requireAuthentication();

    if (!reviewToken) {
      return;
    }

    const reviewPlaceId = getPlaceIdFromURL();

    reviewForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const reviewText = document.getElementById("review").value.trim();
      const rating = document.getElementById("rating").value;

      if (!reviewText) {
        alert("Review cannot be empty.");
        return;
      }

      if (!reviewPlaceId) {
        alert("Place ID not found.");
        return;
      }

      const reviewData = {
        text: reviewText,
        rating: Number(rating),
        place_id: reviewPlaceId,
      };

      try {
        const response = await fetch("http://127.0.0.1:5000/api/v1/reviews/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reviewToken}`,
          },
          body: JSON.stringify(reviewData),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Review submitted successfully!");
          reviewForm.reset();
        } else {
          alert(data.error || "Failed to submit review.");
        }
      } catch (error) {
        alert("An error occurred while submitting the review.");
      }
    });
  }
});
