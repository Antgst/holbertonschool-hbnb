/* Host-specific helpers, host cards, and host directory rendering. */

function getHostImage(place) {
  // Resolves a host portrait path from the seeded image map when available.
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

function buildReviewsByPlaceMap(reviews) {
  // Groups reviews by place id to support host and place summaries.
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
  // Derives normalized host cards from places and grouped reviews.
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
  // Builds the host preview avatar using either a photo or initials.
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

function getHostName(place) {
  // Extracts the most user-friendly host name available from the place data.
  if (place.owner && place.owner.first_name && place.owner.last_name) {
    return `${place.owner.first_name} ${place.owner.last_name}`;
  }

  if (place.owner && place.owner.first_name) {
    return place.owner.first_name;
  }

  return t("dynamic.unknownHost");
}

function getHostInitials(place) {
  // Builds a compact avatar label when no host picture is available.
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
  // Fills the host spotlight card shown beside the place details.
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

function renderHostPreviewCard(host) {
  // Creates one host card for the directory page.
  const hostName = escapeHtml(host.name);
  const leadPlaceTitle = escapeHtml(translatePlaceTitle(host.leadPlaceTitle));
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
  // Renders the full host directory from the normalized host list.
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
  // Loads places and reviews together to derive host directory data.
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
