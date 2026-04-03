/* Page bootstrap that wires the split front-end modules together. */

document.addEventListener("DOMContentLoaded", () => {
  initializeLanguageToggle();
  initializeThemeToggle();
  populatePriceFilter();
  setupPriceFilter();
  initializePlaceGalleryLightbox();
  initializeReviewActionDelegation();

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

  let activeToken = token;

  if (reviewForm && placeSummarySection) {
    activeToken = requireAuthentication();

    if (!activeToken) {
      return;
    }
  }

  APP_STATE.auth = getAuthContext(activeToken || token);

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
    fetchPlaceDetails(activeToken || token, placeId).catch((error) => {
      console.error("Error fetching place details:", error);
    });
  }

  if (placeId && placeDetailsSection) {
    renderAddReviewAccess(activeToken || token, placeId);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  if (reviewForm && placeSummarySection) {
    reviewForm.addEventListener("submit", async (event) => {
      await handleReviewSubmit(event, activeToken, placeId, reviewForm);
    });
  }
});
