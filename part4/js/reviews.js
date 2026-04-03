/* Review fetching, summaries, actions, and review submission flows. */

async function fetchPlaceReviewSummaries(token) {
  // Loads every review so card-level rating summaries can be computed.
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
  // Groups reviews by place to compute one summary per listing.
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

function renderStarRating(rating) {
  // Converts a numeric rating into a five-star visual display.
  const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < safeRating;
    return `<span class="review-star${isFilled ? " is-filled" : ""}" aria-hidden="true">★</span>`;
  }).join("");
}


async function fetchPlaceReviews(token, placeId) {
  // Loads the reviews for one place and syncs the shared client state.
  const response = await fetch(`${API_BASE_URL}/places/${placeId}/reviews`, {
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch place reviews");
  }

  const reviews = await parseJsonSafely(response);
  const safeReviews = sortReviewsByNewest(
    Array.isArray(reviews) ? reviews : [],
  );

  APP_STATE.currentReviews = safeReviews;
  APP_STATE.currentReviewSummary = getReviewSummary(safeReviews);
  APP_STATE.currentUserReview = getCurrentUserReview(
    safeReviews,
    getAuthContext(token),
  );

  displayPlaceReviews(safeReviews);
  renderReviewSummaryCard(APP_STATE.currentReviewSummary);
  renderAddReviewAccess(token, placeId);
  renderReviewWorkspace(APP_STATE.currentUserReview);

  if (APP_STATE.currentPlace) {
    displayPlaceSummary(APP_STATE.currentPlace);
  }

  return safeReviews;
}

function renderReviewSummaryCard(reviewSummary = null) {
  // Displays the aggregate review score for the current place.
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
  // Resolves the best author label available for a review entry.
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
  // Computes the average score and count for a list of reviews.
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

function normalizeReview(review) {
  // Ensures reviews expose stable timestamp fields for UI sorting and display.
  if (!review || typeof review !== "object") {
    return review;
  }

  return {
    ...review,
    created_at: review.created_at || null,
    updated_at: review.updated_at || null,
  };
}

function getReviewTimestampValue(review, fieldName = "created_at") {
  // Converts one ISO timestamp into a comparable numeric value.
  const rawValue = review?.[fieldName];

  if (!rawValue) {
    return 0;
  }

  const parsedValue = Date.parse(rawValue);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function sortReviewsByNewest(reviews) {
  // Keeps the newest posted reviews at the top of the list.
  if (!Array.isArray(reviews)) {
    return [];
  }

  return reviews
    .map((review) => normalizeReview(review))
    .slice()
    .sort((firstReview, secondReview) => {
      const firstCreatedAt = getReviewTimestampValue(firstReview, "created_at");
      const secondCreatedAt = getReviewTimestampValue(
        secondReview,
        "created_at",
      );

      if (firstCreatedAt !== secondCreatedAt) {
        return secondCreatedAt - firstCreatedAt;
      }

      const firstUpdatedAt = getReviewTimestampValue(firstReview, "updated_at");
      const secondUpdatedAt = getReviewTimestampValue(
        secondReview,
        "updated_at",
      );

      if (firstUpdatedAt !== secondUpdatedAt) {
        return secondUpdatedAt - firstUpdatedAt;
      }

      return String(secondReview.id || "").localeCompare(
        String(firstReview.id || ""),
      );
    });
}

function formatReviewDateTime(dateValue) {
  // Formats one review timestamp using the active language locale.
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const locale = getCurrentLanguage() === "fr" ? "fr-FR" : "en-GB";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function renderReviewMeta(review) {
  // Builds the publication and edition timestamps shown on review cards.
  const createdAtLabel = formatReviewDateTime(review?.created_at);
  const updatedAtLabel = formatReviewDateTime(review?.updated_at);

  if (!createdAtLabel && !updatedAtLabel) {
    return "";
  }

  const metaItems = [];

  if (createdAtLabel) {
    metaItems.push(`
      <span class="review-meta-item">
        <span class="review-meta-label">${t("dynamic.reviewPostedOn")}</span>
        <time datetime="${escapeHtml(review.created_at)}">${escapeHtml(createdAtLabel)}</time>
      </span>
    `);
  }

  const createdAtValue = getReviewTimestampValue(review, "created_at");
  const updatedAtValue = getReviewTimestampValue(review, "updated_at");

  if (
    updatedAtLabel &&
    updatedAtValue &&
    updatedAtValue > createdAtValue + 1000
  ) {
    metaItems.push(`
      <span class="review-meta-item">
        <span class="review-meta-label">${t("dynamic.reviewUpdatedOn")}</span>
        <time datetime="${escapeHtml(review.updated_at)}">${escapeHtml(updatedAtLabel)}</time>
      </span>
    `);
  }

  if (!metaItems.length) {
    return "";
  }

  return `<p class="review-card-meta">${metaItems.join('<span class="review-meta-separator">•</span>')}</p>`;
}

function isOwnReview(review, authContext = APP_STATE.auth) {
  // Checks whether the authenticated user is the actual author of the review.
  if (!review || !authContext?.userId) {
    return false;
  }

  return String(review.user_id) === String(authContext.userId);
}

function displayPlaceReviews(reviews) {
  // Renders the review list shown at the bottom of the place page.
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

  const sortedReviews = sortReviewsByNewest(reviews);

  for (const review of sortedReviews) {
    const reviewCard = document.createElement("article");
    reviewCard.classList.add("review-card");

    const authorName = getReviewAuthorName(review);
    const rating = Number(review.rating) || 0;
    const starsMarkup = renderStarRating(rating);
    const ariaLabel =
      getCurrentLanguage() === "fr" ? `${rating} sur 5` : `${rating} out of 5`;
    const isOwnedReview = isOwnReview(review);

    reviewCard.innerHTML = `
      <div class="review-card-header">
        <div class="review-card-heading">
          <h3>${authorName}</h3>
          ${
            isOwnedReview
              ? `<span class="review-card-badge">${t("dynamic.yourReviewBadge")}</span>`
              : ""
          }
        </div>

        <div class="review-rating" aria-label="${ariaLabel}">
          <div class="review-rating-stars">
            ${starsMarkup}
          </div>
          <span class="review-rating-value">${rating}/5</span>
        </div>
      </div>
      ${renderReviewMeta(review)}
      <p class="review-comment">${translateReviewText(review.text || t("dynamic.noComment"))}</p>
      ${renderReviewActionButtons(review)}
    `;

    reviewsList.appendChild(reviewCard);
  }

  reviewsSection.appendChild(reviewsList);
  setupRevealAnimations();
}

function canManageReview(review, authContext = APP_STATE.auth) {
  // Restricts edit and delete controls to the actual review owner only.
  return isOwnReview(review, authContext);
}

function getCurrentUserReview(reviews, authContext = APP_STATE.auth) {
  // Returns the review currently owned by the authenticated user.
  if (!Array.isArray(reviews) || !authContext?.userId) {
    return null;
  }

  return (
    reviews.find(
      (review) => String(review.user_id) === String(authContext.userId),
    ) || null
  );
}

function getReviewById(reviewId) {
  // Locates one review inside the current client-side review cache.
  if (!Array.isArray(APP_STATE.currentReviews)) {
    return null;
  }

  return (
    APP_STATE.currentReviews.find(
      (review) => String(review.id) === String(reviewId),
    ) || null
  );
}

function renderReviewActionButtons(review, compact = false) {
  // Builds the action controls shown on reviews owned by the current user.
  if (!canManageReview(review)) {
    return "";
  }

  return `
    <div class="review-card-actions${compact ? " review-card-actions--compact" : ""}">
      <button
        type="button"
        class="review-action-button"
        data-review-action="edit"
        data-review-id="${escapeHtml(review.id)}"
      >
        ${t("dynamic.editReview")}
      </button>

      <button
        type="button"
        class="review-action-button review-action-button--ghost"
        data-review-action="delete"
        data-review-id="${escapeHtml(review.id)}"
      >
        ${t("dynamic.deleteReview")}
      </button>
    </div>
  `;
}

function renderCurrentUserReviewCard(review, showActions = true) {
  // Displays the current user's review in the add-review workspace.
  if (!review) {
    return "";
  }

  const rating = Number(review.rating) || 0;
  const ariaLabel =
    getCurrentLanguage() === "fr" ? `${rating} sur 5` : `${rating} out of 5`;

  return `
    <article class="review-owner-card">
      <div class="review-owner-card-header">
        <div>
          <p class="review-owner-card-label">${t("dynamic.yourReviewBadge")}</p>
          <h3>${escapeHtml(getReviewAuthorName(review))}</h3>
        </div>

        <div class="review-rating" aria-label="${ariaLabel}">
          <div class="review-rating-stars">
            ${renderStarRating(rating)}
          </div>
          <span class="review-rating-value">${rating}/5</span>
        </div>
      </div>

      ${renderReviewMeta(review)}
      <p class="review-comment">${translateReviewText(review.text || t("dynamic.noComment"))}</p>
      ${showActions ? renderReviewActionButtons(review, true) : ""}
    </article>
  `;
}

function renderReviewWorkspace(currentReview = null) {
  // Synchronizes the add-review page with the user's current review state.
  const reviewStatusCard = document.getElementById("review-status-card");
  const reviewForm = document.getElementById("review-form");
  const reviewTextInput = document.getElementById("review");
  const ratingInput = document.getElementById("rating");
  const submitButton = reviewForm?.querySelector('button[type="submit"]');
  const formTitle = document.getElementById("review-form-title");
  const formHelper = document.getElementById("review-form-helper");
  const existingState = reviewForm?.querySelector(".review-form-lock-card");

  if (reviewStatusCard) {
    if (!currentReview) {
      reviewStatusCard.innerHTML = `
        <p class="section-kicker">${t("add.status.kicker")}</p>
        <h2>${t("add.status.title")}</h2>
        ${renderStateCard(
          t("dynamic.reviewStatusEmptyTitle"),
          t("dynamic.reviewStatusEmptyText"),
          true,
        )}
      `;
    } else {
      reviewStatusCard.innerHTML = `
        <p class="section-kicker">${t("add.status.kicker")}</p>
        <h2>${t("add.status.title")}</h2>
        <p class="review-status-text">${t("dynamic.reviewStatusFilledText")}</p>
        ${renderCurrentUserReviewCard(currentReview, true)}
      `;
    }
  }

  if (!reviewForm || !reviewTextInput || !ratingInput || !submitButton) {
    return;
  }

  if (existingState) {
    existingState.remove();
  }

  if (currentReview) {
    reviewForm.classList.add("review-form--locked");
    reviewTextInput.value = currentReview.text || "";
    ratingInput.value = String(currentReview.rating || "");
    reviewTextInput.disabled = true;
    ratingInput.disabled = true;
    submitButton.hidden = true;

    if (formTitle) {
      formTitle.textContent = t("dynamic.reviewLockedTitle");
    }

    if (formHelper) {
      formHelper.textContent = t("dynamic.reviewLockedHelper");
    }

    const lockCard = document.createElement("div");
    lockCard.className = "review-form-lock-card";
    lockCard.innerHTML = `
      <p>${t("dynamic.reviewLockedHelper")}</p>
      ${renderReviewActionButtons(currentReview, true)}
    `;
    reviewForm.appendChild(lockCard);
    return;
  }

  reviewForm.classList.remove("review-form--locked");
  reviewTextInput.disabled = false;
  ratingInput.disabled = false;
  submitButton.hidden = false;
  reviewTextInput.value = "";
  ratingInput.value = "";

  if (formTitle) {
    formTitle.textContent = t("add.form.title");
  }

  if (formHelper) {
    formHelper.textContent = t("dynamic.reviewUnlockedHelper");
  }
}

async function refreshReviewExperience(placeId, token) {
  // Reloads review-dependent UI after create, update, or delete actions.
  if (!placeId) {
    return;
  }

  await fetchPlaceReviews(token, placeId);
}

function ensureReviewActionModal() {
  // Lazily creates the shared modal used to edit or delete one review.
  let modal = document.getElementById("review-action-modal");

  if (modal) {
    return modal;
  }

  modal = document.createElement("div");
  modal.id = "review-action-modal";
  modal.className = "review-modal";
  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-review-modal-close='true']")) {
      closeReviewActionModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeReviewActionModal();
    }
  });

  return modal;
}

function openReviewActionModal(markup) {
  // Opens the shared review modal with injected content.
  const modal = ensureReviewActionModal();
  modal.innerHTML = markup;
  modal.classList.add("is-open");
  document.body.classList.add("page-modal-open");
}

function closeReviewActionModal() {
  // Closes the shared review modal and clears its content.
  const modal = document.getElementById("review-action-modal");

  if (!modal) {
    return;
  }

  modal.classList.remove("is-open");
  modal.innerHTML = "";
  document.body.classList.remove("page-modal-open");
}

function openReviewEditModal(review) {
  // Opens a modal form to edit one existing review.
  const rating = Number(review.rating) || 0;

  openReviewActionModal(`
    <div class="review-modal-backdrop" data-review-modal-close="true"></div>

    <div
      class="review-modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="${t("dynamic.editReviewTitle")}"
    >
      <button
        type="button"
        class="review-modal-close"
        data-review-modal-close="true"
        aria-label="${t("dynamic.cancel")}"
      >
        ×
      </button>

      <p class="section-kicker">${t("dynamic.manageYourReview")}</p>
      <h2>${t("dynamic.editReviewTitle")}</h2>
      <p class="review-modal-text">${t("dynamic.editReviewText")}</p>

      <form id="review-modal-form" class="review-modal-form">
        <p id="review-modal-message" class="form-message" aria-live="polite"></p>

        <label for="review-modal-text">${t("add.form.reviewLabel")}</label>
        <textarea id="review-modal-text" rows="6" required>${escapeHtml(review.text || "")}</textarea>

        <label for="review-modal-rating">${t("add.form.ratingLabel")}</label>
        <select id="review-modal-rating" required>
          <option value="1" ${rating === 1 ? "selected" : ""}>${t("add.form.option1")}</option>
          <option value="2" ${rating === 2 ? "selected" : ""}>${t("add.form.option2")}</option>
          <option value="3" ${rating === 3 ? "selected" : ""}>${t("add.form.option3")}</option>
          <option value="4" ${rating === 4 ? "selected" : ""}>${t("add.form.option4")}</option>
          <option value="5" ${rating === 5 ? "selected" : ""}>${t("add.form.option5")}</option>
        </select>

        <div class="review-modal-actions">
          <button
            type="button"
            class="review-action-button review-action-button--ghost"
            data-review-modal-close="true"
          >
            ${t("dynamic.cancel")}
          </button>
          <button type="submit" class="review-action-button review-action-button--primary">
            ${t("dynamic.editReviewSubmit")}
          </button>
        </div>
      </form>
    </div>
  `);

  const modal = document.getElementById("review-action-modal");
  const form = modal?.querySelector("#review-modal-form");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const messageElement = modal.querySelector("#review-modal-message");
    const submitButton = form.querySelector('button[type="submit"]');
    const nextText = modal.querySelector("#review-modal-text").value.trim();
    const nextRating = Number(
      modal.querySelector("#review-modal-rating").value,
    );

    resetFormMessage(messageElement);

    if (!nextText) {
      setFormMessage(messageElement, t("dynamic.reviewEmpty"), "error");
      return;
    }

    if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
      setFormMessage(messageElement, t("dynamic.reviewInvalidRating"), "error");
      return;
    }

    setButtonLoading(submitButton, true, t("dynamic.submitting"));
    setFormMessage(messageElement, t("dynamic.updatingReview"), "loading");

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${APP_STATE.auth.token}`,
        },
        body: JSON.stringify({
          text: nextText,
          rating: nextRating,
        }),
      });

      const data = await parseJsonSafely(response);
      setButtonLoading(submitButton, false);

      if (!response.ok) {
        setFormMessage(
          messageElement,
          data.error || t("dynamic.updateReviewFailed"),
          "error",
        );
        return;
      }

      await refreshReviewExperience(getPlaceIdFromURL(), APP_STATE.auth.token);
      closeReviewActionModal();

      const reviewMessage = document.getElementById("review-message");
      if (reviewMessage) {
        setFormMessage(
          reviewMessage,
          t("dynamic.updateReviewSuccess"),
          "success",
        );
      }
    } catch (error) {
      setButtonLoading(submitButton, false);
      setFormMessage(messageElement, t("dynamic.updateReviewError"), "error");
    }
  });
}

function openReviewDeleteModal(review) {
  // Opens a confirmation dialog before deleting one review.
  openReviewActionModal(`
    <div class="review-modal-backdrop" data-review-modal-close="true"></div>

    <div
      class="review-modal-dialog review-modal-dialog--confirm"
      role="dialog"
      aria-modal="true"
      aria-label="${t("dynamic.deleteReviewTitle")}"
    >
      <button
        type="button"
        class="review-modal-close"
        data-review-modal-close="true"
        aria-label="${t("dynamic.cancel")}"
      >
        ×
      </button>

      <p class="section-kicker">${t("dynamic.manageYourReview")}</p>
      <h2>${t("dynamic.deleteReviewTitle")}</h2>
      <p class="review-modal-text">${t("dynamic.deleteReviewText")}</p>
      ${renderCurrentUserReviewCard(review, false)}

      <p id="review-modal-message" class="form-message" aria-live="polite"></p>

      <div class="review-modal-actions">
        <button
          type="button"
          class="review-action-button review-action-button--ghost"
          data-review-modal-close="true"
        >
          ${t("dynamic.cancel")}
        </button>
        <button
          type="button"
          id="review-delete-confirm"
          class="review-action-button review-action-button--danger"
        >
          ${t("dynamic.deleteReviewConfirm")}
        </button>
      </div>
    </div>
  `);

  const modal = document.getElementById("review-action-modal");
  const confirmButton = modal?.querySelector("#review-delete-confirm");

  confirmButton?.addEventListener("click", async () => {
    const messageElement = modal.querySelector("#review-modal-message");
    resetFormMessage(messageElement);
    setButtonLoading(confirmButton, true, t("dynamic.deletingReview"));
    setFormMessage(messageElement, t("dynamic.deletingReview"), "loading");

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${review.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${APP_STATE.auth.token}`,
        },
      });

      const data = await parseJsonSafely(response);
      setButtonLoading(confirmButton, false);

      if (!response.ok) {
        setFormMessage(
          messageElement,
          data.error || t("dynamic.deleteReviewFailed"),
          "error",
        );
        return;
      }

      await refreshReviewExperience(getPlaceIdFromURL(), APP_STATE.auth.token);
      closeReviewActionModal();

      const reviewMessage = document.getElementById("review-message");
      if (reviewMessage) {
        setFormMessage(
          reviewMessage,
          t("dynamic.deleteReviewSuccess"),
          "success",
        );
      }
    } catch (error) {
      setButtonLoading(confirmButton, false);
      setFormMessage(messageElement, t("dynamic.deleteReviewError"), "error");
    }
  });
}

function initializeReviewActionDelegation() {
  // Routes edit and delete button clicks to the shared review modal.
  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-review-action]");

    if (!actionButton) {
      return;
    }

    const review = getReviewById(actionButton.dataset.reviewId);

    if (!review) {
      return;
    }

    if (actionButton.dataset.reviewAction === "edit") {
      openReviewEditModal(review);
      return;
    }

    if (actionButton.dataset.reviewAction === "delete") {
      openReviewDeleteModal(review);
    }
  });
}

function displayPlaceSummary(place) {
  // Builds the compact summary used on the add-review page.
  const placeSummarySection = document.querySelector(".place-summary");

  if (!placeSummarySection) {
    return;
  }

  const title = escapeHtml(
    translatePlaceTitle(place.title || place.name || t("dynamic.selectedStay")),
  );
  const price = Number(place.price) || 0;
  const reviewSummary = APP_STATE.currentReviewSummary;
  const currentReview = APP_STATE.currentUserReview;

  placeSummarySection.innerHTML = `
    <p class="section-kicker">${t("dynamic.selectedStay")}</p>
    <h2>${t("dynamic.placeSummaryTitle")}</h2>

    <div class="place-summary-meta">
      <div class="place-summary-row">
        <span>${t("dynamic.labelName")}</span>
        <strong>${title}</strong>
      </div>
      <div class="place-summary-row">
        <span>${t("dynamic.labelHost")}</span>
        <strong>${escapeHtml(getHostName(place))}</strong>
      </div>
      <div class="place-summary-row">
        <span>${t("dynamic.labelPrice")}</span>
        <strong>${formatPriceInline(price)}</strong>
      </div>
    </div>

    <div class="place-summary-rating-box">
      <div class="place-summary-rating-top">
        <span class="place-summary-rating-value">${
          reviewSummary ? reviewSummary.averageLabel : "—"
        }</span>
        <span class="place-summary-rating-scale">/ 5</span>
      </div>
      <div class="review-summary-stars">
        ${reviewSummary ? renderStarRating(reviewSummary.average) : renderStarRating(0)}
      </div>
      <p class="review-summary-count">
        ${reviewSummary ? reviewSummary.countLabel : t("dynamic.noReviewsYetShort")}
      </p>
    </div>

    <div class="place-summary-tags">
      <span class="place-summary-chip">
        ${currentReview ? t("dynamic.reviewAlreadySharedChip") : t("dynamic.reviewReadyChip")}
      </span>
      <span class="place-summary-chip">${escapeHtml(getHostName(place))}</span>
    </div>
  `;
}

function renderAddReviewAccess(token, placeId) {
  // Shows the right call-to-action depending on authentication state.
  const addReviewSection = document.getElementById("add-review");

  if (!addReviewSection) {
    return;
  }

  const currentReview = APP_STATE.currentUserReview;

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

  if (currentReview) {
    addReviewSection.innerHTML = `
      <p class="section-kicker">${t("place.addreview.kicker")}</p>
      <h2>${t("dynamic.manageYourReview")}</h2>
      <p class="add-review-text">
        ${t("dynamic.reviewAlreadySharedText")}
      </p>
      <div class="add-review-actions">
        <button
          type="button"
          class="review-action-button review-action-button--primary"
          data-review-action="edit"
          data-review-id="${escapeHtml(currentReview.id)}"
        >
          ${t("dynamic.editReview")}
        </button>
        <button
          type="button"
          class="review-action-button review-action-button--ghost"
          data-review-action="delete"
          data-review-id="${escapeHtml(currentReview.id)}"
        >
          ${t("dynamic.deleteReview")}
        </button>
      </div>
      <p class="add-review-note">
        ${t("dynamic.reviewAlreadySharedNote")}
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

async function handleReviewSubmit(event, token, placeId, reviewForm) {
  // Submits a new review for the currently selected place.
  event.preventDefault();

  const reviewText = document.getElementById("review").value.trim();
  const rating = document.getElementById("rating").value;
  const numericRating = Number(rating);
  const reviewMessage = document.getElementById("review-message");
  const submitButton = reviewForm.querySelector('button[type="submit"]');

  resetFormMessage(reviewMessage);

  if (APP_STATE.currentUserReview) {
    setFormMessage(reviewMessage, t("dynamic.reviewLockedHelper"), "error");
    return;
  }

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
      await refreshReviewExperience(placeId, token);
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
