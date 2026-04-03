/* Language state, translations, and localized formatting helpers. */

const SEEDED_CONTENT_TRANSLATIONS = {
  fr: {
    amenityNames: {
      WiFi: "Wi‑Fi",
      Parking: "Parking",
      "Sea View": "Vue mer",
      "City View": "Vue sur la ville",
      "Mountain View": "Vue sur les montagnes",
      Spa: "Spa",
      "Hot Tub": "Jacuzzi",
      Fireplace: "Cheminée",
      Workspace: "Espace de travail",
      Garden: "Jardin",
      Balcony: "Balcon",
      Breakfast: "Petit-déjeuner",
      "Air Conditioning": "Climatisation",
      Heating: "Chauffage",
      Kitchen: "Cuisine",
      Washer: "Lave-linge",
      TV: "Télévision",
      Pool: "Piscine",
      "Pet Friendly": "Animaux acceptés",
      "Self Check-in": "Arrivée autonome",
      "Beach Access": "Accès plage",
      BBQ: "Barbecue",
      Elevator: "Ascenseur",
      Accessible: "Accessible",
      "EV Charger": "Borne de recharge",
    },
    placeTitles: {
      "Rennes City Center Loft": "Loft au centre-ville de Rennes",
      "Cozy Saint-Malo Studio": "Studio cosy à Saint-Malo",
      "Sea View House in Cancale": "Maison avec vue mer à Cancale",
      "Chic Apartment in Vannes": "Appartement chic à Vannes",
      "Nature Cabin in Broceliande": "Cabane nature en Brocéliande",
      "Dinard Spa Villa": "Villa spa à Dinard",
      "Royal Suite at Chambord Castle": "Suite royale au château de Chambord",
      "Betton Room": "Chambre à Betton",
    },
    placeDescriptions: {
      "A bright and elegant loft in the heart of Rennes, ideal for a premium city break with easy access to restaurants, shops, and the historic center.":
        "Un loft lumineux et élégant au cœur de Rennes, idéal pour une escapade urbaine premium avec un accès facile aux restaurants, aux boutiques et au centre historique.",
      "A warm and practical studio near the beach and the old town, perfect for a romantic weekend or a short coastal stay.":
        "Un studio chaleureux et pratique près de la plage et de la vieille ville, parfait pour un week-end romantique ou un court séjour en bord de mer.",
      "A spacious house with panoramic sea views, designed for peaceful stays, family gatherings, and refined comfort by the coast.":
        "Une maison spacieuse avec vue panoramique sur la mer, pensée pour des séjours paisibles, des moments en famille et un confort raffiné sur la côte.",
      "A stylish apartment with modern decor, premium comfort, and a calm atmosphere, just minutes from the historic center of Vannes.":
        "Un appartement élégant à la décoration moderne, au confort premium et à l'atmosphère paisible, à quelques minutes du centre historique de Vannes.",
      "A charming cabin surrounded by nature, offering a cozy retreat for guests looking for silence, forest views, and a unique escape.":
        "Une charmante cabane entourée de nature, offrant un refuge cosy pour les voyageurs en quête de silence, de vues sur la forêt et d'une parenthèse unique.",
      "A luxurious villa with spa facilities, generous volumes, and a high-end ambiance for an exceptional seaside experience.":
        "Une villa luxueuse avec espace spa, de beaux volumes et une ambiance haut de gamme pour une expérience exceptionnelle en bord de mer.",
      "An exclusive and prestigious suite inspired by French heritage, created for unforgettable luxury stays in a remarkable setting.":
        "Une suite exclusive et prestigieuse inspirée du patrimoine français, conçue pour des séjours de luxe inoubliables dans un cadre remarquable.",
      "A simple, clean, and affordable room for short stays, business travel, or practical overnight stops near Rennes.":
        "Une chambre simple, propre et abordable pour de courts séjours, des déplacements professionnels ou des nuits pratiques près de Rennes.",
    },
    reviewTexts: {
      "Excellent location, elegant decor, and a very comfortable stay. Everything felt premium and well thought out.":
        "Excellent emplacement, décoration élégante et séjour très confortable. Tout semblait premium et bien pensé.",
      "Very stylish loft with a great atmosphere. A little lively outside at night, but still a very good experience.":
        "Loft très stylé avec une belle atmosphère. Un peu animé dehors le soir, mais l'expérience reste très bonne.",
      "Beautiful loft in the city center, spotless and easy to access. I would definitely stay here again.":
        "Très beau loft en centre-ville, impeccable et facile d'accès. J'y reviendrais sans hésiter.",
      "Very good stay overall. The loft is well designed and pleasant, with easy access to central Rennes.":
        "Très bon séjour dans l'ensemble. Le loft est bien pensé et agréable, avec un accès facile au centre de Rennes.",
      "The place looks good, but I had trouble sleeping because of outside noise and I expected a calmer stay for the price.":
        "Le logement est beau, mais j'ai eu du mal à dormir à cause du bruit extérieur et j'attendais un séjour plus calme pour ce prix.",
      "Nice loft with real character and a comfortable layout. Good choice for a city break.":
        "Joli loft avec une vraie personnalité et un agencement confortable. Un bon choix pour une escapade urbaine.",
      "Excellent balance of style, comfort, and location. One of the most polished stays in Rennes.":
        "Excellent équilibre entre style, confort et emplacement. L'un des séjours les plus aboutis à Rennes.",
      "Small but very well organized. Great for a short stay near the sea and the old town.":
        "Petit mais très bien agencé. Idéal pour un court séjour près de la mer et de la vieille ville.",
      "Lovely and cozy studio, perfect for two people. The location made everything easy and enjoyable.":
        "Studio charmant et cosy, parfait pour deux personnes. L'emplacement rend tout simple et agréable.",
      "Very practical and pleasant place. Good value for money and a warm atmosphere.":
        "Logement très pratique et agréable. Bon rapport qualité-prix et ambiance chaleureuse.",
      "Charming little studio, well placed and easy to enjoy for a weekend near the sea.":
        "Charmant petit studio, bien situé et très agréable pour un week-end près de la mer.",
      "Good location and useful for a short trip, but the space felt a bit limited once luggage was inside.":
        "Bon emplacement et pratique pour un court voyage, mais l'espace semble vite limité une fois les bagages à l'intérieur.",
      "Correct for one night, but I found the studio too cramped and less comfortable than expected for a relaxing stay.":
        "Correct pour une nuit, mais j'ai trouvé le studio trop exigu et moins confortable que prévu pour un séjour reposant.",
      "Pleasant and well located studio. Simple, but it does the job well for a coastal weekend.":
        "Studio agréable et bien situé. Simple, mais il remplit bien son rôle pour un week-end sur la côte.",
      "The sea view is absolutely stunning. Spacious, quiet, and perfect for a relaxing coastal getaway.":
        "La vue sur mer est absolument superbe. Spacieux, calme et parfait pour une escapade relaxante sur la côte.",
      "Beautiful property with a peaceful atmosphere. The kitchen could be better equipped, but overall excellent.":
        "Belle propriété avec une atmosphère paisible. La cuisine pourrait être mieux équipée, mais l'ensemble est excellent.",
      "A truly relaxing house with an amazing view. It felt refined, spacious, and very comfortable.":
        "Une maison vraiment reposante avec une vue incroyable. L'ensemble est raffiné, spacieux et très confortable.",
      "Excellent family house with a strong premium feel. The sea view gives the whole stay real value.":
        "Excellente maison familiale avec une vraie sensation premium. La vue mer apporte une réelle valeur au séjour.",
      "Very pleasant and spacious property. Great atmosphere and a strong sense of calm throughout the stay.":
        "Propriété très agréable et spacieuse. Belle atmosphère et véritable sensation de calme pendant tout le séjour.",
      "The view is beautiful, but I expected a more modern interior and found some parts of the house less cozy than shown.":
        "La vue est magnifique, mais j'attendais un intérieur plus moderne et j'ai trouvé certaines parties de la maison moins chaleureuses qu'annoncé.",
      "Large, peaceful, and memorable. Excellent choice for a refined stay by the coast.":
        "Spacieux, paisible et mémorable. Un excellent choix pour un séjour raffiné sur la côte.",
      "Modern, elegant, and very comfortable. The apartment was spotless and beautifully decorated.":
        "Moderne, élégant et très confortable. L'appartement était impeccable et joliment décoré.",
      "Very nice apartment with a calm and stylish atmosphere. Great base for visiting Vannes.":
        "Très bel appartement avec une atmosphère calme et soignée. Une excellente base pour visiter Vannes.",
      "Clean, bright, and well located. The decor gives the place a refined and welcoming character.":
        "Propre, lumineux et bien situé. La décoration donne au lieu un caractère raffiné et accueillant.",
      "Elegant apartment, very clean, and perfectly suited for a comfortable city stay.":
        "Appartement élégant, très propre et parfaitement adapté à un séjour urbain confortable.",
      "Beautiful decor, calm atmosphere, and a very polished overall experience.":
        "Belle décoration, ambiance calme et expérience globale très soignée.",
      "Bright, stylish, and well located. It felt premium from arrival to departure.":
        "Lumineux, stylé et bien situé. L'expérience semblait premium du début à la fin.",
      "Very pleasant stay with a clean and modern feel. Easy place to recommend.":
        "Séjour très agréable avec une impression de propreté et de modernité. Facile à recommander.",
      "A peaceful and unique cabin surrounded by nature. Ideal for disconnecting and slowing down.":
        "Une cabane paisible et unique entourée de nature. Idéale pour déconnecter et ralentir.",
      "Warm and charming place with a beautiful natural setting. Very relaxing and cozy.":
        "Lieu chaleureux et charmant dans un très beau cadre naturel. Très reposant et cosy.",
      "Excellent experience in the forest. Quiet, original, and perfect for a restful weekend.":
        "Excellente expérience en pleine forêt. Calme, originale et parfaite pour un week-end reposant.",
      "Lovely natural escape with a cozy interior. A very good choice for slowing down.":
        "Très belle parenthèse nature avec un intérieur cosy. Un très bon choix pour ralentir.",
      "Peaceful setting and authentic cabin feel. Very pleasant if you want calm and nature.":
        "Cadre paisible et vraie ambiance cabane. Très agréable si l'on cherche le calme et la nature.",
      "The location is beautiful, but the isolation was too strong for me and the rustic setup felt less comfortable than expected.":
        "L'emplacement est magnifique, mais l'isolement était trop marqué pour moi et l'installation rustique m'a semblé moins confortable qu'attendu.",
      "A memorable cabin with real charm. Great atmosphere for a quiet weekend away.":
        "Une cabane mémorable avec un vrai charme. Excellente atmosphère pour un week-end au calme.",
      "A high-end villa with outstanding comfort. The spa area made the stay feel truly special.":
        "Une villa haut de gamme au confort remarquable. L'espace spa rend le séjour vraiment spécial.",
      "Spacious, elegant, and perfectly maintained. One of the best premium stays I have had.":
        "Spacieuse, élégante et parfaitement entretenue. L'un des meilleurs séjours premium que j'ai connus.",
      "Very beautiful villa with excellent amenities. The spa and overall ambiance were top quality.":
        "Très belle villa avec d'excellents équipements. Le spa et l'ambiance générale étaient de grande qualité.",
      "Outstanding villa with a premium feel throughout. Spacious, relaxing, and very well maintained.":
        "Villa remarquable avec une vraie sensation premium partout. Spacieuse, relaxante et très bien entretenue.",
      "Top-level comfort and excellent amenities. The spa area is a real strength of this property.":
        "Confort de très haut niveau et excellents équipements. L'espace spa est un véritable point fort de cette propriété.",
      "A luxurious and polished stay with excellent comfort. Everything felt high-end and carefully prepared.":
        "Un séjour luxueux et très soigné avec un excellent confort. Tout semblait haut de gamme et préparé avec attention.",
      "Very refined villa with a relaxing atmosphere. A little formal in style for me, but clearly high quality.":
        "Villa très raffinée avec une atmosphère relaxante. Un peu formelle dans le style à mon goût, mais clairement de grande qualité.",
      "An exceptional suite with a true luxury feel. The atmosphere was elegant and unforgettable.":
        "Une suite exceptionnelle avec une vraie sensation de luxe. L'atmosphère était élégante et inoubliable.",
      "Beautiful and impressive suite in a unique setting. Expensive, but clearly a premium experience.":
        "Suite belle et impressionnante dans un cadre unique. C'est cher, mais l'expérience est clairement premium.",
      "Refined, spacious, and memorable. Everything about this suite felt exclusive and luxurious.":
        "Raffinée, spacieuse et mémorable. Tout dans cette suite semblait exclusif et luxueux.",
      "Magnificent suite with a truly exceptional atmosphere. It felt elegant, memorable, and unique.":
        "Magnifique suite avec une atmosphère vraiment exceptionnelle. Le lieu paraît élégant, mémorable et unique.",
      "Very impressive stay. The place combines luxury, comfort, and a remarkable setting.":
        "Séjour très impressionnant. Le lieu combine luxe, confort et cadre remarquable.",
      "A refined and unforgettable experience. The suite feels exclusive without losing comfort.":
        "Une expérience raffinée et inoubliable. La suite semble exclusive sans perdre en confort.",
      "Exceptional property with a real prestige feel. Easily one of the most memorable stays in the dataset.":
        "Propriété exceptionnelle avec une vraie sensation de prestige. Facilement l'un des séjours les plus mémorables du jeu de données.",
      "Simple, clean, and practical. A very good option for a short and affordable stay.":
        "Simple, propre et pratique. Une très bonne option pour un séjour court et abordable.",
      "Basic room, but correct for the price. Good for one night and easy to access.":
        "Chambre basique, mais correcte pour le prix. Bien pour une nuit et facile d'accès.",
      "Clean and functional room with everything needed for a quick stop near Rennes.":
        "Chambre propre et fonctionnelle avec tout le nécessaire pour une halte rapide près de Rennes.",
      "Simple but clean and efficient. Good option for a short stay close to Rennes.":
        "Simple mais propre et efficace. Bonne option pour un court séjour près de Rennes.",
      "Functional room with the basics covered. A practical and honest budget-friendly stay.":
        "Chambre fonctionnelle avec l'essentiel. Un séjour pratique et honnête pour petit budget.",
      "Useful in a pinch, but the room felt too basic for me and lacked the comfort I wanted, even at this price level.":
        "Utile en dépannage, mais la chambre m'a semblé trop basique et manquait du confort que j'attendais, même à ce prix.",
      "Correct for one or two nights. Nothing special, but generally functional and easy to reach.":
        "Correcte pour une ou deux nuits. Rien d'exceptionnel, mais globalement fonctionnelle et facile d'accès.",
    },
  },
};

function translateSeededText(category, value) {
  // Translates seeded demo text by exact lookup when a localized version exists.
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return value;
  }

  const language = getCurrentLanguage();
  const translations = SEEDED_CONTENT_TRANSLATIONS[language]?.[category];

  if (!translations) {
    return value;
  }

  return translations[normalizedValue] || value;
}

function translatePlaceTitle(title) {
  // Translates one seeded place title.
  return translateSeededText("placeTitles", title);
}

function translatePlaceDescription(description) {
  // Translates one seeded place description.
  return translateSeededText("placeDescriptions", description);
}

function translateAmenityName(name) {
  // Translates one seeded amenity label.
  return translateSeededText("amenityNames", name);
}

function translateReviewText(text) {
  // Translates one seeded review sentence.
  return translateSeededText("reviewTexts", text);
}

function getPlaceDisplayTitle(place) {
  // Returns the translated title used in host preview cards.
  return translatePlaceTitle(
    place?.title || place?.name || t("dynamic.selectedStay"),
  );
}

const LANGUAGE_STORAGE_KEY = "hbnb-language";
const DEFAULT_LANGUAGE = "en";
const APP_STATE = {
  places: null,
  reviewSummaryMap: new Map(),
  currentPlace: null,
  currentReviews: null,
  currentReviewSummary: null,
  currentUserReview: null,
  hosts: null,
  auth: {
    token: null,
    userId: null,
    isAdmin: false,
  },
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
    "add.form.kicker": "Writing space",
    "add.form.title": "Share your feedback",
    "add.form.helper":
      "Focus on comfort, cleanliness, amenities, and the overall stay.",
    "add.status.kicker": "Your review",
    "add.status.title": "Review status",
    "add.status.loading": "Checking whether you already reviewed this stay...",
    "add.guide.kicker": "Writing guide",
    "add.guide.title": "What makes a useful review?",
    "add.guide.item1": "Be concrete about comfort, cleanliness, and amenities.",
    "add.guide.item2":
      "Keep it concise and explain the main strengths or limits.",
    "add.guide.item3": "Match the written review with the score you choose.",
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
    "dynamic.reviewPostedOn": "Posted on",
    "dynamic.reviewUpdatedOn": "Updated on",
    "dynamic.yourReviewBadge": "Your review",
    "dynamic.editReview": "Edit review",
    "dynamic.deleteReview": "Delete review",
    "dynamic.reviewStatusEmptyTitle": "No review submitted yet",
    "dynamic.reviewStatusEmptyText":
      "You can still submit one clear review for this stay.",
    "dynamic.reviewStatusFilledText":
      "You already reviewed this stay. You can edit or delete it anytime.",
    "dynamic.reviewLockedTitle": "You already reviewed this stay",
    "dynamic.reviewLockedHelper":
      "Use the buttons below to update or remove your existing review.",
    "dynamic.reviewUnlockedHelper":
      "A short and precise review is more useful than a long generic one.",
    "dynamic.reviewReadyChip": "Ready to review",
    "dynamic.reviewAlreadySharedChip": "Review already shared",
    "dynamic.noReviewsYetShort": "No ratings yet",
    "dynamic.manageYourReview": "Manage your review",
    "dynamic.editReviewTitle": "Edit your review",
    "dynamic.editReviewText":
      "Adjust the text and score so they reflect your real experience.",
    "dynamic.editReviewSubmit": "Save changes",
    "dynamic.updateReviewSuccess": "Review updated successfully.",
    "dynamic.updateReviewFailed": "Failed to update the review.",
    "dynamic.updateReviewError": "An error occurred while updating the review.",
    "dynamic.updatingReview": "Updating your review...",
    "dynamic.deleteReviewTitle": "Delete your review?",
    "dynamic.deleteReviewText":
      "This action removes your review for this stay. You can add a new one later.",
    "dynamic.deleteReviewConfirm": "Delete now",
    "dynamic.cancel": "Cancel",
    "dynamic.deleteReviewSuccess": "Review deleted successfully.",
    "dynamic.deleteReviewFailed": "Failed to delete the review.",
    "dynamic.deleteReviewError": "An error occurred while deleting the review.",
    "dynamic.deletingReview": "Deleting your review...",
    "dynamic.reviewAlreadySharedText":
      "You already left a review for this stay.",
    "dynamic.reviewAlreadySharedNote":
      "You can update or remove it directly from here.",
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
    "add.form.kicker": "Espace de rédaction",
    "add.form.title": "Partagez votre retour",
    "add.form.helper":
      "Concentrez-vous sur le confort, la propreté, les équipements et l'expérience globale.",
    "add.status.kicker": "Votre avis",
    "add.status.title": "Statut de l'avis",
    "add.status.loading":
      "Vérification de votre avis existant sur ce logement...",
    "add.guide.kicker": "Guide de rédaction",
    "add.guide.title": "Qu'est-ce qui rend un avis utile ?",
    "add.guide.item1":
      "Soyez concret sur le confort, la propreté et les équipements.",
    "add.guide.item2":
      "Restez concis et expliquez les points forts ou limites principales.",
    "add.guide.item3":
      "Faites correspondre le texte de l'avis avec la note choisie.",
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
    "dynamic.reviewPostedOn": "Publié le",
    "dynamic.reviewUpdatedOn": "Modifié le",
    "dynamic.yourReviewBadge": "Votre avis",
    "dynamic.editReview": "Modifier l'avis",
    "dynamic.deleteReview": "Supprimer l'avis",
    "dynamic.reviewStatusEmptyTitle": "Aucun avis envoyé pour le moment",
    "dynamic.reviewStatusEmptyText":
      "Vous pouvez encore laisser un avis clair sur ce logement.",
    "dynamic.reviewStatusFilledText":
      "Vous avez déjà évalué ce logement. Vous pouvez modifier ou supprimer votre avis à tout moment.",
    "dynamic.reviewLockedTitle": "Vous avez déjà évalué ce logement",
    "dynamic.reviewLockedHelper":
      "Utilisez les boutons ci-dessous pour modifier ou supprimer votre avis actuel.",
    "dynamic.reviewUnlockedHelper":
      "Un avis court et précis est plus utile qu'un long texte générique.",
    "dynamic.reviewReadyChip": "Prêt à noter",
    "dynamic.reviewAlreadySharedChip": "Avis déjà partagé",
    "dynamic.noReviewsYetShort": "Pas encore de note",
    "dynamic.manageYourReview": "Gérez votre avis",
    "dynamic.editReviewTitle": "Modifiez votre avis",
    "dynamic.editReviewText":
      "Ajustez le texte et la note pour qu'ils reflètent votre expérience réelle.",
    "dynamic.editReviewSubmit": "Enregistrer les modifications",
    "dynamic.updateReviewSuccess": "Avis modifié avec succès.",
    "dynamic.updateReviewFailed": "Échec de la modification de l'avis.",
    "dynamic.updateReviewError":
      "Une erreur est survenue lors de la modification de l'avis.",
    "dynamic.updatingReview": "Modification de votre avis...",
    "dynamic.deleteReviewTitle": "Supprimer votre avis ?",
    "dynamic.deleteReviewText":
      "Cette action supprime votre avis pour ce logement. Vous pourrez en ajouter un nouveau plus tard.",
    "dynamic.deleteReviewConfirm": "Supprimer maintenant",
    "dynamic.cancel": "Annuler",
    "dynamic.deleteReviewSuccess": "Avis supprimé avec succès.",
    "dynamic.deleteReviewFailed": "Échec de la suppression de l'avis.",
    "dynamic.deleteReviewError":
      "Une erreur est survenue lors de la suppression de l'avis.",
    "dynamic.deletingReview": "Suppression de votre avis...",
    "dynamic.reviewAlreadySharedText":
      "Vous avez déjà laissé un avis pour ce logement.",
    "dynamic.reviewAlreadySharedNote":
      "Vous pouvez le modifier ou le supprimer directement depuis ici.",
    "dynamic.lightboxDialog": "Galerie du logement agrandie",
    "dynamic.lightboxPrev": "Image précédente",
    "dynamic.lightboxNext": "Image suivante",
    "dynamic.lightboxClose": "Fermer l'aperçu de l'image",
    "dynamic.expandedImageAlt": "Image agrandie du logement",
    "dynamic.refinedStayContext": "séjour raffiné",
  },
};

function getStoredLanguage() {
  // Reads the last selected language from local storage.
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function getPreferredLanguage() {
  // Returns the saved language or the default one for first-time visitors.
  const storedLanguage = getStoredLanguage();

  if (storedLanguage === "fr" || storedLanguage === "en") {
    return storedLanguage;
  }

  return DEFAULT_LANGUAGE;
}

function getCurrentLanguage() {
  // Exposes the language currently applied to the document.
  return document.documentElement.dataset.language || DEFAULT_LANGUAGE;
}

function t(key, replacements = {}) {
  // Resolves a translation key and injects optional placeholder values.
  const language = getCurrentLanguage();
  const entry = TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en?.[key] ?? key;

  return String(entry).replace(/\{(\w+)\}/g, (match, token) => {
    return token in replacements ? String(replacements[token]) : match;
  });
}

function formatCountLabel(type, count) {
  // Builds pluralized labels used in dynamic UI summaries.
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
  // Formats a full price label for standalone text elements.
  return `${Number(price) || 0} € ${getCurrentLanguage() === "fr" ? "/ nuit" : "/ night"}`;
}

function formatPriceInline(price) {
  // Formats a short inline price string for cards and badges.
  return `€${Number(price) || 0} ${getCurrentLanguage() === "fr" ? "/ nuit" : "/ night"}`;
}

function formatUpToPrice(price) {
  // Formats a localized "up to" label for price filter options.
  return getCurrentLanguage() === "fr"
    ? `Jusqu'à ${price} €`
    : `Up to €${price}`;
}

function syncLanguageToggleState(language) {
  // Keeps the language toggle aligned with the active locale.
  const isFrench = language === "fr";

  for (const toggle of document.querySelectorAll(".language-toggle-input")) {
    toggle.checked = isFrench;
    toggle.setAttribute("aria-checked", String(isFrench));
  }
}

function applyStaticTranslations() {
  // Refreshes every static text node bound to a translation key.
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
  // Re-renders dynamic content after a language change.
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
  // Applies the selected language and optionally stores it.
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
  // Connects the language switch to the translation refresh flow.
  applyLanguage(getPreferredLanguage(), false);

  for (const toggle of document.querySelectorAll(".language-toggle-input")) {
    toggle.addEventListener("change", (event) => {
      const nextLanguage = event.currentTarget.checked ? "fr" : "en";
      applyLanguage(nextLanguage);
    });
  }
}

