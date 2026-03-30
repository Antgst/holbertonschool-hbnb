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

function checkAuthentication() {
  const token = getCookie("token");
  const loginLink = document.getElementById("login-link");

  if (!token) {
    loginLink.style.display = "block";
  } else {
    loginLink.style.display = "none";
    // Fetch places data if the user is authenticated
    fetchPlaces(token);
  }
}

async function fetchPlaces(token) {
  const response = await fetch("http://127.0.0.1:5000/api/v1/places/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch places");
  }

  const places = await response.json();
  displayPlaces(places);
}

function displayPlaces(places) {
  const placesList = document.getElementById("places-list");
  placesList.innerHTML = "";

  for (const place of places) {
    const placeElement = document.createElement("div");
    placeElement.classList.add("place-card");
    placeElement.dataset.price = place.price;
    placeElement.innerHTML = `
      <h2>${place.name}</h2>
      <p>Price per night: $${place.price}</p>
      <a href="place.html" class="details-button">View details</a>
      `;

    placesList.appendChild(placeElement);
  }
}

function populatePriceFilter() {
  const priceFilter = document.getElementById("price-filter");

  if (!priceFilter) {
    return;
  }

  const prices = ["10", "50", "100", "All"];

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

document.addEventListener("DOMContentLoaded", () => {
  populatePriceFilter();
  setupPriceFilter();
  checkAuthentication();

  const loginForm = document.getElementById("login-form");

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
});
